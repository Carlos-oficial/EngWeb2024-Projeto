from typing import List

import pydantic
from pydantic import TypeAdapter, ValidationError
from typing_extensions import TypedDict


class User(TypedDict):
    username: str
    pass_hash: str
