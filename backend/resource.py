import json
import random

import requests
from flask import (
    Blueprint,
    g,
    jsonify,
    request,
    send_file
)

import backend.db as db
import os
resource_bp = Blueprint("resource", __name__, url_prefix="/resource")

import backend.controllers.resource as rc
import backend.models.resource as rm
from werkzeug.utils import secure_filename

from backend.config import config
@resource_bp.route("", methods=("GET", "POST"))
@resource_bp.route("/", methods=("GET", "POST"))
def resource():
    print(request)
    if request.method == "POST":
        print(dict(**request.form,file=request.files["file"].filename))
        rc.add(dict(**request.form,file=request.files["file"].filename))

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400


        if file: #  and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(config["UPLOAD_FOLDER"], filename)
            file.save(path)
            return jsonify({"success": "Resource added successfully"}), 201
    
        return jsonify({"error": "something went wrong"}), 400
    elif request.method == "GET":
        return jsonify([db.get_data(i) for i in rc.list_all(**request.args)])


@resource_bp.route("<resource_id>/file")
def get_resource_file(resource_id):
    resource = rc.get(resource_id)
    print(resource)
    if resource:
        file_path = os.path.join(config["UPLOAD_FOLDER"], resource["file"])
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    else:
        return jsonify({"error": "Resource not found"}), 404