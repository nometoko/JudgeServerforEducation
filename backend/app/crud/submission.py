from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemes, models

async def create_submission(db: Session, submission: schemes.SubmissionCreate) -> models.Submission:
    db_submission = models.Submission(**submission.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission
