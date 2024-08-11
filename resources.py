from flask_restful import Api, Resource, reqparse, fields, marshal_with
from flask_security import auth_required
from models import Section as SectionModel, Book as BookModel, BookRequest, BookIssue ,User as UserModel, RatingsAndReviews
from extensions import db,cache,mail
from flask_mail import Message
from datetime import datetime, timedelta
from flask import jsonify
from flask import request
from flask_security import current_user
from sqlalchemy import func
import io
import matplotlib.pyplot as plt
from flask import send_file
import matplotlib
from flask_security.utils import hash_password, verify_password
from time import time
matplotlib.use('Agg')


api = Api(prefix='/api')

# Define the request parser and expected arguments for sections
section_parser = reqparse.RequestParser()
section_parser.add_argument('title', type=str, required=True, help='Title cannot be blank!')
section_parser.add_argument('description', type=str, required=False)

# Define the request parser and expected arguments for books
book_parser = reqparse.RequestParser()
book_parser.add_argument('title', type=str, required=True, help='Title cannot be blank!')
book_parser.add_argument('author', type=str, required=True, help='Author cannot be blank!')
book_parser.add_argument('content', type=str, required=True, help='Content cannot be blank!')

# Define the request parser and expected arguments for book requests
book_request_parser = reqparse.RequestParser()
book_request_parser.add_argument('book_id', type=int, required=True, help='Book ID cannot be blank!')
book_request_parser.add_argument('user_id', type=int, required=True, help='User ID cannot be blank!')
book_request_parser.add_argument('days', type=int, required=True, help='Days cannot be blank!')

user_update_parser = reqparse.RequestParser()
user_update_parser.add_argument('username', type=str, required=True, help='Username cannot be blank!')
user_update_parser.add_argument('email', type=str, required=True, help='Email cannot be blank!')
user_update_parser.add_argument('password', type=str, required=True, help='Password cannot be blank!')



# Define the fields for marshalling the output
section_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'description': fields.String
}

book_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'author': fields.String,
    'content': fields.String,
    'section_id': fields.Integer,
    'date_created': fields.DateTime,
}

book_request_fields = {
    'id': fields.Integer,
    'book_id': fields.Integer,
    'user_id': fields.Integer,
    'date_requested': fields.DateTime,
    'status': fields.Boolean,
    'days': fields.Integer,
    'book_title': fields.String,
    'book_author': fields.String,
}

def format_datetime(value):
    if isinstance(value, datetime):
        return value.strftime('%Y-%m-%d %H:%M:%S')
    return value

borrowed_book_fields = {
    'id': fields.Integer,
    'book_id': fields.Integer,
    'user_id': fields.Integer,
    'date_issued': fields.String(attribute=lambda x: format_datetime(x.date_issued)),
    'date_return': fields.String(attribute=lambda x: format_datetime(x.date_return)),
    'status': fields.Boolean,
    'days': fields.Integer,
    'title': fields.String,
    'author': fields.String,
}

class SectionResource(Resource):
    @auth_required('token')
    @marshal_with(section_fields)
    @cache.cached(timeout=300,key_prefix=lambda:'all_sections_' + str(time()))
    def get(self):
        all_sections = SectionModel.query.all()
        return all_sections

    @auth_required('token')
    def post(self):
        args = section_parser.parse_args()
        section = SectionModel(
            title=args['title'],
            description=args.get('description'),
            date_created=db.func.current_timestamp(),
        )
        db.session.add(section)
        db.session.commit()
        return {'message': 'Section added'}, 200

class BookResource(Resource):
    @auth_required('token')
    @marshal_with(book_fields)
    @cache.cached(timeout=300, key_prefix=lambda:'books_section_' + str(time()))
    def get(self, section_id):
        books = BookModel.query.filter_by(section_id=section_id).all()
        return books

    @auth_required('token')
    def post(self, section_id):
        args = book_parser.parse_args()
        book = BookModel(
            title=args['title'],
            author=args['author'],
            content=args['content'],
            date_created=db.func.current_timestamp(),
            section_id=section_id
        )
        db.session.add(book)
        db.session.commit()
        return {'message': 'Book added'}, 200

