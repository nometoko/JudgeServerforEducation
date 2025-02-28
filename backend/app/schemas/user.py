from datetime import datetime
from typing import Optional
from pydantic import BaseModel

# ユーザー作成時のスキーマ
class UserCreate(BaseModel):
    user_name: str
    password: str
    joined_date: datetime

# ユーザー読み取り時のスキーマ
class UserResponse(BaseModel):
    user_name: str
    joined_date: str

    class Config:
        from_attributes = True
