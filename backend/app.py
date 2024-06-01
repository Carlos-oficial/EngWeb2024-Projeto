import flask
from flask_cors import CORS
from flask_session import Session

from backend import db
from backend.views.auth import auth
from backend.cli import init_cli
from backend.views.resource import resource_bp
from backend.views.subject import subject_bp

def create_app(test_config=None):
    # create and configure the app
    app = flask.Flask(
        __name__,
        instance_relative_config=True,
    )
    # Enable CORS with credentials support
    CORS(app, supports_credentials=True)

    with app.app_context():
        db.init_db()
    db.init_app(app)

    app.config.from_mapping(
        SECRET_KEY="dev",
        SESSION_TYPE="mongodb",
        SESSION_MONGODB=db.get_instance(),
        SESSION_MONGODB_DB="flask_db",
    )
    Session(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    app.register_blueprint(auth)
    app.register_blueprint(resource_bp)
    app.register_blueprint(subject_bp)

    @app.route("/routes")
    def routes():
        return [str(p) for p in app.url_map.iter_rules()]

    @app.route("/session")
    def session_data():
        return {str(p): flask.session[p] for p in flask.session}

    with app.app_context():
        init_cli(app)

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
