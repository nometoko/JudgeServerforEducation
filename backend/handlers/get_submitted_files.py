import os
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from utils.get_root_dir import get_root_dir
ROOT_DIR = get_root_dir()

router = APIRouter()

class FileListResponse(BaseModel):
    filename: str
    content: str

@router.get("/{submission_id}", response_model=List[FileListResponse])
async def get_submitted_files(
    submission_id: str,
    dir_path: str = os.path.join(ROOT_DIR, "compile_resource"),
    db: Session = Depends(deps.get_db)
) -> List[FileListResponse]:

    files = [filename for filename in os.listdir(dir_path) if not filename.startswith('.') and filename != "Makefile"]
    submitted_files = []

    for file in files:
        with open(os.path.join(dir_path, file), "r") as f:
            content = f.read()
            submitted_files.append(FileListResponse(filename=file, content=content.strip()))
    return submitted_files
