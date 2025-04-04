import os
from fastapi import HTTPException, status, Depends, Request
from jose import JWTError, jwt
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta

# JWTトークンの署名に使用するアルゴリズム
SIG_ALGORITHM = "HS256"
# トークンの有効期限
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # min
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login") # ドキュメントに記載されるエンドポイント

class Settings(BaseModel):
    SECRET_KEY: str = os.getenv("SECRET_KEY") # 運用時には再作成する: % openssl rand -base64 32
    PEPPER: str = os.getenv("PEPPER")

class TokenData(BaseModel):
    authUserName: str | None = None
    authJoinedDate: str | None = None
    authUserExp: str | None = None

# リクエストから JWT トークンを検証し、現在のユーザ情報を取得する依存関数
async def get_current_user(request: Request):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証情報が無効です",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # print("get_current_user...")
    try:
        token = request.cookies.get("token")
        # print("token: ", token)
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[SIG_ALGORITHM])
        username: str = payload.get("user")
        # print("username: ", username)
        # print("joined_date: ", payload.get("joined_date"))
        # print("authUserExp: ", payload.get("authUserExp"))
        if username is None:
            raise credentials_exception
        token_data = TokenData(authUserName=username, authJoinedDate=payload.get("joined_date"), authUserExp=payload.get("authUserExp"))
    except JWTError: # トークンの期限切れ等のエラー
        raise credentials_exception
    return token_data
