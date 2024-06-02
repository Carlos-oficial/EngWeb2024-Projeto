import os

from flask import Blueprint, g, jsonify, request, send_file, session
from backend.views import auth 
from backend import db
from backend.config import config
import backend.controllers.course as courseController

# import backend.auth as auth
subject_bp = Blueprint("course", __name__, url_prefix="/course")


@subject_bp.route("", methods=["POST"])
@subject_bp.route("/", methods=["POST"])
@auth.login_required
def post_course():
    data = request.form
    return jsonify({"error": "something went wrong"}), 400


@subject_bp.route("", methods=["GET"])
@subject_bp.route("/", methods=["GET"])
def get_courses():
    return jsonify([db.get_data(i) for i in courseController.list_all(**request.args)])
