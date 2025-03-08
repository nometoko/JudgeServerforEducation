from typing import List
from sqlalchemy.orm import Session
from app import schemas, models

# post
def create_submission_result(db: Session, submission_result: schemas.SubmissionResultCreate) -> models.SubmissionResult:
    db_submission = models.SubmissionResult(**submission_result.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

# get
def get_submission_results_by_submission_id(db: Session, submission_id: str) -> List[models.SubmissionResult]:
    return db.query(models.SubmissionResult).filter(models.SubmissionResult.submission_id == submission_id).all()

# patch
def update_submission_result(db: Session, submission_id: str, testcase_number: int, submission_result: schemas.SubmissionResultUpdate) -> models.SubmissionResult:
    db_submission = db.query(models.SubmissionResult).filter(models.SubmissionResult.submission_id == submission_id).filter(models.SubmissionResult.testcase_number == testcase_number).first()
    if db_submission:
        db_submission.status = submission_result.status
        db_submission.output_content = submission_result.output_content
        db.commit()
        db.refresh(db_submission)
    return db_submission

# delete
def delete_all_submission_results(db: Session) -> None:
    db.query(models.SubmissionResult).delete()
    db.commit()
    return None
