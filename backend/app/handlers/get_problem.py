import os
from fastapi import FastAPI, HTTPException
### 別ファイルをimportするための記述。@routerにすることに注意 
from fastapi import APIRouter

router = APIRouter()
###

# 仮想のユーザーリストと問題リスト
dummy_users = ["alice", "bob", "charlie"]
dummy_problems = {
    "alice": [
        {"id": 1, "title": "Two Sum", "difficulty": "Easy"},
        {"id": 2, "title": "Longest Substring Without Repeating Characters", "difficulty": "Medium"},
    ],
    "bob": [
        {"id": 3, "title": "Median of Two Sorted Arrays", "difficulty": "Hard"}
    ],
    "charlie": [
        {"id": 4, "title": "Example Problem", "difficulty": "Easy"}
    ]
}

@router.get("/getProblemList/{user_name}")
async def get_problem_handler(user_name: str):
    print("getProblemList called for user:", user_name)
    
    # ユーザー名を照合
    if user_name not in dummy_users:
        raise HTTPException(status_code=404, detail="User not found")
    
    # ユーザーが存在する場合、問題リストを返す
    return {"problems": dummy_problems[user_name], "message": "Success"}