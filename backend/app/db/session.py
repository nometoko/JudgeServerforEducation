import os
import pg8000
from google.cloud.sql.connector import Connector, IPTypes

from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

# instance_connection_name = os.environ[
#     "INSTANCE_CONNECTION_NAME"
# ]  # e.g. 'project:region:instance'
# db_user = os.environ["DB_USER"]  # e.g. 'my-db-user'
# db_pass = os.environ["DB_PASS"]  # e.g. 'my-db-password'
# db_name = os.environ["DB_NAME"]  # e.g. 'my-database'

# ip_type = IPTypes.PRIVATE if os.environ.get("PRIVATE_IP") else IPTypes.PUBLIC

# initialize Cloud SQL Python Connector object
# connector = Connector()

# def getconn() -> pg8000.dbapi.Connection:
#     conn: pg8000.dbapi.Connection = connector.connect(
#         instance_connection_name,
#         "pg8000",
#         user=db_user,
#         password=db_pass,
#         db=db_name,
#         ip_type=ip_type,
#     )
#     return conn


# DATABASE_URL = os.getenv("DATABASE_URL")
# print(DATABASE_URL)
# if DATABASE_URL:
#     # engine = create_engine(
#     #     "postgresql+pg8000://",
#     #     creator=getconn,
#     # )
#     engine = create_engine(
#         DATABASE_URL,
#         pool_pre_ping=True,
#     )
#     SessionLocal = scoped_session(
#         sessionmaker(autocommit=False, autoflush=False, bind=engine)
#     )
#
#     if settings.ENVIRONMENT == "development":
#         db_info = f"Using database at {DATABASE_URL}"
#         print(db_info)
# else:
#     raise ValueError("DATABASE_URL environment variable not set")

if settings.SQLALCHEMY_DATABASE_URI:
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI,
        pool_pre_ping=True,
    )
    SessionLocal = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine)
    )

    if settings.ENVIRONMENT == "development":
        db_info = f"Using database at {settings.SQLALCHEMY_DATABASE_URI}"
        print(db_info)
else:
    raise ValueError("SQLALCHEMY_DATABASE_URI is not set")
