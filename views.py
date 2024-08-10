from flask import render_template_string, render_template, request, jsonify, session
from flask_security import current_user, auth_required, roles_required, SQLAlchemyUserDatastore
from flask_security.utils import hash_password, verify_password
from extensions import db
from models import User, Role, Book, Section, BookIssue, BookRequest, UserVisit
from datetime import datetime
from celery.result import AsyncResult 

def create_view(app, user_datastore : SQLAlchemyUserDatastore,cache):

    @app.route('/test-db-visit')
    def test_db_visit():
        visits = UserVisit.query.all()
        return jsonify([{'id': v.id, 'user_id': v.user_id, 'last_visit': v.last_visit} for v in visits])

    
    def log_user_visit(email, id):
        print(f"Logging visit for user: {email} (ID: {id})")
        
        # Check if a visit record already exists for the user
        visit = UserVisit.query.filter_by(user_id=id).first()
        
        if visit:
            # If the record exists, update the last_visit time
            visit.last_visit = datetime.utcnow()
            print(f"Updated last visit time for user: {email} (ID: {id})")
        else:
            # If no record exists, create a new visit record
            visit = UserVisit(user_id=id, last_visit=datetime.utcnow())
            db.session.add(visit)
            print(f"Created new visit record for user: {email} (ID: {id})")
        
        try:
            db.session.commit()
            print("Visit logged successfully")
        except Exception as e:
            db.session.rollback()
            print(f"Error logging visit: {e}")

   

    @app.route('/trigger-monthly-report')
    def trigger_monthly_report():
        from tasks import schedule_monthly_reports
        schedule_monthly_reports.delay()
        return jsonify({"status": "Monthly report generation triggered"})
    
    @app.route('/test-report')
    def test_report():
        sections = Section.query.all()
        e_books = Book.query.all()
        return render_template('monthly_report.html', sections=sections, e_books=e_books)

    @app.route('/test-celery')
    def test_celery():
        from tasks import add
        result = add.delay(4, 4)
        return jsonify({"task_id": result.id, "status": result.status})
    
    @app.route('/task-status/<task_id>')
    def task_status(task_id):
        from tasks import add
        result = add.AsyncResult(task_id)
        return jsonify({"task_id": task_id, "status": result.status, "result": result.result})


    # cache test
    @app.route('/cache-test')
    @cache.cached(timeout = 5)
    def cache_test():
        return jsonify({"time" : datetime.now()})

    @app.route('/')
    def index():
        return render_template("index.html")
    
    # views.py
    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not email or not password or role not in ['librarian', 'user']:
            return jsonify({"message": "invalid input"}), 400

        if user_datastore.find_user(email=email):
            return jsonify({"message": "user already exists"}), 400

        # Assuming librarians should be active as well
        active = True
        
        try:
            user_datastore.create_user(email=email, password=hash_password(password), roles=[role], active=active)
            db.session.commit()
        except Exception as e:
            print(f'Error while creating user: {e}')
            db.session.rollback()
            return jsonify({'message': 'error while creating user'}), 500
        
        return jsonify({'message': 'user created'}), 200


    @app.route('/user-login', methods=['POST'])
    def user_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'email or password not provided'}), 400

        user = user_datastore.find_user(email=email)

        if not user:
            return jsonify({'message': 'invalid user'}), 400

        if verify_password(password, user.password): 
            token = user.get_auth_token()
            user_role = user.roles[0].name if user.roles else 'No role'
            print(f"Login successful for user: {email}, role: {user_role}, token: {token}")

            # Log user visit
            log_user_visit(user.email,user.id)

            return jsonify({'token': token, 'email': user.email, 'role': user_role, 'user_id': user.id}), 200
        else:
            return jsonify({'message': 'invalid password'}), 400


    @app.route('/profile')
    @auth_required('token')
    def profile():
        print(f"Accessing profile: current_user={current_user.email}, roles={[role.name for role in current_user.roles]}")
        return render_template_string(
            """
            <h1>Profile</h1>
            <h3>Welcome {{ current_user.email }}</h3>
            <p>Click <a href="/logout">here</a> to logout</p>
            """
        )

    @app.route('/librarian-dashboard')
    @roles_required('librarian')
    def librarian_dashboard():
        print(f"Accessing librarian dashboard: current_user={current_user.email}, roles={[role.name for role in current_user.roles]}")
        return render_template_string(
            """
            <h1>Librarian Dashboard</h1>
            <p>Click <a href="/logout">here</a> to logout</p>
            """
        )

    @app.route('/user-dashboard')
    @roles_required('user')
    def user_dashboard():
        print(f"Accessing user dashboard: current_user={current_user.email}, roles={[role.name for role in current_user.roles]}")
        return render_template_string(
            """
            <h1>User Dashboard</h1>
            <p>Click <a href="/logout">here</a> to logout</p>
            """
        )
    
   
    @app.route('/add-section', methods=['POST'])
    @roles_required('librarian')
        # @auth_required('token')
    def add_section():
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')

        if not title or not description:
            return jsonify({'message': 'Missing required fields'}), 400

        try:
            new_section = Section(
                title=title,
                description=description,
                date_created=db.func.current_timestamp(),
            )
            db.session.add(new_section)
            db.session.commit()
            return jsonify({'message': 'Section added successfully'}), 200
        except Exception as e:
            print(f'Error while adding section: {e}')
            db.session.rollback()
            return jsonify({'message': 'Error while adding section'}), 500

    @app.route('/sections', methods=['GET'])
    @auth_required('token')
    def get_sections():
        sections = Section.query.all()
        return jsonify([{'id': section.id, 'title': section.title, 'description': section.description} for section in sections])
