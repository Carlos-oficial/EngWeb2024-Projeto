import json
import random

import requests
from flask import (
    Blueprint,
    flash,
    g,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

import backend.db as db
import os
resource_bp = Blueprint("resource", __name__, url_prefix="/resource")

import backend.controllers.resource as rc
import backend.models.resource as rm
from werkzeug.utils import secure_filename

from backend.config import config
@resource_bp.route("/", methods=("GET", "POST"))
def resource():
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
        return jsonify([db.get_data(i) for i in rc.list_all()])


@resource_bp.route("/<resource_id>")
def get_resource(resource_id):
    return {"this is": resource_id, "headers": str(request.headers)}
