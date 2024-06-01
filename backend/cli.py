import click

from backend import controllers

import backend.controllers.course as courseController
import backend.controllers.subject as subjectController
from backend.db import get_db


def init_cli(app):

    @app.cli.command("add-user")
    @click.argument("name")
    @click.argument("password")
    def add_user(name, password):
        try:
            controllers.user.create(name, password)
        except Exception as e:
            print("Exception:", e)

    @app.cli.command("add-course")
    @click.argument("course")
    def add_course(course):
        try:
            print(courseController.add({"name":course}))
        except Exception as e:
            print("Exception:", e)


    @app.cli.command("add-subject")
    @click.argument("subject")
    @click.argument("course")
    def add_subject(subject, course):
        try:
            course = controllers.course.get_by_name(course)
            subjectController.add({"name":subject,"courseId": course})
        except Exception as e:
            print("Exception:", e)


    # @app.cli.command("dump")
    # @click.argument("filepath")
    # @click.option("--type", default="json")
    # def dump_app_state(filepath, type):
    #     pass

    @app.cli.command("list")
    @click.argument("collection")
    def list_(collection):

        db = get_db()

        cursor = db.get_collection(collection).find()
        for document in cursor:
            print((document))
