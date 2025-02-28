import os, shutil
import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from auth import login, create_new_user, change_password
from utils.get_root_dir import get_root_dir
import dotenv

from app.core.config import settings
from app.api.api_v1.api_router import router as api_router
from handlers.handler_router import router as handler_router
import seed

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(login.router)
app.include_router(create_new_user.router)
app.include_router(change_password.router)
app.include_router(handler_router, prefix="/handler")
# app.include_router(protected_router, prefix="/protected")
for r in app.routes:
    print(r)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.exception_handler(RequestValidationError)
async def handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    print(exc)
    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


# 環境変数を読み込む
ROOT_DIR = get_root_dir()
os.environ["ROOT_DIR"] = ROOT_DIR
dotenv.load_dotenv(f"{ROOT_DIR}/frontend/.env")
print(os.getenv("PEPPER"))

exec_dir = os.path.join(ROOT_DIR, os.getenv("EXEC_DIR"))
dir_list = [os.path.join(exec_dir, dir_name) for dir_name in os.listdir(exec_dir) if os.path.isdir(os.path.join(exec_dir, dir_name))]
for dir_path in dir_list:
    shutil.rmtree(dir_path)

from app.db.session import engine
from app.db.base_class import Base

# データベースに初期データを挿入
seed.delete_all_db_data()
seed.insert_problem_info(f"{ROOT_DIR}/static", "seed_data/problems.json")
seed.insert_user_info(f"{ROOT_DIR}/static/seed_data/users_2025.json")
seed.insert_user_info(f"{ROOT_DIR}/static/seed_data/users_2025_2.json")

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

# CORS
# 許可するオリジンを指定 (すなわちフロントエンドのURL)
origins = [
    f"http://{os.getenv('PUBLIC_SERVER_IP')}:{os.getenv('FRONTEND_PORT')}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Cookieを使う場合はTrue
    allow_methods=["*"],  # 全てのHTTPメソッド (GETとか)を許可
    allow_headers=["*"],  # 全てのHTTPヘッダを許可、わかってないです
    # allow_headers=["Content-Type", "Authorization"],  # 必要なヘッダーのみ許可、他が必要かは検証
)

# データベース接続 (未実装)
# ログイン (未実装)


# APIの定義 (適宜追加すること)
@app.get("/")
async def hello():
    return {"message": "Hello,World"}


@app.get("/tmp")
async def tmp():
    return {"message": "Happy"}


# サーバー開始
if __name__ == "__main__":
    uvicorn.run(
        app,
        host=os.getenv("PRIVATE_SERVER_IP"),
        port=int(os.getenv("BACKEND_PORT")),
        log_level="debug",
    )
