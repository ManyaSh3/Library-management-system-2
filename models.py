from extensions import db
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsqla
import secrets
from datetime import datetime, timedelta

fsqla.FsModels.set_db_info(db)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean, default=True)
    fs_uniquifier = db.Column(db.String(80), nullable=False)
    roles = db.relationship('Role', secondary='user_roles')
    reset_password_token = db.Column(db.String(100), nullable=True)
    reset_password_expires = db.Column(db.DateTime, nullable=True)
    visits = db.relationship('UserVisit', back_populates='visitor', lazy=True, cascade="all, delete-orphan")

    def get_reset_password_token(self):
        token = secrets.token_urlsafe(16)
        self.reset_password_token = token
        self.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        return token

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'))

class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(32), nullable=False, unique=True)
    date_created = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    description = db.Column(db.String(256), nullable=True)
    books = db.relationship('Book', backref='section', lazy=True, cascade="all, delete-orphan")

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    author = db.Column(db.String(64), nullable=False)
    content = db.Column(db.String(512), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)

class BookIssue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_issued = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    date_return = db.Column(db.DateTime, nullable=False)
    days = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Boolean, nullable=False, default=True)

class BookRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_requested = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    days = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Boolean, nullable=False, default=True)

class RatingsAndReviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Float, nullable=True)
    review = db.Column(db.String(256), nullable=True)
    date_created = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

class UserVisit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    last_visit = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    visitor = db.relationship('User', back_populates='visits')