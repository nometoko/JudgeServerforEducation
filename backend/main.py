import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import dotenv
import uvicorn

# 環境変数を読み込む
dotenv.load_dotenv("../frontend/.env")

##### 以下は本番環境想定
## Check required environment variables
#required_env_vars = [
#    "PUBLIC_SERVER_IP", "FRONTEND_PORT", "PRIVATE_SERVER_IP",
#    "BACKEND_PORT", "MONGO_URI", "SECRET_KEY"
#]
#missing_env_vars = [var for var in required_env_vars if os.getenv(var) is None]
#if missing_env_vars:
#    raise EnvironmentError(f"Missing environment variables: {', '.join(missing_env_vars)}")
#####

print(os.getenv("PUBLIC_SERVER_IP"))
print(os.getenv("FRONTEND_PORT"))
print(os.getenv("PRIVATE_SERVER_IP"))
print(os.getenv("BACKEND_PORT"))

# Initialize FastAPI
app = FastAPI()

# CORS
# 許可するオリジンを指定 (すなわちフロントエンドのURL)
origins = [
	f"http://{os.getenv('PUBLIC_SERVER_IP')}:{os.getenv('FRONTEND_PORT')}",
]
print(origins)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
	allow_credentials=True, # Cookieを使う場合はTrue
	allow_methods=["*"], # 全てのHTTPメソッド (GETとか)を許可
	#allow_headers=["*"] # 全てのHTTPヘッダを許可、わかってないです
	allow_headers=["Content-Type", "Authorization"],  # 必要なヘッダーのみ許可、他が必要かは検証
)

# データベース接続 (未実装)
# ログイン (未実装)

# APIの定義 (適宜追加すること)
@app.get("/getProblemList/{user_name}")
async def get_problem_list(user_name: str):
    return {"user": user_name, "problems": []}

@app.get("/getSubmissionList/{user_name}")
async def get_submission_list(user_name: str):
	return {"user": user_name, "submissions": []}

@app.get("/")
async def hello():
    return {"message" : "Hello,World"}

# サーバー開始
if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv("PRIVATE_SERVER_IP"), port=int(os.getenv("BACKEND_PORT")), log_level="debug")