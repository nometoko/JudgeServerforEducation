from typing import Generator
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

def get_db() -> Generator[Session, None, None]:
    """DB接続を行うジェネレータ関数

    Yields:
        Generator: DBセッション
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
