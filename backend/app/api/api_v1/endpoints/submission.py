from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps
router = APIRouter()

@router.post("/", response_model=schemas.SubmissionResponse, status_code=201)
async def create_submission_endpoint(
    submission: schemas.SubmissionCreate,
    db: Session = Depends(deps.get_db)
) -> schemas.SubmissionResponse:

    db_submission = models.Submission(**submission.model_dump())
    db.add(db_submission)

    created_submission = await crud.create_submission(db, submission)
    if created_submission:
        return created_submission
    else:
        raise HTTPException(status_code=400, detail="Submission failed")

@router.get("/", response_model=List[schemas.SubmissionResponse])
async def get_all_submissions_endpoint(
    db: Session = Depends(deps.get_db)
) -> List[schemas.SubmissionResponse]:

    submission = await crud.get_all_submissions(db)
    if submission:
        return submission
    else:
        raise HTTPException(status_code=404, detail="Submission not found")

@router.get("/{user_name}", response_model=List[schemas.SubmissionResponse])
async def get_submission_by_user_name_endpoint(
    user_name: str,
    db: Session = Depends(deps.get_db)
) -> List[schemas.SubmissionResponse]:

    submission = await crud.get_submission_by_user_name(db, user_name)
    if submission:
        return submission
    else:
        raise HTTPException(status_code=404, detail="Submission not found")

@router.delete("/", status_code=204)
async def delete_all_submission_endpoint(
    db: Session = Depends(deps.get_db)
) -> None:

    await crud.delete_all_submissions(db)
    return None
