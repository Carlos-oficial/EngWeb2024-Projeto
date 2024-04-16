from flask import (
    Blueprint,
    flash,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
import requests
import json
from db.db import get_db
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "static/fits"
ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def init_routes(app):
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    @app.route('/', methods=('GET', 'POST'))
    def index():
        db = get_db()
        todos = db.todos
        if request.method=='POST':
            content = request.form['content']
            degree = request.form['degree']
            todos.insert_one({'content': content, 'degree': degree})
            return redirect(url_for('index'))

        all_todos = todos.find()
        return render_template('index.html', todos=all_todos)
    