import os
from typing import List, Dict
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter()

class ProblemStatus(BaseModel):
    ProblemId: int
    ProblemName: str
    Status: str

class B3StatusResponse(BaseModel):
    UserName: str
    ProblemsStatus: List[ProblemStatus]

@router.get("/", response_model=List[B3StatusResponse])
async def get_all_b3_status(db: Session = Depends(deps.get_db)) -> List[B3StatusResponse]:
    # B3の全ユーザーを取得
    b3_users = crud.get_all_b3_users(db)  # この関数がB3のユーザー一覧を取得すると仮定

    # 全問題を取得
    problems = crud.get_all_problems(db)

    results = []

    for user in b3_users:
        user_problem_status = []

        for problem in problems:
            # 各ユーザーの問題に対する提出情報を取得
            submissions = crud.get_submissions_by_user_name_and_problem_id(db, user.user_name, problem.problem_id)

            # ステータスの決定: "AC"があればAccepted、それ以外は未提出 "Pending"
            status = "Pending"
            if submissions:
                for submission in submissions:
                    if submission.status == "AC":
                        status = "Accepted"
                        break

            user_problem_status.append(ProblemStatus(
                ProblemId=problem.problem_id,
                ProblemName=problem.name,
                Status=status
            ))

        results.append(B3StatusResponse(
            UserName=user.user_name,
            ProblemsStatus=user_problem_status
        ))

    return results
