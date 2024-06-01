import os

from flask import Blueprint, g, jsonify, request, send_file, session

import backend.controllers.subject as SubjectController
from backend import db
from backend.config import config
from backend.views import auth

# import backend.auth as auth
subject_bp = Blueprint("subject", __name__, url_prefix="/subject")


@subject_bp.route("", methods=["POST"])
@subject_bp.route("/", methods=["POST"])
@auth.login_required
def post_subject():
    data = request.form
    return jsonify({"error": "something went wrong"}), 400


@subject_bp.route("", methods=["GET"])
@subject_bp.route("/", methods=["GET"])
def get_subjects():
    return jsonify([db.get_data(i) for i in SubjectController.list_all(**request.args)])
