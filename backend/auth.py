import functools

from flask import (
    Blueprint,
    g,
    jsonify,
    request,
)
from werkzeug.security import check_password_hash, generate_password_hash
from backend.session import SessionSingleton
import backend.controllers as controllers

auth = Blueprint("auth", __name__, url_prefix="/auth")


@auth.route("/register", methods=("GET", "POST"))
def register():
    if request.method == "POST":
        try:
            username = request.json["username"]
            password = request.json["password"]
            error = None
            if not username:
                error = "Username is required."
            elif not password:
                error = "Password is required."

            if error is not None:
                return jsonify({"error": "Signup failed"}), 400
            else:
                controllers.user.create(username, password)
        except Exception as e:
            return jsonify({"error": "Signup failed " + e}), 400
        finally:
            return jsonify({"result": "Signup sucessful"}), 200


@auth.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        username = request.json["username"]
        password = request.json["password"]
        error = None
        user = controllers.user.get(username)

        if user is None:
            error = "Incorrect username."
        elif not check_password_hash(user["pass_hash"], password):
            error = "Incorrect password."

        if error is None:
            session = SessionSingleton.get_session()
            session["user"] = username
            print(session)
            return jsonify(session), 200
        else:
            return jsonify({"error": error}), 401


@auth.before_app_request
def load_logged_in_user():
    session = SessionSingleton.get_session()
    user = session.get("user")

    if user is None:
        g.user = None
    else:
        g.user = user


@auth.route("/logout")
def logout():
    session = SessionSingleton.get_session()
    session.pop("user")
    return jsonify({"result": "Logout successful"}), 200


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify({"error": "Login required"}), 401

        return view(**kwargs)

    return wrapped_view
