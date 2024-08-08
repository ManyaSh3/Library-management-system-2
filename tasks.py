from celery import shared_task
from flask import render_template
from flask_mail import Message
from extensions import db, mail
from models import User, Section, Book
import pdfkit

@shared_task(name='tasks.add')
def add(x, y):
    import time
    time.sleep(15)
    return x + y

@shared_task(name='tasks.generate_monthly_report')
def generate_monthly_report(user_email):
    from celery_worker import app as flask_app
    with flask_app.app_context():
        try:
            sections = Section.query.all()
            e_books = Book.query.all()

            html = render_template('monthly_report.html', sections=sections, e_books=e_books)

            pdf = pdfkit.from_string(html, False)

            msg = Message('Monthly Activity Report', recipients=[user_email])
            msg.body = 'Please find attached your monthly activity report.'
            msg.attach('monthly_report.pdf', 'application/pdf', pdf)

            mail.send(msg)
            print(f"Email sent to {user_email}")
        except Exception as e:
            print(f"Error generating report for {user_email}: {e}")


@shared_task(name='tasks.schedule_monthly_reports')
def schedule_monthly_reports():
    from celery_worker import app as flask_app
    with flask_app.app_context():
        users = User.query.all()
        for user in users:
            generate_monthly_report.delay(user.email)
            print(f"Scheduled report generation for {user.email}")
