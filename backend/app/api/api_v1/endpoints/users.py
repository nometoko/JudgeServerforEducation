from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter()


@router.get("/{user_name}", response_model=schemas.UserResponse)
async def get_user_by_user_name_endpoint(
    user_name: str,
    db: Session = Depends(deps.get_db)
) -> schemas.UserResponse:

    user = crud.get_user_by_user_name(db, user_name)
    user.joined_date = user.joined_date.isoformat()
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")
