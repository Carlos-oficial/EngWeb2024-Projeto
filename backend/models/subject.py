import pydantic
from pydantic import TypeAdapter, ValidationError
from typing import List
from typing_extensions import TypedDict

class Subject(TypedDict):
    name:str

def validate(subject):
    SubjectValidator = TypeAdapter(Subject)
    try:
        SubjectValidator.validate_python(subject)
    except ValidationError:
        return False
    else: 
        return True


if __name__ == "__main__":
    pass