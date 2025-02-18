import os
from fastapi import FastAPI, HTTPException
### 別ファイルをimportするための記述。@routerにすることに注意 
from fastapi import APIRouter

router = APIRouter()
###

# 仮想のユーザーリストと問題リスト
#dummy_users = ["alice", "bob", "charlie"]
#dummy_problems = {
#    "alice": [
#        {"id": 1, "title": "Two Sum", "difficulty": "Easy"},
#        {"id": 2, "title": "Longest Substring Without Repeating Characters", "difficulty": "Medium"},
#    ],
#    "bob": [
#        {"id": 3, "title": "Median of Two Sorted Arrays", "difficulty": "Hard"}
#    ],
#    "charlie": [
#        {"id": 4, "title": "Example Problem", "difficulty": "Easy"}
#    ]
#}

import json

dummy_data = {
    "alice": [
        {
            "Problem": {
                "Id": "1",
                "Name": "Two Sum",
                "OpenDate": "2025-03-01T09:00:00Z",
                "CloseDate": "2025-03-10T09:00:00Z",
                "IsPetitCoder": True
            },
            "Status": True    # 完了している課題
        },
        {
            "Problem": {
                "Id": "2",
                "Name": "Longest Substring Without Repeating Characters",
                "OpenDate": "2025-03-02T09:00:00Z",
                "CloseDate": "2025-03-11T09:00:00Z",
                "IsPetitCoder": False
            },
            "Status": False   # 未完了の課題
        }
    ],
    "bob": [
        {
            "Problem": {
                "Id": "3",
                "Name": "Median of Two Sorted Arrays",
                "OpenDate": "2025-02-03T09:00:00Z",
                "CloseDate": "2025-03-12T09:00:00Z",
                "IsPetitCoder": False
            },
            "Status": False   # 未完了の課題
        },
        {
            "Problem": {
                "Id": "4",
                "Name": "Another Problem for Bob",
                "OpenDate": "2025-03-04T09:00:00Z",
                "CloseDate": "2025-03-13T09:00:00Z",
                "IsPetitCoder": False
            },
            "Status": False   # 完了している課題
        }
    ],
    "charlie": [
        {
            "Problem": {
                "Id": "5",
                "Name": "Example Problem",
                "OpenDate": "2025-03-05T09:00:00Z",
                "CloseDate": "2025-03-14T09:00:00Z",
                "IsPetitCoder": True
            },
            "Status": False   # 未完了の課題
        }
    ]
}

@router.get("/getProblemList/{user_name}")
async def get_problem_handler(user_name: str):
    print("getProblemList called for user:", user_name)
    
    # ユーザー名を照合
    if user_name not in dummy_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # ユーザーが存在する場合、問題リストを返す
    return {"problems": dummy_data[user_name], "message": "Success"}