class BookRequestResource(Resource):
    @auth_required('token')
    def post(self):
        args = book_request_parser.parse_args()
        book_id = args['book_id']
        user_id = args['user_id']
        days = args['days']

        if not (1 <= days <= 7):
            return {'message': 'Days must be between 1 and 7'}, 400

        # Check if the user has already requested the same book
        existing_request = BookRequest.query.filter_by(book_id=book_id, user_id=user_id).first()
        already_issued = BookIssue.query.filter_by(book_id=book_id, user_id=user_id, status=True).first()
        if existing_request :
            return {'message': 'You have already requested this book.'}, 400
        if already_issued :
            return {'message': 'You have already issued this book.'}, 400
        active_requests_count = BookRequest.query.filter_by(user_id=user_id, status=True).count()
        
        if active_requests_count >= 5:
            return {'message': 'You have already requested the maximum number of books'}, 400

        try:
            book_request = BookRequest(
                book_id=book_id,
                user_id=user_id,
                date_requested=db.func.current_timestamp(),
                days=days,  
                status=True
            )
            db.session.add(book_request)
            db.session.commit()
            return {'message': 'Book requested successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error while requesting book: {e}'}, 500


class BookRequestListResource(Resource):
    @auth_required('token')
    @marshal_with(book_request_fields)
    @cache.cached(timeout=60, key_prefix=lambda:'book_requests_' + str(time()))
    def get(self):
        # Perform a join between BookRequest and Book to get the title and author
        all_requests = db.session.query(
            BookRequest,
            BookModel.title.label('book_title'),
            BookModel.author.label('book_author')
        ).join(BookModel, BookRequest.book_id == BookModel.id).all()

        # Manually map the results to include title and author with BookRequest fields
        result = []
        for request, title, author in all_requests:
            request.book_title = title
            request.book_author = author
            result.append(request)

        return result


class BookRequestApproveResource(Resource):
    @auth_required('token')
    def post(self, request_id):
        try:
            book_request = BookRequest.query.get(request_id)
            if not book_request:
                return {'message': 'Request not found'}, 404
            
            active_issues_count = BookIssue.query.filter_by(user_id=book_request.user_id).count()
            
            if active_issues_count >= 5:
                return {'message': 'User has already issued the maximum number of books'}, 400
            
            date_issued = datetime.now()
            date_return = date_issued + timedelta(days=book_request.days)
            
            # Add entry to BookIssue model
            book_issue = BookIssue(
                book_id=book_request.book_id,
                user_id=book_request.user_id,
                date_issued=date_issued,
                date_return=date_return,
                days=book_request.days,  # Ensure days is set correctly
                status=True
            )
            db.session.add(book_issue)
            
            # Delete the book request after approval
            db.session.delete(book_request)
            db.session.commit()
            
            return {'message': 'Book request approved and issued'}, 200
        except Exception as e:
            print(f'Error while approving request: {e}')
            db.session.rollback()
            return {'message': 'Error while approving request'}, 500

class BookRequestRejectResource(Resource):
    @auth_required('token')
    def post(self, request_id):
        try:
            book_request = BookRequest.query.get(request_id)
            if not book_request:
                return {'message': 'Request not found'}, 404
            
            # Delete the book request upon rejection
            db.session.delete(book_request)
            db.session.commit()
            
            return {'message': 'Book request rejected'}, 200
        except Exception as e:
            print(f'Error while rejecting request: {e}')
            db.session.rollback()
            return {'message': 'Error while rejecting request'}, 500

