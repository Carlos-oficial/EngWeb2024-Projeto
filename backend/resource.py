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

from backend.db import *

resource_bp = Blueprint("resource", __name__, url_prefix="/resource")

from backend.controllers.resource import *
from backend.models.resource import *

@resource_bp.route("/",methods=("GET", "POST"))
def reource():
    if request.method == "POST":
        pass
    elif resource_bp.method == "GET":
        return list_all()

@resource_bp.route("/<resource_id>")
def get_resource(resource_id):
    return {"this is": resource_id, "headers": str(request.headers)}
