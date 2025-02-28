import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import bcrypt
from fastapi import APIRouter
from .initial_auth import TokenData, oauth2_scheme, Settings, SIG_ALGORITHM, get_current_user

router = APIRouter()

def hash_password(password: str) -> str:
    """
    パスワードを bcrypt を用いてハッシュ化する。
    """
    PEPPER = Settings().PEPPER
	# パスワードにpepperを結合する
    password_with_pepper = password + os.getenv("PEPPER")
    # bcrypt.gensalt(rounds=8) により、8ラウンド (256回)の反復処理を使ってランダムなソルトを生成する = ストレッチング
    salt = bcrypt.gensalt(rounds=8)
    # 入力されたパスワード（文字列）を UTF-8 エンコードしてバイト列に変換し、hashpw() に渡す
    hashed = bcrypt.hashpw(password_with_pepper.encode('utf-8'), salt)
    # 生成されたハッシュはバイト列なので、decode() を用いて文字列に変換して返す
    return hashed.decode('utf-8')

def check_password_hash(password: str, hashed: str) -> bool:
    """
    平文のパスワードとハッシュ値を比較し、一致すれば True を返す。
    hashed : DBに保存されているハッシュ値を想定。
    """
    PEPPER = Settings(PEPPER=os.getenv("PEPPER")).PEPPER
    password_with_pepper = password + PEPPER
    # 入力されたパスワードと保存されたハッシュ文字列を、それぞれエンコードして checkpw() で比較する
    # print("password_with_pepper: ", password_with_pepper.encode('utf-8'))
    # print("hashed: ", hashed.encode('utf-8'))
    return bcrypt.checkpw(password_with_pepper.encode('utf-8'), hashed.encode('utf-8')) # この関数では、保存されているハッシュ値を引数に取り、それを元にハッシュ化して比較する
# エンコードは、バイト列に変換するため
# ソルトは毎回異なるため、同じパスワードでも異なるハッシュ値が生成される = debugしても意味がない
