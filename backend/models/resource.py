"""
    # Resource
    ```
        type = {
        title:string,
        file:string,
        description:string,
        documentType:string,
        documentFormat:string,
        username:string,
        hashtags:[string],
        subject: string ~ Subject id,
        course: string ~ Course id,
        createdAt: date
    }
    ```
"""

from typing_extensions import TypedDict

from backend import models


class Resource(TypedDict):
    title: str
    file: str
    description: str
    documentType: str
    documentFormat: str
    username: str
    hashtags: list[str]
    subjectId: str
    courseId: str

if __name__ == "__main__":
    obj = Resource({"title": "titulo", "file": "ficheiro.pdf", "tags": []})
    print(models.validate(obj))
