from db import get_db
from werkzeug.security import check_password_hash, generate_password_hash
from flask import (
    Blueprint,
    g,
    jsonify,
    request,
)

from models.user import User

def create(username, password, producer=False):
    db = get_db()
    user = User(username,generate_password_hash(password),producer)
    if db.users.find_one({"username": user.username}):
        raise Exception("username already in use")
    db.users.insert_one(user.dict())


def get(username):
    db = get_db()
    return db.users.find_one({"username": username})
