import os

from flask import Blueprint, g, jsonify, request, send_file, session
from werkzeug.utils import secure_filename
from backend.views import auth 
import backend.controllers.resource as ResourceController
import backend.controllers.user as UserController
from backend import db, models
from backend.config import config

# import backend.auth as auth
resource_bp = Blueprint("resource", __name__, url_prefix="/resource")


@resource_bp.route("", methods=["POST"])
@resource_bp.route("/", methods=["POST"])
@auth.login_required
def post_resource():
    data = request.form
    print(models.validate(data))
    
    ResourceController.add({"file": request.files["file"].filename,"username":session["user"], **data})
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:  #  and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        path = os.path.join(config["UPLOAD_FOLDER"], filename)
        file.save(path)
        return jsonify({"success": "Resource added successfully"}), 201

    return jsonify({"error": "something went wrong"}), 400


@resource_bp.route("", methods=["GET"])
@resource_bp.route("/", methods=["GET"])
def get_resources():
    return jsonify([db.get_data(ResourceController.unfold(i)) for i in ResourceController.list_all(**request.args)])

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


@resource_bp.route("/favorites", methods=["GET", "POST"])
@auth.login_required
def favorites():  # TODO: usar sessões
    print(dict(session))
    print(session.sid)
    if request.method == "GET":
        if "user" not in session:
            return {}
        print(g.user)
        user_data = UserController.get(session["user"])
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
