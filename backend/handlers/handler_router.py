from fastapi import APIRouter
from handlers import get_problem, receive_srcfile

router = APIRouter()

router.include_router(get_problem.router, prefix="/getProblemList", tags=["getProblem"])
router.include_router(receive_srcfile.router, prefix="/receiveFiles", tags=["receiveFiles"])
