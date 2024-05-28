from db import get_db
from werkzeug.security import check_password_hash, generate_password_hash
from flask import (
    Blueprint,
    g,
    jsonify,
    request,
)

def list_all():
    db = get_db()
    return list(db.resources.find())
