import os
from fastapi import FastAPI, HTTPException
from fastapi import APIRouter
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

router = APIRouter()

# JWTトークンの署名に使用するアルゴリズム
ALGORITHM = "HS256"
# トークンの有効期限
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/login") # トークンの発行を行うため、POSTメソッドを使用。usernameとpasswordが正しければ、access_tokenをreturnする。
async def get_problem_handler():
    print("getProblemList")
    
	#    try:
    #    testcase_data = problems_crud.read_testcase_content(problem)
    #except Exception as e:
    #    raise HTTPException(status_code=500, detail=f"Failed to read testcase file: {str(e)}")

    return {"problems": [], "message": "Success"}






