from fastapi import APIRouter
from handlers import get_problem, receive_srcfile, get_submitted_files, get_submission_list, get_testcase_result_list, get_B3_status, get_random_photo

router = APIRouter()

router.include_router(get_problem.router, prefix="/getProblemList", tags=["getProblem"])
router.include_router(receive_srcfile.router, prefix="/receiveFiles", tags=["receiveFiles"])
router.include_router(get_submitted_files.router, prefix="/getSubmittedFiles", tags=["getSubmittedFiles"])
router.include_router(get_submission_list.router, prefix="/getSubmissionList", tags=["getSubmissionList"])
router.include_router(get_testcase_result_list.router, prefix="/getTestcaseResultList", tags=["getTestcaseResultList"])
router.include_router(get_B3_status.router, prefix="/getB3Status", tags=["getB3Status"])
router.include_router(get_random_photo.router, prefix="/getRandomPhoto", tags=["getRandomPhoto"])
