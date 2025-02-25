from fastapi import APIRouter, Depends
from .initial_auth import get_current_user, TokenData

# 認証が必要なエンドポイント群用のルーターを作成
protected_router = APIRouter(
    dependencies=[Depends(get_current_user)]
)

@protected_router.get("/protected")
async def protected_route(current_user: TokenData = Depends(get_current_user)):
    return {"message": f"Hello, {current_user.username}!"}

# 他の保護されたエンドポイントもここに追加できる
@protected_router.get("/profile")
async def profile_route(current_user: TokenData = Depends(get_current_user)):
    # 現在のユーザー情報を利用して、プロフィール情報などを返す
    return {"profile": f"Profile data for {current_user.username}"}
