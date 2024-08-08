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
}

# Additional Celery configuration options
