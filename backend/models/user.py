from typing_extensions import TypedDict


class User(TypedDict):
    username: str
    pass_hash: str
