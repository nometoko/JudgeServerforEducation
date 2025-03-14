import json
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.api import deps
from utils import calc_grade_of_students


def insert_user_info(json_file_path: str) -> None:
    db: Session = next(deps.get_db())

    with open(json_file_path, "r") as f:
        users = json.load(f)

    for user in users:
        image_paths = user.pop("image_path")
        role = user.pop("role")
        if role == 'student':
            grade = calc_grade_of_students(user["joined_date"])
        else:
            grade = 'teacher'

        if crud.get_user_by_user_name(db, user_name=user["user_name"]) is not None:
            continue
        created_user = crud.create_user(
            db, schemas.UserCreate(**user, user_grade=grade)
        )

        for image_path in image_paths:
            if (
                crud.get_image_path_by_path(db, image_path=image_path)
                is not None
            ):
                continue
            create_image_path = schemas.ImagePathCreate(
                image_path=image_path,
                user_fullname=user["user_fullname"],
                user_name=user["user_name"],
                user_grade=grade,
            )
            created_image_path = crud.create_image_path(db, create_image_path)
