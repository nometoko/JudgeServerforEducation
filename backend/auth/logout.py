import os
from fastapi import FastAPI, HTTPException, Response
from fastapi import APIRouter
#from fastapi_jwt_auth import AuthJWT
#from fastapi_jwt_auth.exceptions import AuthJWTException
from jose import JWTError, jwt
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from fastapi import Depends, status, Request
from .initial_auth import TokenData, oauth2_scheme, Settings, SIG_ALGORITHM, get_current_user
from .hash import hash_password, check_password_hash
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps
from app.crud.user import  get_password_by_username, get_joined_date_by_username
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
#from config import SECRET_KEY

router = APIRouter()

@router.post("/logout")
def logout(response: Response):
    # Cookie名とオプション（path, domain, secure, httponlyなど）を指定して削除
    response.delete_cookie(key="token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "ログアウトしました"}