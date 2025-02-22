from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter()

class TestcaseResultResponse(BaseModel):
    testcase: schemas.TestcaseResponse
    user_result: schemas.SubmissionResultResponse

@router.get("/{submission_id}", response_model=List[TestcaseResultResponse])
async def get_testcase_result_list(
    submission_id: str,
    db: Session = Depends(deps.get_db)
) -> List[TestcaseResultResponse]:

    submission = crud.get_submission_by_submission_id(db, submission_id)
    submission_result = crud.get_submission_result_by_submission_id(db, submission_id)
    print(submission_result)
    if not submission_result:
        raise HTTPException(status_code=404, detail="Testcases not found")

    testcase_result_list = []
    for result in submission_result:
        testcase = crud.get_testcase_by_id(db, submission.problem_id, result.testcase_number)
        print(result.__dict__)
        testcase_result_list.append(TestcaseResultResponse(testcase=testcase.__dict__, user_result=result.__dict__))
    return testcase_result_list
