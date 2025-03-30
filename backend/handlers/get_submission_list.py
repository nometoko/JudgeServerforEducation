from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app import schemas, crud
from app.api import deps
import auth
import utils

router = APIRouter()

@router.get("/", response_model=List[schemas.SubmissionResponse])
async def get_all_submissions(
    user: auth.TokenData = Depends(auth.get_current_user),
    db: Session = Depends(deps.get_db)
) -> List[schemas.SubmissionResponse]:

    if utils.check_b3(user):
        submission_list = crud.get_submissions_by_user_name(db, user.authUserName)
    else:
        submission_list = crud.get_all_submissions(db)

    return submission_list
