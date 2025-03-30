from typing import List
from fastapi import HTTPException, Depends, APIRouter

from app import schemas, crud
from app.api import deps

router = APIRouter()

@router.get("/{problem_id}", response_model=List[schemas.TestcaseWithPathResponse])
def get_testcase_with_path_by_problem_id_endpoint(
    problem_id: int,
    db = Depends(deps.get_db)
) -> List[schemas.TestcaseWithPathResponse]:
    testcase_with_path = crud.get_testcases_with_path_by_problem_id(db, problem_id)
    if testcase_with_path is None:
        raise HTTPException(status_code=404, detail="Testcases not found")
    return testcase_with_path
