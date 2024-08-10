from celery.schedules import crontab

# Celery configuration
broker_url = 'redis://localhost:6379/0'
result_backend = 'redis://localhost:6379/1'
timezone = 'Asia/Kolkata'

# Celery Beat schedule
beat_schedule = {
    'schedule-monthly-reports': {
        'task': 'tasks.schedule_monthly_reports',
        'schedule': crontab(minute=0, hour=0, day_of_month=1),  # Run at midnight on the 1st of each month
    },
    'send-daily-reminders': {
        'task': 'tasks.send_daily_reminders',
        'schedule': crontab(minute=0, hour=18),  # Run at 6:00 PM every day
    },
    'check-and-revoke-overdue-books': {
        'task': 'tasks.check_and_revoke_overdue_books',
        'schedule': crontab(minute=0, hour=0),  # Run at 12:00 AM every day
    },
}

# Additional Celery configuration options
