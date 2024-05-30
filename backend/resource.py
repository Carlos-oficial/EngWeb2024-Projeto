import json
import os
import random

import requests
from flask import Blueprint, g, jsonify, request, send_file
from werkzeug.utils import secure_filename

import backend.auth as auth
import backend.controllers.resource as ResourceController
import backend.controllers.user as UserController
import backend.db as db
from backend.config import config

resource_bp = Blueprint("resource", __name__, url_prefix="/resource")


@resource_bp.route("", methods=("GET", "POST"))
@resource_bp.route("/", methods=("GET", "POST"))
def resource():
    print(request)
    if request.method == "POST":
        print(dict(**request.form, file=request.files["file"].filename))
        ResourceController.add(
            dict(**request.form, file=request.files["file"].filename)
        )

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if file:  #  and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(config["UPLOAD_FOLDER"], filename)
            file.save(path)
            return jsonify({"success": "Resource added successfully"}), 201

        return jsonify({"error": "something went wrong"}), 400
    elif request.method == "GET":
        return jsonify(
            [db.get_data(i) for i in ResourceController.list_all(**request.args)]
        )


@resource_bp.route("/<resource_id>/file")
def get_resource_file(resource_id):
    resource = ResourceController.get(resource_id)
    print(resource)
    if resource:
        file_path = os.path.join(config["UPLOAD_FOLDER"], resource["file"])
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    else:
        return jsonify({"error": "Resource not found"}), 404


@resource_bp.route("/favorites", methods=("GET", "POST"))
# @auth.login_required
def favorites():  # TODO: usar sessões
    if request.method == "GET":
        if "user" not in request.args:
            return {}
        else:
            print(g.user)
            user_data = UserController.get(request.args["user"])
            favorites = user_data.get("favorites")
            if favorites is None:
                favorites = []
            resources = [
                db.get_data(ResourceController.get(favorite)) for favorite in favorites
            ]
            return resources
    elif request.method == "POST":
        if ResourceController.get(request.json["resource_id"]):
            UserController.add_favorite(
                request.json["user"], request.json["resource_id"]
            )
            return jsonify({"success": "Resource added to favorites"}), 201
        else:
            return jsonify({"error": "Resource not found"}), 404


# curl -X POST -H "Content-Type: application/json" -d '{"user": "user_id", "resource_id": "resource_id"}' http://localhost:5000/resource/favorites
