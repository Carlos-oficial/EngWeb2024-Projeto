from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.user import User


def create(username, password):
    db = get_db()
    user = User(username=username, pass_hash=generate_password_hash(password))
    if db.users.find_one({"username": user["username"]}):
        raise Exception("username already in use")
    db.users.insert_one(user)


def get(username):
    db = get_db()
    return db.users.find_one({"username": username})
