"""
    # Post
    ```
        type = {
        text:string,
        resource:string ~ Course id,
    }
    ```
"""

from typing_extensions import TypedDict

from backend import models


class Post(TypedDict):
    text: str
    resource: str # Resource id
    user: str # username