from sqlalchemy.orm import Session

from app import models, schemas

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user

def delete_all_users(db: Session) -> None:
    db.query(models.User).delete()
    db.commit()
    return None
