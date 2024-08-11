# Library Management System V2

## Overview

The Library Management System V2 is a modern, multi-user application designed to manage and issue e-books. The system is built with a focus on providing a seamless experience for both librarians and general users, allowing for efficient e-book management and streamlined user interactions.

## Technologies Used

- **Backend**: Flask
- **Frontend**: VueJS, Jinja2 Templates
- **Database**: SQLite
- **Caching**: Redis
- **Batch Jobs**: Redis and Celery
- **Styling**: Bootstrap

## Features

- **User Roles**:
    - **Librarian**: Manages e-books, issues and revokes access to books, and oversees the overall system.
    - **General User**: Can register, login, request, read, and return e-books.

- **Section and Book Management**:
     - Add, edit, or delete sections and e-books.
     - Search functionality for sections and e-books based on various criteria.

- **Authentication**:
    - User and Librarian login using username or email and password.
    - Flask Security or JWT-based Token Authentication.

- **E-Book Management**:
    - Issue and revoke access to e-books.
    - Request and return e-books with a defined access period.

- **Automated Jobs**:
    - Daily Reminders: Send reminders to users who haven't visited the app.
    - Monthly Activity Reports: Generate and send activity reports via email.

- **Download e-books as PDFs**: Option to purchase and download e-books.

## Installation and Usage

1. Clone the repository to your local machine:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```bash
    cd <project-directory>
    ```

3. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Set up Redis:
    ```bash
    redis-server
    ```

5. Run Celery Worker:
    ```bash
    celery -A celery_worker.celery_app worker -B -l info
    ```

6. Run the application:

    ```bash
    python app.py
    ```

5. Access the application in your web browser at `http://localhost:5000`.
