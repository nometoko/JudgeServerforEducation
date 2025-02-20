import datetime
from pydantic import BaseModel

# 作成時のスキーマ
class SubmissionCreate(BaseModel):
    user_name: str
    problem_id: int
    submitted_date: datetime.datetime = datetime.datetime.now()
    status: str = "WJ"

class SubmissionResponse(BaseModel):
    submission_id: str
    user_name: str
    problem_id: int
    submitted_date: datetime.datetime
    status: str

    class Config:
        orm_mode = True
