from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app import schemas, crud
from app.api import deps
import auth
import utils

router = APIRouter()

@router.get("/", response_model=str)
async def get_random_photo_path(
    db: Session = Depends(deps.get_db)
) -> str:

    image_path = crud.get_random_image_path(db)
    if image_path is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No image path found",
        )
    return image_path.image_path
