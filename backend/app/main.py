import os, shutil
import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from starlette.responses import FileResponse

from auth import login, create_new_user, change_password, logout

from app.core.config import settings
from app.api.api_v1.api_router import router as api_router
from handlers.handler_router import router as handler_router
import seed

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(create_new_user.router)
app.include_router(change_password.router)
app.include_router(handler_router, prefix="/handler")
# app.include_router(protected_router, prefix="/protected")

app.mount("/photos", StaticFiles(directory="static/photos"), name="static")
app.mount("/static", StaticFiles(directory="static/js", html=True), name="static")


@app.get("/top/{full_path:path}")
async def catch_all(full_path: str):
    return FileResponse("static/js/index.html")


@app.get("/")
async def root():
    return RedirectResponse("/top")


for r in app.routes:
    print(r)

# すべてのフロントエンドのパスを index.html にリダイレクト
# @app.get("/top/{full_path:path}")
# async def catch_all(full_path: str):
#     return FileResponse("frontend/dist/index.html")


@app.exception_handler(RequestValidationError)
async def handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    print(exc)
    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


# データベースに初期データを挿入
seed.insert_problem_info("../static", "seed_data/problems.json")
seed.insert_user_info("../static/seed_data/users_2025.json")

##### 以下は本番環境想定
## Check required environment variables
# required_env_vars = [
#    "PUBLIC_SERVER_IP", "FRONTEND_PORT", "PRIVATE_SERVER_IP",
#    "BACKEND_PORT", "MONGO_URI", "SECRET_KEY"
# ]
# missing_env_vars = [var for var in required_env_vars if os.getenv(var) is None]
# if missing_env_vars:
#    raise EnvironmentError(f"Missing environment variables: {', '.join(missing_env_vars)}")
#####

# データベース接続 (未実装)
# ログイン (未実装)

# APIの定義 (適宜追加すること)
