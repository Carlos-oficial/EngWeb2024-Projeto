from bson.objectid import ObjectId
from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.course import Course


def list_all(**kwargs):
    db = get_db()
    return list(db.courses.find(kwargs))


def get(resource_id):
    db = get_db()
    return db.courses.find_one({"_id": ObjectId(resource_id)})

def get_by_name(name):
    db = get_db()
    return db.courses.find_one({"name": name})

def add(course: Course):
    db = get_db()
    if db.courses.find_one({"name": course["name"]}):
        raise Exception("course already exists")
    return db.courses.insert_one(course).inserted_id
