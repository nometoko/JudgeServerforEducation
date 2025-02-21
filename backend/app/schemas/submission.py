from datetime import datetime
from pydantic import BaseModel

# 作成時のスキーマ
class SubmissionCreate(BaseModel):
    user_name: str
    problem_id: int
    submitted_date: str = datetime.now().astimezone().isoformat(timespec='milliseconds') # typeScriptに合わせている
    status: str = "WJ"

class SubmissionResponse(BaseModel):
    submission_id: str
    user_name: str
    problem_id: int
    submitted_date: str
    status: str

    class Config:
        from_attributes = True
