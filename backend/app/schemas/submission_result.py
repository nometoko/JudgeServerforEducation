from pydantic import BaseModel

class SubmissionResultCreate(BaseModel):
    submission_id: str
    testcase_number: int
    output_content: str
    status: str

class SubmissionResultResponse(BaseModel):
    submission_id: str
    testcase_number: int
    output_content: str
    status: str

    class Config:
        from_attributes = True
