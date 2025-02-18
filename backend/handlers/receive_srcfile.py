import os, shutil, magic
from fastapi import APIRouter, UploadFile, Form
from typing import List
from pydantic import BaseModel

from utils.get_root_dir import get_root_dir
ROOT_DIR = get_root_dir()

def check_file_type(file_name: str):
    mime = magic.Magic(mime=True)
    mime_type = mime.from_file(file_name)
    if mime_type == "text/x-c" or mime_type == "text/makefile":
        return True, ""
    return False, mime_type

class receive_file_response(BaseModel):
    success: bool
    msg: str

router = APIRouter()

@router.post("/receivefiles/")
async def receive_file(files: List[UploadFile], submission_id: str = Form(...), save_dir: str = os.path.join(ROOT_DIR, "compile_resource")) -> receive_file_response:
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
        if not result[0]:
            os.remove(file_path)
            return receive_file_response(success=False, msg=f"Invalid file type: {result[1]}")
    return receive_file_response(success=True, msg="Success")

class FileListResponse(BaseModel):
    filename: str
    content: str

@router.get("/getfilelist", response_model=List[FileListResponse])
async def get_file_list(dir_path: str = os.path.join(ROOT_DIR, "compile_resource")) -> List[FileListResponse]:
    files = [filename for filename in os.listdir(dir_path) if not filename.startswith('.') and filename != "Makefile"]
    print(files)
    submitted_files = []
    for file in files:
        with open(os.path.join(dir_path, file), "r") as f:
            content = f.read()
            submitted_files.append(FileListResponse(filename=file, content=content.strip()))
    return submitted_files
