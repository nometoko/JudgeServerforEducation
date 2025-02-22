from typing import List
from sqlalchemy.orm import Session
from app import schemas, models

def create_submission_result(db: Session, submission_result: schemas.SubmissionResultCreate) -> models.SubmissionResult:
    db_submission = models.SubmissionResult(**submission_result.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def delete_all_submission_results(db: Session) -> None:
    db.query(models.SubmissionResult).delete()
    db.commit()
    return None

def get_submission_result_by_submission_id(db: Session, submission_id: str) -> List[models.SubmissionResult]:
    return db.query(models.SubmissionResult).filter(models.SubmissionResult.submission_id == submission_id).all()