class BorrowedBooksResource(Resource):
    @auth_required('token')
    @marshal_with(borrowed_book_fields)
    @cache.cached(timeout=60, key_prefix=lambda:'borrowed_books_user_' + str(time()))
    def get(self, user_id):
        borrowed_books = db.session.query(
            BookIssue.id,
            BookIssue.book_id,
            BookIssue.user_id,
            BookIssue.date_issued,
            BookIssue.date_return,
            BookIssue.days,
            BookIssue.status,
            BookModel.title.label('title'),
            BookModel.author.label('author')
        ).join(BookModel, BookIssue.book_id == BookModel.id).filter(BookIssue.user_id == user_id).all()

        # Debug logging
        for book in borrowed_books:
            print(f'Debug: book_id={book.book_id}, user_id={book.user_id}, date_issued={book.date_issued}, date_return={book.date_return}, title={book.title}, author={book.author}')
            if book.date_issued and not isinstance(book.date_issued, datetime):
                print(f'Debug: date_issued is not datetime: {book.date_issued}')
            if book.date_return and not isinstance(book.date_return, datetime):
                print(f'Debug: date_return is not datetime: {book.date_return}')
        
        return borrowed_books

class BookCountResource(Resource):
    @auth_required('token')
    @cache.cached(timeout=300,key_prefix=lambda: 'book_count_' + str(time()))
    def get(self):
        try:
            total_books = db.session.query(BookModel).count()
            return jsonify({'count': total_books})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

class SectionCountResource(Resource):
    
    @auth_required('token')
    @cache.cached(timeout=30,key_prefix=lambda: 'section_count_' + str(time()))
    def get(self):
        try:
            total_sections = db.session.query(SectionModel).count()
            return jsonify({'count': total_sections})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

class PendingRequestCountResource(Resource):
    @auth_required('token')
    @cache.cached(timeout=60,key_prefix=lambda: 'pending_request_count_' + str(time()))
    def get(self):
        try:
            pending_requests = db.session.query(BookRequest).count()
            return jsonify({'count': pending_requests})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

class SingleSectionResource(Resource):
    @auth_required('token')
    @marshal_with(section_fields)
    @cache.cached(timeout=300, key_prefix=lambda:'section_' + str(time()))
    def get(self, section_id):
        section = SectionModel.query.get(section_id)
        if not section:
            return {'message': 'Section not found'}, 404
        return section

    @auth_required('token')
    def put(self, section_id):
        args = section_parser.parse_args()
        section = SectionModel.query.get(section_id)
        if not section:
            return {'message': 'Section not found'}, 404
        section.title = args['title']
        section.description = args.get('description')
        db.session.commit()
        return {'message': 'Section updated'}, 200

    
class SingleDeleteSectionResource(Resource):
    @auth_required('token')
    def delete(self, section_id):
        section = SectionModel.query.get(section_id)
        if not section:
            return {'message': 'Section not found'}, 404
        db.session.delete(section)
        db.session.commit()        
        return {'message': 'Section deleted'}, 200
    
class BooksBySectionResource(Resource):
    @auth_required('token')
    @marshal_with(book_fields)
    @cache.cached(timeout=300,key_prefix=lambda:'books_section_' + str(time()))
    def get(self, section_id):
        books = BookModel.query.filter_by(section_id=section_id).all()
        if not books:
            return {'message': 'No books found for this section'}, 404
        return books
    
class DeleteBookResource(Resource):
    @auth_required('token')
    def delete(self, book_id):
        book = BookModel.query.get(book_id)
        if not book:
            return {'message': 'Book not found'}, 404
        
        # Delete related book_issue records
        BookIssue.query.filter_by(book_id=book_id).delete()
        BookRequest.query.filter_by(book_id=book_id).delete()
        
        # Now delete the book
        db.session.delete(book)
        db.session.commit()        
        return {'message': 'Book deleted'}, 200

    
