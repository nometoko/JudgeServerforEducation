from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ImagePathCreate(BaseModel):
    image_path: str
    user_name: str
    user_fullname: str
    user_grade: str

class PhotoPathResponse(BaseModel):
    image_path_id: str
    image_path: str
    user_fullname: str
    user_grade: str
