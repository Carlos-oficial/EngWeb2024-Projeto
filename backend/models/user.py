import pydantic
from pydantic import TypeAdapter, ValidationError


from typing import List
from typing_extensions import TypedDict

class User(TypedDict):    
    username:str
    pass_hash:str

def validate(user):
    UserValidator = TypeAdapter(User)
    try:
        UserValidator.validate_python(user)
    except ValidationError:
        return False
    else: 
        return True
