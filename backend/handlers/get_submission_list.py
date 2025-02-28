from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app import schemas, crud
from app.api import deps

router = APIRouter()

@router.get("/{user_name}", response_model=List[schemas.SubmissionResponse])
async def get_submission_list(user_name: str, db: Session = Depends(deps.get_db)) -> List[schemas.SubmissionResponse]:
    print(user_name)
    submission_list = crud.get_submissions_by_user_name(db, user_name)
    return submission_list

@router.get("/", response_model=List[schemas.SubmissionResponse])
async def get_all_submissions(db: Session = Depends(deps.get_db)) -> List[schemas.SubmissionResponse]:
    submission_list = crud.get_all_submissions(db)
    return submission_list
