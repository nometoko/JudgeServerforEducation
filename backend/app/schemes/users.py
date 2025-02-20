from typing import Optional

from pydantic import BaseModel


# ユーザー作成時のスキーマ
class UserCreate(BaseModel):
    name: Optional[str] = "default_name"


# ユーザー読み取り時のスキーマ
class UserResponse(BaseModel):
    id: str
    name: str

    model_config = {"from_attributes": True}
