from fastapi import APIRouter

from app.api.api_v1.endpoints import users, submission

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(submission.router, prefix="/submission", tags=["submission"])
