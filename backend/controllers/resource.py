from bson.objectid import ObjectId
from flask import Blueprint, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import get_db
from backend.models.resource import Resource
import backend.controllers.subject as subjectController
import backend.controllers.course as courseController

def list_all(**kwargs):
    db = get_db()
    return list(db.resources.find(kwargs))


def get(resource_id):
    db = get_db()
    return db.resources.find_one({"_id": ObjectId(resource_id)})

def unfold(resource: Resource):
    subject = subjectController.get(resource["subjectId"])
    course = courseController.get(resource["courseId"])
    resource["subject"] = subject
    resource["course"] = course
    return resource

def add(resource: Resource):
    db = get_db()
    db.resources.insert_one(resource)
