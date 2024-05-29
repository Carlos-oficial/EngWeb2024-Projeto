from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.resource import Resource


def list_all():
    db = get_db()
    return list(db.resources.find())


def add(resource: Resource):
    db = get_db()
    db.resources.insert_one(resource)
