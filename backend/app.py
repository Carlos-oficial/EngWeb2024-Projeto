import os

import click
from flask import Flask, render_template, session
from flask_cors import CORS

from backend.session import SessionSingleton


def create_app(test_config=None):
    # create and configure the app
    app = Flask(
        __name__,
        instance_relative_config=True,
    )
    CORS(app, supports_credentials=True)  # Enable CORS with credentials support

    app.config.from_mapping(
        SECRET_KEY="dev",
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    # try:
    #     os.makedirs(app.instance_path)
    # except OSError:
    #     pass

    # a simple page that says hello

    import backend.db as db

    with app.app_context():
        db.init_db()
    db.init_app(app)

    from backend.auth import auth

    app.register_blueprint(auth)

    from backend.resource import resource_bp

    app.register_blueprint(resource_bp)

    from backend.routes import init_routes

    with app.app_context():
        init_routes(app)

    @app.route("/routes")
    def routes():
        return [str(p) for p in app.url_map.iter_rules()]

    @app.route("/session")
    def session_data():
        session = SessionSingleton.get_session()
        return {str(p): session[p] for p in session}

    from backend.cli import init_cli

    with app.app_context():
        init_cli(app)

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
