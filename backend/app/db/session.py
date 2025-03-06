import os

from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
    )
    SessionLocal = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine)
    )

    if settings.ENVIRONMENT == "development":
        db_info = f"Using database at {DATABASE_URL}"
        print(db_info)
else:
    raise ValueError("DATABASE_URL environment variable not set")
