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

    bucket_name = os.getenv("BUCKET_NAME")
    if not bucket_name:
        raise HTTPException(status_code=500, detail="BUCKET_NAME environment variable not set")

    client = storage.Client()
    bucket = client.bucket(bucket_name)

    # 拡張子は.cか.hのファイルのみを取得
    blobs = bucket.list_blobs(prefix=submission_id)
    print(blobs)

    submitted_files = []

    for blob in blobs:
        if blob.name.endswith((".c", ".h")):
            filename = os.path.basename(blob.name)
            content = blob.download_as_text()
            submitted_files.append(FileListResponse(filename=filename, content=content.strip()))

    return submitted_files
