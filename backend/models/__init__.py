import pydantic
from pydantic import TypeAdapter, ValidationError

def validate(subject):
    SubjectValidator = TypeAdapter(type(subject))
    try:
        SubjectValidator.validate_python(subject)
    except ValidationError:
        return False
    else:
        return True