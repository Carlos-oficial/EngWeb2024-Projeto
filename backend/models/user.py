from enum import Enum


class User:
    class Role(Enum):
        PRODUCER = "PRODUCER"
        CONSUMER = "CONSUMER"

    def __init__(self, username: str, pass_hash: str,producer=False):
        self.username = username
        self.pass_hash = pass_hash
        self.role = User.Role.PRODUCER if producer else User.Role.CONSUMER

    def dict(self):
        return {
            "username": self.username,
            "pass_hash": self.pass_hash,
            "role": self.role._value_,
        }


