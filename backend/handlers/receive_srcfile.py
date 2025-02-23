import os, shutil, magic
from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app import schemas, crud
from app.api import deps
from utils.get_root_dir import get_root_dir
from judge.judge import judge
ROOT_DIR = get_root_dir()

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

@router.post("/{user_name}/{problem_id}", response_model=str)
async def receive_file(
    user_name: str,
    problem_id: int,
    files: List[UploadFile],
    save_dir: str = os.path.join(ROOT_DIR, "compile_resource"),
    db: Session = Depends(deps.get_db)) -> str:

    submission = schemas.SubmissionCreate(user_name=user_name, problem_id=problem_id)
    created_submission = crud.create_submission(db, submission)

    submission_id = created_submission.submission_id    

    save_dir = os.path.join(save_dir, submission_id)
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

    testcases_with_path = crud.get_testcases_with_path_by_problem_id(db, problem_id)

    status = "AC"

    try:
        submission_result_list = await judge(submission_id, testcases_with_path)
        for submission_result in submission_result_list:
            created_submission_result =  crud.create_submission_result(db, submission_result)
            testcase_result_status = created_submission_result.status
            # statusの優先度: RE > WA > TLE > AC
            if status == "AC":
                status = testcase_result_status
            elif status == "TLE" and testcase_result_status in ["RE", "WA"]:
                status = testcase_result_status
            elif status == "WA" and testcase_result_status == "RE":
                status = testcase_result_status

    except RuntimeError as e:
        status = "CE"
        compile_error = e.args[0]

    update_submission = schemas.SubmissionUpdate(status=status, compile_error=compile_error if status == "CE" else None)
    updated_submission = crud.update_submission_status(db, submission_id, update_submission)

    return submission_id