class EditBookResource(Resource):
    @auth_required('token')
    def get(self, book_id):
        book = BookModel.query.get(book_id)
        if not book:
            return {'message': 'Book not found'}, 404
        return {'title': book.title, 'author': book.author, 'content': book.content}
    
    @auth_required('token')
    def put(self, book_id):
        args = book_parser.parse_args()
        book = BookModel.query.get(book_id)
        if not book:
            return {'message': 'Book not found'}, 404
        book.title = args['title']
        book.author = args['author']
        book.content = args['content']
        db.session.commit()
        return {'message': 'Book updated'}, 200

class ReturnBookResource(Resource):
    @auth_required('token')
    def post(self, book_id):
        print(f"Attempting to return book with ID: {book_id}")
        book_issue = BookIssue.query.filter_by(book_id=book_id, status=True).first()
        if not book_issue:
            print(f"No active book issue found for book ID: {book_id}")
            return {'message': 'Active book issue not found'}, 404

        db.session.delete(book_issue)
        db.session.commit()
        print(f"Book with ID: {book_id} successfully returned.")
        return {'message': 'Book returned successfully'}, 200


class ForgotPasswordResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='Email cannot be blank!')
        args = parser.parse_args()

        user = UserModel.query.filter_by(email=args['email']).first()

        if user:
            reset_token = user.get_reset_password_token()
            reset_url = f"{request.url_root}#/reset-password?token={reset_token}"

            # Send the email with the reset link
            msg = Message(subject="Password Reset Request",
                          sender='manyasharma0309@gmail.com',
                          recipients=[user.email])
            msg.body = f"To reset your password, click the following link: {reset_url}\n\nIf you did not request this, please ignore this email."
            mail.send(msg)

            return {'message': 'Password reset email has been sent'}, 200
        else:
            return {'message': 'Email not found'}, 404

class ResetPasswordResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=str, required=True, help='Token cannot be blank!')
        parser.add_argument('new_password', type=str, required=True, help='Password cannot be blank!')
        args = parser.parse_args()

        user = UserModel.query.filter_by(reset_password_token=args['token']).first()

        if user and user.reset_password_expires > datetime.utcnow():
            user.password = hash_password(args['new_password'])
            user.reset_password_token = None
            user.reset_password_expires = None
            db.session.commit()
            return {'message': 'Password has been reset successfully'}, 200
        else:
            return {'message': 'Invalid or expired token'}, 400

class IssuedBooksResource(Resource):
    @auth_required('token')
    def get(self):
        try:
            issued_books = db.session.query(
                BookIssue.id,
                BookModel.title,
                BookModel.author,
                UserModel.id.label('user_id'),
                BookIssue.date_issued,
                BookIssue.date_return,
            ).join(BookModel, BookIssue.book_id == BookModel.id)\
             .join(UserModel, BookIssue.user_id == UserModel.id).all()

            issued_books_list = [
                {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'user_id': book.user_id,
                    'date_issued': book.date_issued,
                    'date_return': book.date_return,
                }
                for book in issued_books
            ]
            return jsonify(issued_books_list)
        except Exception as e:
            return {'message': f'Error fetching issued books: {e}'}, 500


class RevokeAccessResource(Resource):
    @auth_required('token')
    def delete(self, book_id):
        try:
            book_issue = BookIssue.query.filter_by(book_id=book_id).first()
            if not book_issue:
                return {'message': 'Book issue not found'}, 404

            db.session.delete(book_issue)
            db.session.commit()
            return {'message': 'Access revoked and book issue deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error revoking access: {e}'}, 500

class BookDetailsResource(Resource):
    @auth_required('token')
    @cache.cached(timeout=300, key_prefix=lambda:'book_details_' + str(time()))
    def get(self, book_id):
        book = BookModel.query.get(book_id)
        if not book:
            return {'message': 'Book not found'}, 404
        return {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'content': book.content,
            # 'date_created': book.date_created,
        }, 200


