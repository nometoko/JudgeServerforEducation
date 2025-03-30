from fastapi import APIRouter

from app.api.api_v1.endpoints import users, submission, problem

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(submission.router, prefix="/submission", tags=["submission"])
router.include_router(problem.router, prefix="/problem", tags=["problem"])
