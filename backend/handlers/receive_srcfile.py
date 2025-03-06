import os, shutil, magic
from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from concurrent.futures import ThreadPoolExecutor
from typing import List
from pydantic import BaseModel

import auth, judge
from app import schemas, crud
from app.api import deps

executor = ThreadPoolExecutor(max_workers=10)

class receive_file_response(BaseModel):
    success: bool
    msg: str

def check_file_type(file_name: str):
    mime = magic.Magic(mime=True)
    mime_type = mime.from_file(file_name)
    acceptable_mime_types = ["text/x-c", "text/makefile", "text/plain"]
    if mime_type not in acceptable_mime_types:
        raise HTTPException(status_code=400, detail=f"Invalid file type in {file_name}: {mime_type}")
    return receive_file_response(success=True, msg="File received")

router = APIRouter()

@router.post("/{problem_id}", response_model=str)
async def receive_file(
    problem_id: int,
    files: List[UploadFile],
    background_tasks: BackgroundTasks,
    user:auth.TokenData = Depends(auth.get_current_user),
    db: Session = Depends(deps.get_db),
    ) -> str:

    exec_dir = os.path.join("..", os.getenv("EXEC_DIR"))
    submission = schemas.SubmissionCreate(user_name=user.authUserName, problem_id=problem_id)
    created_submission = crud.create_submission(db, submission)

    submission_id = created_submission.submission_id

    save_dir = os.path.join(exec_dir, submission_id)
    os.makedirs(save_dir, exist_ok=False)

    for file in files:
        if file.filename == "":
            continue

        file_path: str = os.path.join(save_dir, file.filename)

        # copy file to save_dir
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        created_submission = check_file_type(file_path)
        if not created_submission.success:
            os.removedirs(save_dir)
            crud.delete_submission(db, submission_id)
            raise HTTPException(status_code=400, detail=created_submission.msg)

    try:
        judge.compile(save_dir)
    except Exception as e:
        update_submission = schemas.SubmissionUpdate(status="CE", compile_error=e.args[0])
        crud.update_submission_status(db, submission_id, update_submission)
        return submission_id

    testcases_with_path = crud.get_testcases_with_path_by_problem_id(db, problem_id)
    if not testcases_with_path:
        os.removedirs(save_dir)
        crud.delete_submission(db, submission_id)
        raise HTTPException(status_code=400, detail="No testcases found for this problem")

    for testcase_with_path in testcases_with_path:
        create_submission_result = schemas.SubmissionResultCreate( submission_id=submission_id, testcase_number=testcase_with_path.testcase_number)
        crud.create_submission_result(db, create_submission_result)

    # background_tasks.add_task(judge.judge, submission_id, problem_id, db)
    executor.submit(judge.judge, submission_id, problem_id)

    return submission_id
