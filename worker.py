from celery import Celery, Task
from flask import Flask

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.import_name, task_cls=FlaskTask)
    
    # Load Celery config from celeryconfig.py
    celery_app.config_from_object('celeryconfig')
    
    # Add the Celery app to the Flask app extensions
    app.extensions["celery"] = celery_app
    
    return celery_app
