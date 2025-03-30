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
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps
from app.crud.user import  get_password_by_username, get_joined_date_by_username, change_password_db
#from config import SECRET_KEY
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/change")
async def change_password(form_data: UserLogin,  db: Session = Depends(deps.get_db)):
	"""
	新規ユーザーを作成する。
	パスワードはハッシュ化して保存する。
	"""
	print("パスワードを変更します...")
	print("form_data: ", form_data)
	hashed_password = hash_password(form_data.password)
	if (change_password_db(db, form_data.username, hashed_password)):
		print("パスワードを変更しました。")
	else:
		print("パスワードの変更に失敗しました。")
		return JSONResponse(content={"success": False, "message": "Failed to change password"})
	return JSONResponse(content={"success": True, "message": "Account information updated successfully"})