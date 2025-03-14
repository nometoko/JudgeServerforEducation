from typing import List
from sqlalchemy.orm import Session
from app import schemas, models


def create_image_path(
    db: Session, image_path: schemas.ImagePathCreate
) -> models.ImagePath:
    db_image_path = models.ImagePath(**image_path.model_dump())
    db.add(db_image_path)
    db.commit()
    db.refresh(db_image_path)
    return db_image_path

def get_image_path_by_path(db: Session, image_path: str) -> models.ImagePath | None:
    return (
        db.query(models.ImagePath)
        .filter(models.ImagePath.image_path == image_path)
        .first()
    )


def delete_all_image_paths(db: Session) -> None:
    db.query(models.ImagePath).delete()
    db.commit()
    return
