from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemes, models
from app.api import deps
router = APIRouter()

@router.post("/", response_model=schemes.SubmissionResponse, status_code=201)
async def create_submission_endpoint(submission: schemes.SubmissionCreate, db: Session = Depends(deps.get_db)) -> schemes.SubmissionResponse:
    db_submission = models.Submission(**submission.model_dump())
    db.add(db_submission)

    created_submission = await crud.create_submission(db, submission)
    if created_submission:
        return created_submission
    else:
        raise HTTPException(status_code=400, detail="Submission failed")
