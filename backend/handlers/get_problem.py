import os
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter()

class ProblemResponseForHandler(BaseModel):
    problem: schemas.ProblemResponse
    status: bool

@router.get("/{user_name}")
async def get_problem_handler(user_name: str, db: Session = Depends(deps.get_db)) -> List[ProblemResponseForHandler]:
    problems = crud.get_all_problems(db)
    print("getProblemList called for user:", user_name)
    return [ProblemResponseForHandler(problem=schemas.ProblemResponse(**problem.__dict__), status=problem.is_petit_coder) for problem in problems]

async def get_all_problems_handler(db: Session = Depends(deps.get_db)) -> List[schemas.ProblemResponse]:
    print("getAllProblems called")
    problems = crud.get_all_problems(db)
    return problems