class SubmitReviewResource(Resource):
    @auth_required('token')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=int, required=True, help='User ID cannot be blank!')
        parser.add_argument('bookId', type=int, required=True, help='Book ID cannot be blank!')
        parser.add_argument('rating', type=float, required=True, help='Rating cannot be blank!')
        parser.add_argument('review', type=str, required=True, help='Review cannot be blank!')
        args = parser.parse_args()

        existing_review = RatingsAndReviews.query.filter_by(user_id=args['userId'], book_id=args['bookId']).first()
        if existing_review:
            return {'message': 'You have already submitted a review for this book.'}, 400


        review = RatingsAndReviews(
            user_id=args['userId'],
            book_id=args['bookId'],
            rating=args['rating'],
            review=args['review'],
            date_created=db.func.current_timestamp(),
        )
        db.session.add(review)
        db.session.commit()
        return {'message': 'Review submitted successfully'}, 200
class RatingsAndReviewsResource(Resource):
    @auth_required('token')
    def get(self):
        try:
            ratings_and_reviews = db.session.query(
                RatingsAndReviews.id,
                BookModel.title,
                BookModel.author,
                UserModel.id.label('user_id'),
                RatingsAndReviews.rating,
                RatingsAndReviews.review,
                RatingsAndReviews.date_created,
            ).join(BookModel, RatingsAndReviews.book_id == BookModel.id)\
             .join(UserModel, RatingsAndReviews.user_id == UserModel.id).all()

            ratings_and_reviews_list = [
                {
                    'id': review.id,
                    'title': review.title,
                    'author': review.author,
                    'user_id': review.user_id,
                    'rating': review.rating,
                    'review': review.review,
                    'date_created': review.date_created,
                }
                for review in ratings_and_reviews
            ]
            return jsonify(ratings_and_reviews_list)
        except Exception as e:
            return {'message': f'Error fetching ratings and reviews: {e}'}, 500

class UpdateProfileResource(Resource):
    @auth_required('token')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('current_email', type=str, required=True, help='Current email cannot be blank!')
        parser.add_argument('new_email', type=str, required=True, help='New email cannot be blank!')
        parser.add_argument('username', type=str, required=True, help='Username cannot be blank!')
        parser.add_argument('password', type=str, required=False)
        args = parser.parse_args()

        user = UserModel.query.filter_by(email=args['current_email']).first()

        if not user:
            return {'message': 'User not found'}, 404

        user.email = args['new_email']
        user.username = args['username']
        if args['password']:
            hashed_password = hash_password(args['password'])
            user.password = hashed_password
        db.session.commit()
        return {'message': 'Profile updated successfully'}, 200



class UserBarDataResource(Resource):
    @auth_required()
    def get(self):
        """
        Fetches the total number of books per section for the logged-in user.
        Includes the section names.
        """
        user_id = current_user.id
        sections = db.session.query(SectionModel.title, func.count(BookModel.id))\
            .join(BookModel, BookModel.section_id == SectionModel.id)\
            .join(BookIssue, BookModel.id == BookIssue.book_id)\
            .filter(BookIssue.user_id == user_id)\
            .group_by(SectionModel.title).all()

        labels = [section_title for section_title, count in sections]
        values = [count for section_title, count in sections]

        return jsonify({'labels': labels, 'data': values})


class UserLineDataResource(Resource):
    @auth_required()
    def get(self):
        """
        Fetches the number of book issues over time for the logged-in user.
        """
        user_id = current_user.id
        book_issues = db.session.query(BookIssue.date_issued, func.count(BookIssue.id))\
            .filter(BookIssue.user_id == user_id)\
            .group_by(BookIssue.date_issued).all()

        labels = [date_issued.strftime('%Y-%m-%d') for date_issued, count in book_issues]
        values = [count for date_issued, count in book_issues]

        return jsonify({'labels': labels, 'data': values})



    
