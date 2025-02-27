from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app import models, schemas

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user

#def get_password_by_username(username: str) -> List[str]:
#    results = db.query(models.UserResponse.password)\
#                .filter(models.UserResponse.username == username)\
#                .all()
#    return [result.password for result in results]

def get_password_by_username(username: str, db: Session) -> Optional[str]:
    result = db.query(models.User.password)\
               .filter(models.User.user_name == username)\
               .first()
    return result.password if result else None

def get_joined_date_by_username(username: str, db: Session) -> Optional[datetime]:
    result = db.query(models.User.joined_date)\
               .filter(models.User.user_name == username)\
               .first()
    return result.joined_date if result else None

def get_all_b3_users(db: Session) -> list[schemas.UserResponse]:
    # 判定用の閾値を datetime オブジェクトに変換
    threshold = datetime.fromisoformat("2025-03-30T00:00:00+09:00")
    # joined_date が閾値以降のユーザーを取得
    users = db.query(models.User).filter(models.User.joined_date >= threshold).all()
    
    # 取得したユーザーの各情報を UserResponse として整形し、
    # なお表示時に「B3」とラベル付けする（ここでは print で表示例を示しています）
    b3_users = []
    for user in users:
        user.joined_date = user.joined_date.isoformat()
        user_response = schemas.UserResponse.from_orm(user)
        # 表示時に B3 と一緒に出力
        print("B3", user_response.user_name)
        b3_users.append(user_response)
    
    return b3_users

def delete_all_users(db: Session) -> None:
    db.query(models.User).delete()
    db.commit()
    return None
