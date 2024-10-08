from celery import shared_task
from flask import render_template
from flask_mail import Message
from extensions import db, mail
from models import User, Section, Book, UserVisit, BookIssue
import pdfkit
from datetime import datetime

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

@shared_task(name='tasks.send_daily_reminders')
def send_daily_reminders():
    from celery_worker import app as flask_app
    with flask_app.app_context():
        today = datetime.utcnow().date()
        start_of_day = datetime(today.year, today.month, today.day)
        
        # Find users who have not visited the app today
        users = User.query.outerjoin(UserVisit, User.id == UserVisit.user_id) \
            .filter((UserVisit.last_visit == None) | (UserVisit.last_visit < start_of_day)).all()
        
        for user in users:
            send_reminder(user.email)

def send_reminder(user_email):
    msg = Message('Daily Reminder', recipients=[user_email])
    msg.body = 'You have not visited the app today. Please visit to check the latest updates.'
    try:
        mail.send(msg)
        print(f"Reminder sent to {user_email}")
    except Exception as e:
        print(f"Failed to send reminder to {user_email}: {e}")

@shared_task(name='tasks.check_and_revoke_overdue_books')
def check_and_revoke_overdue_books():
    today = datetime.utcnow().date()
    users = User.query.all()  # Get all users

    for user in users:
        # Query all overdue books for the current user
        overdue_books = BookIssue.query.filter(
            BookIssue.user_id == user.id,
            BookIssue.status == True,
            BookIssue.date_return < today
        ).all()

        if overdue_books:
            try:
                # Remove all overdue books for the user
                for issue in overdue_books:
                    db.session.delete(issue)

                # Commit the transaction once
                db.session.commit()
                print(f"Revoked {len(overdue_books)} overdue books for user ID {user.id}.")
            except Exception as e:
                db.session.rollback()
                print(f"Failed to revoke overdue books for user ID {user.id}: {e}")

    return {user.id: [issue.book for issue in overdue_books] for user in users if overdue_books}  
    # Return a dictionary of user IDs to lists of the actual Book objects that were revoked
