from pydantic import BaseModel
from typing import Optional

class SubmissionResultCreate(BaseModel):
    submission_id: str
    testcase_number: int
    output_content: str = ""
    status: str = "WJ"

class SubmissionResultUpdate(BaseModel):
    output_content: Optional[str]
    status: Optional[str]

class SubmissionResultResponse(BaseModel):
    submission_id: str
    testcase_number: int
    output_content: str
    status: str

    class Config:
        from_attributes = True
