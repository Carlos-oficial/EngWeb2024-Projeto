import click
from flask import current_app, g
from pymongo import MongoClient


def get_instance():
    return MongoClient("localhost", 27017)


def get_db():
    if "db" not in g:
        client = MongoClient("localhost", 27017)
        db = client.flask_db
        return db
    else:
        return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    g.db = get_db()


def init_app(app, teardown=False):
    if teardown:
        app.teardown_appcontext(close_db)


def get_data(data):
    if data.get("_id"):
        data["_id"] = str(data["_id"])
    return data
