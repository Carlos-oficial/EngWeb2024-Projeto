from typing import List

import pydantic
from pydantic import TypeAdapter, ValidationError
from typing_extensions import TypedDict


class Subject(TypedDict):
    id: int
    name: str

if __name__ == "__main__":
    pass
