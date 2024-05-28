import click
import controllers
import controllers.user


def init_cli(app):

    @app.cli.command("register-user")
    @click.argument("name")
    @click.argument("password")
    @click.option("--prod/--no-prod", default=False)
    def register_user(name, password, prod):
        try:
            controllers.user.create(name, password, producer=prod != False)
        except Exception as e:
            print("Exception:", e)
