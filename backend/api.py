import json
import random

import requests
from flask import (Blueprint, flash, g, jsonify, redirect, render_template,
                   request, session, url_for)

api = Blueprint("api", __name__, url_prefix="/api")

@api.route("/")
def index():
    return {"this is":"an example"}