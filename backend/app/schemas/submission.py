from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

# 作成時のスキーマ
class SubmissionCreate(BaseModel):
    user_name: str
    problem_id: int
    submitted_date: str = Field(default_factory=lambda: datetime.now().astimezone().isoformat(timespec='milliseconds'))
    status: str = "WJ"

class SubmissionResponse(BaseModel):
    submission_id: str
    user_name: str
    problem_id: int
    submitted_date: str
    status: str
    compile_error: Optional[str]

    class Config:
        from_attributes = True

class SubmissionUpdate(BaseModel):
    status: str
    compile_error: Optional[str]
