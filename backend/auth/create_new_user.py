import os
from fastapi import FastAPI, HTTPException
from fastapi import APIRouter
#from fastapi_jwt_auth import AuthJWT
#from fastapi_jwt_auth.exceptions import AuthJWTException
from jose import JWTError, jwt
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from fastapi import Depends, status
from .initial_auth import TokenData, oauth2_scheme, Settings, SIG_ALGORITHM, get_current_user
from .hash import hash_password, check_password_hash
from .login import UserLogin
#from config import SECRET_KEY

router = APIRouter()

@router.post("/new")
async def create_new_user(form_data: UserLogin):
	"""
	新規ユーザーを作成する。
	パスワードはハッシュ化して保存する。
	"""
	print("新規ユーザーを作成します...")
	print("form_data: ", form_data)
	hashed_password = hash_password(form_data.password)
	# ユーザー名とハッシュ化されたパスワードを保存する
	# DBに保存する場合は、hashed_passwordを保存する
	user = {"username": form_data.username, "password": hashed_password}
	print(f"新規ユーザーを作成しました: {user}")
	return user # DBに保存するだけで、返す必要はないと思う