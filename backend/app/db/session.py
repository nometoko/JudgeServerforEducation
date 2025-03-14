import os
from app.core.config import settings

# from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")  # Cloud SQL のインスタンス接続名

# SQLALCHEMY_DATABASE_URL = f"postgresql+pg8000://{DB_USER}:{DB_PASS}@/{DB_NAME}?unix_sock=/cloudsql/{DB_HOST}/.s.PGSQL.5432"

# DATABASE_URL =  f"postgresql+pg8000://{DB_USER}:{DB_PASS}@/{DB_NAME}?unix_sock=/cloudsql/{DB_HOST}/.s.PGSQL.5432"

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise EnvironmentError("DATABASE_URL environment variable not set")

engine = create_engine(DATABASE_URL)
SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

# if settings.SQLALCHEMY_DATABASE_URI:
#     engine = create_engine(
#         settings.SQLALCHEMY_DATABASE_URI,
#         pool_pre_ping=True,
#     )
#     SessionLocal = scoped_session(
#         sessionmaker(autocommit=False, autoflush=False, bind=engine)
#     )
#
#     if settings.ENVIRONMENT == "development":
#         db_info = f"Using database at {settings.SQLALCHEMY_DATABASE_URI}"
#         print(db_info)
# else:
#     raise ValueError("SQLALCHEMY_DATABASE_URI is not set")
