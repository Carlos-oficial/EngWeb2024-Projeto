from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.resource import Resource

from bson.objectid import ObjectId

def list_all(**kwargs):
    db = get_db()
    return list(db.resources.find(kwargs))

def get(resource_id):
    db = get_db()
    return db.resources.find_one({"_id": ObjectId(resource_id)})

def add(resource: Resource):
    db = get_db()
    db.resources.insert_one(resource)

