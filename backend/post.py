import os

from flask import Blueprint, g, jsonify, request, send_file
from werkzeug.utils import secure_filename

import backend.controllers.post as PostController
import backend.controllers.user as UserController
from backend import db
from backend.config import config

# import backend.auth as auth
post_bp = Blueprint("post", __name__, url_prefix="/post")


@post_bp.route("", methods=("GET", "POST"))
@post_bp.route("/<id>", methods=("GET", "POST"))
def get_post(id):
    return PostController.get(id)


@post_bp.route("", methods=("GET", "POST"))
@post_bp.route("/", methods=("GET", "POST"))
def post():
    if request.method == "POST":
        PostController.add(request.json)
        return jsonify({"success": "Post added successfully"}), 201
    if request.method == "GET":
        return jsonify(
            [db.get_data(i) for i in PostController.list_all(**request.args)]
        )
    return None