from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps
router = APIRouter()

@router.get("/{problem_id}", response_model=schemas.ProblemResponse)
async def get_problem_by_id_endpoint(
    problem_id: int,
    db: Session = Depends(deps.get_db)
) -> schemas.ProblemResponse:

    problem = crud.get_problem_by_id(db, problem_id)
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem
