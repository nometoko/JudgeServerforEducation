from typing import List
from sqlalchemy.orm import Session
from app import schemas, models

def create_submission(db: Session, submission: schemas.SubmissionCreate) -> models.Submission:
    db_submission = models.Submission(**submission.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_submission_by_user_name(db: Session, user_name: str) -> List[models.Submission]:
    return db.query(models.Submission).filter(models.Submission.user_name == user_name).all()

def get_submission_by_submission_id(db: Session, submission_id: str) -> models.Submission:
    return db.query(models.Submission).filter(models.Submission.submission_id == submission_id).first()

def delete_submission(db: Session, submission_id: str) -> None:
    db.query(models.Submission).filter(models.Submission.submission_id == submission_id).delete()
    db.commit()
    return None

def get_all_submissions(db: Session) -> List[models.Submission]:
    print(type(models.Submission))
    if db.query(models.Submission).all():
        return db.query(models.Submission).all()
    else:
        return None

def delete_all_submissions(db: Session) -> None:
    db.query(models.Submission).delete()
    db.commit()
    return None
