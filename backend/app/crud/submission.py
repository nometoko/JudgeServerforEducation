from typing import List
from sqlalchemy.orm import Session
from app import schemas, models

# post
def create_submission(db: Session, submission: schemas.SubmissionCreate) -> models.Submission:
    db_submission = models.Submission(**submission.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

# get
def get_all_submissions(db: Session) -> List[models.Submission]:
    return db.query(models.Submission).all()

def get_submissions_by_user_name(db: Session, user_name: str) -> List[models.Submission]:
    return db.query(models.Submission).filter(models.Submission.user_name == user_name).all()

def get_submission_by_submission_id(db: Session, submission_id: str) -> models.Submission:
    return db.query(models.Submission).filter(models.Submission.submission_id == submission_id).first()

def get_submission_by_user_name_and_id(db: Session, user_name: str, submission_id: str) -> models.Submission:
    return db.query(models.Submission).filter(models.Submission.user_name == user_name, models.Submission.submission_id == submission_id).first()

def get_submissions_by_user_name_and_problem_id(db: Session, user_name: str, problem_id: int) -> List[models.Submission]:
    return db.query(models.Submission).filter(models.Submission.user_name == user_name, models.Submission.problem_id == problem_id).all()

# patch
def update_submission_status(db: Session, submission_id: str, submission: schemas.SubmissionUpdate) -> models.Submission:
    db_submission = db.query(models.Submission).filter(models.Submission.submission_id == submission_id).first()
    for key, value in submission.model_dump().items():
        setattr(db_submission, key, value)
    db.commit()
    db.refresh(db_submission)
    return db_submission

# delete
def delete_submission(db: Session, submission_id: str) -> None:
    db.query(models.Submission).filter(models.Submission.submission_id == submission_id).delete()
    db.commit()
    return None

def delete_all_submissions(db: Session) -> None:
    db.query(models.Submission).delete()
    db.commit()
    return None
