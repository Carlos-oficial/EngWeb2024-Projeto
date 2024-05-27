import click

def init_cli(app):
    @app.cli.command("test-command")
    @click.argument("name")
    def test_command(name):
        print(""" comando v2
    """)