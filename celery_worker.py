from celery import Celery, Task
from flask import Flask
from extensions import db, mail

def create_app():
    app = Flask(__name__)
    app.config.update(
        CELERY_BROKER_URL='redis://localhost:6379/0',
        CELERY_RESULT_BACKEND='redis://localhost:6379/1',
        SQLALCHEMY_DATABASE_URI='sqlite:///data.db',
        SECRET_KEY='should-not-be-exposed',
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USE_SSL=False,
        MAIL_USERNAME='manyasharma0309@gmail.com',
        MAIL_PASSWORD='fwgi ugrn jazn ssut',
        MAIL_DEFAULT_SENDER='manyasharma0309@gmail.com'
    )
    
    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    
    return app

def make_celery(app):
    celery = Celery(
        app.import_name,
        broker=app.config['CELERY_BROKER_URL'],
        backend=app.config['CELERY_RESULT_BACKEND']
    )

    class ContextTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    celery.config_from_object('celeryconfig')
    celery.autodiscover_tasks(lambda: ['tasks'])
    return celery

# Create Flask app and Celery app
app = create_app()
celery_app = make_celery(app)

import tasks  # Import tasks after app and celery are set up
