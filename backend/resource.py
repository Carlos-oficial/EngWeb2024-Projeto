import os

from flask import Blueprint, g, jsonify, request, send_file, session as FSession
from werkzeug.utils import secure_filename
from backend import auth 
import backend.controllers.resource as ResourceController
import backend.controllers.user as UserController
from backend import db
from backend.config import config

# import backend.auth as auth
resource_bp = Blueprint("resource", __name__, url_prefix="/resource")


@resource_bp.route("", methods=("GET", "POST"))
@resource_bp.route("/", methods=("GET", "POST"))
def resource():
    try:
        print("file: ",request["file"]) 
    except : pass
    try:
        print("files: ",request.files.__dict__) 
        print("files: ",dict(**request.files)) 

    except : pass
    return "_"
    if request.method == "POST":
        ResourceController.add({"file": request.files["file"].filename, **request.form})
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if file:  #  and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            path = os.path.join(config["UPLOAD_FOLDER"], filename)
            file.save(path)
            return jsonify({"success": "Resource added successfully"}), 201

        return jsonify({"error": "something went wrong"}), 400
    if request.method == "GET":
        return jsonify(
            []
            #[db.get_data(i) for i in ResourceController.list_all(**request.args)]
        )
    return None


@resource_bp.route("/<resource_id>/file")
def get_resource_file(resource_id):
    res = ResourceController.get(resource_id)
    print(res)
    if res:
        file_path = os.path.join(config["UPLOAD_FOLDER"], res["file"])
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        return jsonify({"error": "File not found"}), 404
    return jsonify({"error": "Resource not found"}), 404


@resource_bp.route("/favorites", methods=("GET", "POST"))
@auth.login_required
def favorites():  # TODO: usar sessões
    print(dict(FSession))
    print(FSession.sid)
    if request.method == "GET":
        if "user" not in FSession:
            return {}
        print(g.user)
        user_data = UserController.get(FSession["user"])
        favs = user_data.get("favorites")
        if favs is None:
            favs = []
        resources = [db.get_data(ResourceController.get(favorite)) for favorite in favs]
        print(resources)
        return resources
    if request.method == "POST":
        if ResourceController.get(request.json["resource_id"]):
            UserController.add_favorite(
                request.json["user"], request.json["resource_id"]
            )
            return jsonify({"success": "Resource added to favorites"}), 201
        return jsonify({"error": "Resource not found"}), 404
    return jsonify({"error": "Method not allowed"}), 405
