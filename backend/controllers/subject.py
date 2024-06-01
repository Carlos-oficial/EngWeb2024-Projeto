from bson.objectid import ObjectId
from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.subject import Subject


def list_all(**kwargs):
    db = get_db()
    return list(db.subjects.find(kwargs))


def get(subject_id):
    db = get_db()
    return db.subjects.find_one({"_id": ObjectId(subject_id)})

def get_by_name(name):
    db = get_db()
    return db.subjects.find_one({"name": name})



def add(subject: Subject):
    db = get_db()
    db.subjects.insert_one(subject)
