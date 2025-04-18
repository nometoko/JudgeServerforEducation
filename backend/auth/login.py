import os
from fastapi import FastAPI, HTTPException, Response
from fastapi import APIRouter
# from fastapi_jwt_auth import AuthJWT
# from fastapi_jwt_auth.exceptions import AuthJWTException
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
from app.crud.user import get_password_by_username, get_joined_date_by_username
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
# from config import SECRET_KEY

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # min
# リフレッシュトークンの有効期限（例：7日間）
REFRESH_TOKEN_EXPIRE_DAYS = 7
SIG_ALGORITHM = "HS256"

# PWはハッシュ化してDBに保存する

## JWTトークンの署名に使用するアルゴリズム
# SIG_ALGORITHM = "HS256"
## トークンの有効期限
# ACCESS_TOKEN_EXPIRE_MINUTES = 30 # min

# class Settings(BaseModel):
#    SECRET_KEY: str = os.getenv("SECRET_KEY")

# @AuthJWT.load_config
# def get_config():
#    return Settings()

# アクセストークンのみのレスポンス用モデル
class Token(BaseModel):
    access_token: str
    token_type: str

# ログイン時にアクセストークンとリフレッシュトークンを返すモデル
class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# class TokenData(BaseModel):
#    username: str | None = None

class User(BaseModel):
    username: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

## トークンに含まれるデータモデル
# class TokenData(BaseModel):
#   username: Union[str, None] = None

# ログイン時にユーザーから受け取るデータモデル
class UserLogin(BaseModel):
    username: str
    password: str

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login") # ドキュメントに記載されるエンドポイント

tmp = ["test", "$2b$08$GF7LS6nEsKamuDOrDyxlReTjgL1kaqtsP9yGS7Rg/AJ7KyadZXip2"]

def authenticate_user(username: str, password: str, db: Session = Depends(deps.get_db)):
    # if username == "test" and password == "test":
    #    return User(username=username)
    # hash_pw = test[]
    # print(password)
    # print(hash_password(password))
    print("password: ", password)
    print("get_password_by_username: ", get_password_by_username(username, db))
    if check_password_hash(password,  get_password_by_username(username, db)): # tmp[1]を、DBから取得したハッシュ値に置き換える
        return User(username=username)
    return None

# アクセストークンを生成する関数
# data: トークンに含めるデータ、任意に設定可能
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta: # 有効期限の設定、数値表現になる
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    # print("now", datetime.now())
    # print(expire)
    # to_encode.update({"exp": expire}) # 先ほど計算した expire の値を "exp" キーとして、to_encode 辞書に追加
    to_encode.update({"exp": int(expire.timestamp())})
    if "joined_date" in to_encode and isinstance(to_encode["joined_date"], datetime):
        to_encode["joined_date"] = to_encode["joined_date"].isoformat()
    settings = Settings()
    # print("SECRET_KEY", settings.SECRET_KEY)
    # print(to_encode)
    # encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=SIG_ALGORITHM) # JWTトークンの生成、エンコードを行う
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=SIG_ALGORITHM) # JWTトークンの生成、エンコードを行う
    return encoded_jwt

# @router.post("/login", response_model=Token)
# async def login(form_data: OAuth2PasswordRequestForm = Depends()):
#    user = authenticate_user(form_data.username, form_data.password)
#    if not user:
#        raise HTTPException(
#            status_code=status.HTTP_401_UNAUTHORIZED,
#            detail="ユーザ名またはパスワードが正しくありません",
#            headers={"WWW-Authenticate": "Bearer"}, # レスポンスヘッダー
#        )
#    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#    access_token = create_access_token(
#        data={"sub": user.username},
#        expires_delta=access_token_expires
#    )
#    return {"access_token": access_token, "token_type": "bearer"}
# クライアントは、このトークンを今後のリクエストの際にHTTPヘッダー（例: Authorization: Bearer <access_token>) に付与して送信し、
# 認証済みであることを証明

@router.post("/login", response_model=Token)
async def login(response: Response, form_data: UserLogin, db: Session = Depends(deps.get_db)):
    print("joined_date: ", get_joined_date_by_username(form_data.username, db))
    user = authenticate_user(form_data.username, form_data.password, db)
    print("user :", user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザ名またはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},  # レスポンスヘッダー
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    print("access_token_expires: ", access_token_expires)
    access_token = create_access_token(
        data={"user": user.username, "joined_date": get_joined_date_by_username(user.username, db)},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"user": user.username}, expires_delta=refresh_token_expires)
    # print("Hare")
    print(access_token)
    # response.set_cookie(key="sample_cookie", value="COOKIE_FROM_FASTAPI")
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,  # JavaScript からアクセス不可
        secure=False,  # HTTPS のみ
        samesite="Strict",  # CSRF 対策
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="Strict",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )
    return {"access_token": access_token, "token_type": "bearer"}


