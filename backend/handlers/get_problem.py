import os
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps
import auth

router = APIRouter()

class ProblemResponseForDashboard(BaseModel):
    problem: schemas.ProblemResponse
    status: bool

@router.get("/")
async def get_all_problem_with_status_handler(
    user: auth.TokenData = Depends(auth.get_current_user),
    db: Session = Depends(deps.get_db)
) -> List[ProblemResponseForDashboard]:

    problems = crud.get_all_problems(db)
    problem_with_status_responses = [ProblemResponseForDashboard(problem=schemas.ProblemResponse(**problem.__dict__), status=False) for problem in problems]
    for response in problem_with_status_responses:
        problem_id = response.problem.problem_id
        submissions = crud.get_submissions_by_user_name_and_problem_id(db, user.authUserName, problem_id)
        if submissions:
            for submission in submissions:
                if submission.status == "AC":
                    response.status = True
                    break
    return problem_with_status_responses
