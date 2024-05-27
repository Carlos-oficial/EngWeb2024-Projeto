import json
import random

import requests
from flask import (Blueprint, flash, g, jsonify, redirect, render_template,
                   request, session, url_for)

from db import *


api = Blueprint("api", __name__, url_prefix="/api")

@api.route("/")
def index():
    return {"this is":"an example"}



resource = Blueprint("resource", __name__, url_prefix="/resource")
api.register_blueprint(resource)


@resource.route("/<resource_id>")
def resource(resource_id):
    return {"this is":resource_id,"headers":str(request.headers)}