class LibrarianBarDataResource(Resource):
    @auth_required('token')
    def get(self):
        sections = db.session.query(BookModel.section_id, SectionModel.title, func.count(BookModel.id))\
                              .join(SectionModel, BookModel.section_id == SectionModel.id)\
                              .group_by(BookModel.section_id, SectionModel.title).all()
        labels = [section_title for section_id, section_title, count in sections]
        values = [count for section_id, section_title, count in sections]

        return {'labels': labels, 'values': values}




class LibrarianLineDataResource(Resource):
    @auth_required('token')
    def get(self):
        book_issues = db.session.query(BookIssue.date_issued, db.func.count(BookIssue.id)).group_by(BookIssue.date_issued).all()
        labels = [date_issued.strftime('%Y-%m-%d') for date_issued, count in book_issues]
        values = [count for date_issued, count in book_issues]

        return {'labels': labels, 'values': values}

class LibrarianPieDataResource(Resource):
    @auth_required('token')
    def get(self):
        # Query the number of books issued, grouped by user
        issued_books = db.session.query(BookIssue.user_id, db.func.count(BookIssue.id)).group_by(BookIssue.user_id).all()
        
        # Generate labels and values for the pie chart
        labels = [f'User {user_id}' for user_id, count in issued_books]
        values = [count for user_id, count in issued_books]

        return {'labels': labels, 'values': values}


class BookRatingsResource(Resource):
    def get(self, book_id):
        book = BookModel.query.get_or_404(book_id)
        reviews = RatingsAndReviews.query.filter_by(book_id=book.id).all()
        
        ratings = [{
            'rating': review.rating,
            'review': review.review,
            'date_created': review.date_created
        } for review in reviews]
        
        return jsonify({
            'book_id': book.id,
            'title': book.title,
            'author': book.author,
            'ratings': ratings
        })




# Add the resources to the API
api.add_resource(SectionResource, '/sections')
api.add_resource(BookResource, '/sections/<int:section_id>/books')
api.add_resource(BookRequestResource, '/request-book')
api.add_resource(BookRequestListResource, '/book-requests')
api.add_resource(BookRequestApproveResource, '/book-requests/<int:request_id>/approve')
api.add_resource(BookRequestRejectResource, '/book-requests/<int:request_id>/reject')
api.add_resource(BorrowedBooksResource, '/borrowed-books/<int:user_id>')
api.add_resource(BookCountResource, '/books/count')
api.add_resource(SectionCountResource, '/sections/count')
api.add_resource(PendingRequestCountResource, '/requests/pending/count')
api.add_resource(SingleSectionResource, '/edit-section/<int:section_id>')
api.add_resource(SingleDeleteSectionResource, '/delete-section/<int:section_id>')
api.add_resource(BooksBySectionResource, '/view-section/<int:section_id>')
api.add_resource(DeleteBookResource, '/delete-book/<int:book_id>')
api.add_resource(EditBookResource, '/edit-book/<int:book_id>')
api.add_resource(ReturnBookResource, '/return-book/<int:book_id>')
api.add_resource(ForgotPasswordResource, '/forgot-password')
api.add_resource(ResetPasswordResource, '/reset-password')
api.add_resource(IssuedBooksResource, '/issued-books')
api.add_resource(RevokeAccessResource, '/revoke-access/<int:book_id>')
api.add_resource(BookDetailsResource, '/rate-and-review/<int:book_id>')
api.add_resource(SubmitReviewResource, '/review')
api.add_resource(RatingsAndReviewsResource, '/ratings-and-reviews')
api.add_resource(UpdateProfileResource, '/update-profile')
api.add_resource(UserBarDataResource, '/user-bar-data')
api.add_resource(UserLineDataResource, '/user-line-data')
api.add_resource(LibrarianBarDataResource, '/librarian-bar-data')
api.add_resource(LibrarianLineDataResource, '/librarian-line-data')
api.add_resource(LibrarianPieDataResource, '/librarian-pie-data')
api.add_resource(BookRatingsResource, '/books/<int:book_id>/ratings')