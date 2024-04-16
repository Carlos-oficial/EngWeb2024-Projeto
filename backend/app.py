import os

from flask import Flask, render_template, session
from flask_cors import CORS

from session import SessionSingleton
def create_app(test_config=None):
    # create and configure the app
    app = Flask(
        __name__,
        instance_relative_config=True,
    )
    CORS(app, supports_credentials=True)  # Enable CORS with credentials support

    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "APP.sqlite"),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello

    import db.db as db

    with app.app_context():
        db.init_db()
    db.init_app(app)

    import auth

    app.register_blueprint(auth.auth)

    import api

    app.register_blueprint(api.api)

    import routes

    with app.app_context():
        routes.init_routes(app)

    @app.route("/routes")
    def routes():
        return [str(p) for p in app.url_map.iter_rules()]

    @app.route("/session")
    def session_data():
        session = SessionSingleton.get_session()
        return {str(p): session[p] for p in session}

    return app



if __name__ == "__main__":
    create_app().run(debug=True)
