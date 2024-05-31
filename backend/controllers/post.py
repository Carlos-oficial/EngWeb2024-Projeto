from bson.objectid import ObjectId
from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.post import Post


def list_all(**kwargs):
    db = get_db()
    return list(db.posts.find(kwargs))

def list_by_user(username):
    return list_all(user=username)

def list_by_subject(subject):
    db=get_db()
    resources = db.resources.find({"subject":subject})
    return db.posts.find({"resource": {"$in": resources}})
    


def get(post_id):
    db = get_db()
    return db.posts.find_one({"_id": ObjectId(post_id)})



def add(post: Post):
    db = get_db()
    db.posts.insert_one(post)
