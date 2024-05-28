import click
import controllers.user
import controllers.resource


def init_cli(app):

    @app.cli.command("register-user")
    @click.argument("name")
    @click.argument("password")
    def register_user(name, password):
        try:
            controllers.user.create(name, password)
        except Exception as e:
            print("Exception:", e)

    @app.cli.command("dump")
    @click.argument("filepath")
    @click.option("--type", default="json")
    def dump_app_state(filepath, type):
        pass

    @app.cli.command("list")
    @click.argument("collection")
    def list(collection):
        from db import get_db
        import json
        db = get_db()
        
        cursor = db.get_collection(collection).find()
        for document in cursor:
            print((document))