import os, re
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google.cloud import storage

from app.api import deps

router = APIRouter()

class FileListResponse(BaseModel):
    filename: str
    content: str

@router.get("/{submission_id}", response_model=List[FileListResponse])
async def get_submitted_files(
    submission_id: str,
) -> List[FileListResponse]:

    submitted_files = []
    bucket_name = os.getenv("BUCKET_NAME")

    if bucket_name:
        client = storage.Client()
        bucket = client.bucket(bucket_name)

        # 拡張子は.cか.hのファイルのみを取得
        blobs = bucket.list_blobs(prefix=submission_id)

        for blob in blobs:
            filename = os.path.basename(blob.name)
            content = blob.download_as_text()
            submitted_files.append(FileListResponse(filename=filename, content=content.strip()))

    else:
        exec_dir = os.getenv("EXEC_DIR")
        if not exec_dir:
            raise HTTPException(status_code=500, detail="EXEC_DIR environment variable not set")

        files_dir_path: str = os.path.join(exec_dir, submission_id)

        if not os.path.exists(files_dir_path):
            raise HTTPException(status_code=404, detail=f"Submission ID {submission_id} not found")

        for file in os.listdir(files_dir_path):
            if re.match(r".*\.(c|h)$", file):
                with open(os.path.join(files_dir_path, file)) as f:
                    content = f.read()
                submitted_files.append(FileListResponse(filename=file, content=content.strip()))

    return submitted_files
