from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.user import User


def create(username, password):
    db = get_db()
    collection = db.users
    user = User(username=username, pass_hash=generate_password_hash(password))
    if collection.find_one({"username": user["username"]}):
        raise Exception("username already in use")
    collection.insert_one(user)


def get(username):
    db = get_db()
    collection = db.users
    return collection.find_one({"username": username})


# controllers/user.py


def add_favorite(user_id, resource_id):
    db = get_db()
    collection = db.users
    user = get(user_id)
    if not user:
        raise Exception("User not found")
    if user:
        favorites = user.get("favorites")
        if favorites is None:
            favorites = []
        if resource_id not in favorites:
            favorites.append(resource_id)
            collection.update_one(
                {"username": user_id}, {"$set": {"favorites": favorites}}
            )