# def create_refresh_token(data: dict, expires_delta: timedelta | None = None):
#    """リフレッシュトークンの生成。通常はアクセストークンより長い有効期限にする"""
#    to_encode = data.copy()
#    if expires_delta:
#        expire = datetime.utcnow() + expires_delta
#    else:
#        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
#    to_encode.update({"exp": expire})
#    settings = Settings()

#    # encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=SIG_ALGORITHM)
#    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=SIG_ALGORITHM)
#    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:  # 有効期限の設定、数値表現になる
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    # print("now", datetime.now())
    # print(expire)
    # to_encode.update({"exp": expire}) # 先ほど計算した expire の値を "exp" キーとして、to_encode 辞書に追加
    to_encode.update({"authUserExp": int(expire.timestamp())})
    if "joined_date" in to_encode and isinstance(to_encode["joined_date"], datetime):
        to_encode["joined_date"] = to_encode["joined_date"].isoformat()
    settings = Settings()
    # print("SECRET_KEY", settings.SECRET_KEY)
    # print(to_encode)
    #encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=SIG_ALGORITHM) # JWTトークンの生成、エンコードを行う
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=SIG_ALGORITHM) # JWTトークンの生成、エンコードを行う
    return encoded_jwt


@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(
    request: Request, response: Response, db: Session = Depends(deps.get_db)
):
    """
    リフレッシュトークンを受け取り、そのトークンが有効であれば新たなアクセストークンを発行するエンドポイント
    """
    settings = Settings()
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="リフレッシュトークンがありません",
        )
    try:
        payload = jwt.decode(
            refresh_token, os.getenv("SECRET_KEY"), algorithms=[SIG_ALGORITHM]
        )
        username: str = payload.get("user")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="リフレッシュトークンのペイロードが無効です",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="リフレッシュトークンが無効です",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 新たなアクセストークンを生成
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # new_access_token = create_access_token(
    #    data={"user": username},
    #    expires_delta=access_token_expires
    # )
    new_access_token = create_access_token(
        data={"user": username, "joined_date": get_joined_date_by_username(username, db)},
        expires_delta=access_token_expires
    )
    response.set_cookie(
        key="token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"access_token": new_access_token, "token_type": "bearer"}


## リクエストから JWT トークンを検証し、現在のユーザ情報を取得する依存関数
# async def get_current_user(token: str = Depends(oauth2_scheme)):
#    credentials_exception = HTTPException(
#        status_code=status.HTTP_401_UNAUTHORIZED,
#        detail="認証情報が無効です",
#        headers={"WWW-Authenticate": "Bearer"},
#    )
#    settings = Settings()
#    try:
#        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[SIG_ALGORITHM])
#        username: str = payload.get("sub")
#        if username is None:
#            raise credentials_exception
#        token_data = TokenData(username=username)
#    except JWTError: # トークンの期限切れ等のエラー
#        raise credentials_exception
#    return token_data

# 認証が必要な保護エンドポイント
# @router.get("/protected") # トークンが無効であれば実行されない
# async def protected_route(current_user: TokenData = Depends(get_current_user)):
#    print("protected_route...")
#    return {"authusername" : current_user.username, "authJoinedDate": current_user.joined_date, "authUserExp": current_user.user_exp}


# 認証チェック用の関数
def get_current_user_info(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[SIG_ALGORITHM])
        return payload  # { "user_id": 123 }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# 認証が必要なエンドポイント
@router.get("/protected")
async def protected_route(payload: dict = Depends(get_current_user_info)):
    user = payload.get("user")
    joineddate = payload.get("joined_date")
    exp = payload.get("exp")
    # print("user: ", user)
    # print("joineddate: ", joineddate)
    # print("exp: ", exp)
    return {
        "message": "Authenticated",
        "authUserName": user,
        "authJoinedDate": joineddate,
        "authUserExp": exp,
    }


# JWTは認証情報の形式や内容そのものであり、クッキーはその情報をクライアント側に保持させ、安全にサーバーへ送るための手段
