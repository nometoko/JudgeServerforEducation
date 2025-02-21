import os, shutil, magic
from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app import schemas
from app.api import deps
from app.api.api_v1 import endpoints
from utils.get_root_dir import get_root_dir
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

@router.post("/", response_model=receive_file_response)
async def receive_file(
    files: List[UploadFile],
    save_dir: str = os.path.join(ROOT_DIR, "compile_resource"),
    db: Session = Depends(deps.get_db)) -> receive_file_response:

    submission = schemas.SubmissionCreate(user_name="test", problem_id=1)
    result = await endpoints.create_submission_endpoint(submission, db)

    submission_id = result.submission_id    

    save_dir = os.path.join(save_dir, submission_id)
    os.makedirs(save_dir, exist_ok=True)

    for file in files:
        if file.filename == "":
            continue
            
        file_path: str = os.path.join(save_dir, file.filename)
        print(file_path)

        # copy file to save_dir
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        result = check_file_type(file_path)
        if not result.success:
            os.remove(file_path)
            return result
    return result
