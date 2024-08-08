
from flask_security import SQLAlchemySessionUserDatastore
from extensions import db
from flask_security.utils import hash_password


def create_data(user_datastore : SQLAlchemySessionUserDatastore):
    print("creating roles and users") # for debug purposes

    # creating roles

    user_datastore.find_or_create_role(name='librarian', description="Librarian")
    user_datastore.find_or_create_role(name='user', description="User")

    # Creating initial data
    if not user_datastore.find_user(email="librarian@iitm.ac.in"):
        user_datastore.create_user(email="librarian@iitm.ac.in", password=hash_password("pass"), roles=['librarian'])

    if not user_datastore.find_user(email="user@iitm.ac.in"):
        user_datastore.create_user(email="user@iitm.ac.in", password=hash_password("pass"), roles=['user'])

    # create dummy study resource

    db.session.commit()
