import functools

import flask
from flask import Blueprint, g, jsonify, request,session
from werkzeug.security import check_password_hash

import backend.controllers.user as UserController

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
            UserController.create(username, password)
        except Exception as e:
            return jsonify({"error": "Signup failed " + e}), 400
        return jsonify({"result": "Signup sucessful"}), 200
    return jsonify({"error": "Method not allowed"}), 405


@auth.route("/login", methods=("POST",))
def login():
    if request.method == "POST":
        username = request.json["username"]
        password = request.json["password"]
        error = None
        user = UserController.get(username)
        if user is None:
            error = "Incorrect username."
        elif not check_password_hash(user["pass_hash"], password):
            error = "Incorrect password."
        if error is None:
            flask.session["user"] = username
            print(dict(flask.session))
            print(flask.session.__dict__)
            ret = {}
            try:
                ret = jsonify(**flask.session)
            except Exception as e:
                pass
            return ret, 200
        return jsonify({"error": error}), 401
    return jsonify({"error": "Method not allowed"}), 405


@auth.before_app_request
def load_logged_in_user():
    user = flask.session.get("user")

    if user is None:
        g.user = None
    else:
        g.user = user


@auth.route("/logout")
def logout():
    flask.session.pop("user")
    return jsonify({"result": "Logout successful"}), 200


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None and session["user"] is None:
            return jsonify({"error": "Login required"}), 401

        return view(**kwargs)

    return wrapped_view
