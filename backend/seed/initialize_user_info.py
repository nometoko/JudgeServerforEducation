import json
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.api import deps

def read_json(json_file_path: str) -> List[schemas.UserCreate]:
    with open(json_file_path, "r") as f:
        users = json.load(f)

    users_info = []
    for user in users:
        users_info.append(schemas.UserCreate(**user))
    return users_info    

def initialize_user_info(json_file_path: str) -> None:
    db:Session = next(deps.get_db())
    print(type(db))
    crud.delete_all_users(db)

    users_info = read_json(json_file_path)
    for user_info in users_info:
        created_user = crud.create_user(db, user_info)
        if not created_user:
            raise Exception("User creation failed")
    return None
