from flask import Flask
from extensions import db, security, cache, mail
from create_initial_data import create_data
from celery_worker import make_celery


def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = "should-not-be-exposed"
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data.db"
    app.config['SECURITY_PASSWORD_SALT'] = 'salty-password'

    # Configure token
    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'
    app.config['SECURITY_TOKEN_MAX_AGE'] = 3600  # 1hr
    app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION'] = True

    # Cache config
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300
    app.config["DEBUG"] = True
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_PORT"] = 6379

    # Celery config
    app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
    app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/1'

    # Gmail SMTP configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False  # Make sure this is False when using TLS
    app.config['MAIL_USERNAME'] = 'manyasharma0309@gmail.com'
    app.config['MAIL_PASSWORD'] = 'fwgi ugrn jazn ssut'
    app.config['MAIL_DEFAULT_SENDER'] = 'manyasharma0309@gmail.com'

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    cache.init_app(app)

    with app.app_context():
        # Import models and routes here to avoid circular imports
        from models import User, Role
        from flask_security import SQLAlchemyUserDatastore
        import views
        import resources

        # Setup Flask-Security
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        security.init_app(app, user_datastore)

        # Create database tables
        db.create_all()

        # Create initial data
        create_data(user_datastore)

        # Register views and APIs
        views.create_view(app, user_datastore, cache)
        resources.api.init_app(app)  # Initialize Flask-RESTful

    # Security-related configurations
    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['SECURITY_CSRF_PROTECT_MECHANISHMS'] = []
    app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True

    return app


# Create Flask app and Celery app
app = create_app()
celery_app = make_celery(app)

if __name__ == "__main__":
    app.run(debug=False)
