import pydantic
from pydantic import TypeAdapter, ValidationError


from typing import List
from typing_extensions import TypedDict

class Resource(TypedDict):
    title:str
    file:str
    tags:List[str] # | None

def validate(resource):
    ResourceValidator = TypeAdapter(Resource)
    try:
        ResourceValidator.validate_python(resource)
    except ValidationError:
        return False
    else: 
        return True


if __name__ == "__main__":
    obj = Resource({'title': "titulo",'file':"ficheiro.pdf","tags":[]})   
    print(validate(obj))
    