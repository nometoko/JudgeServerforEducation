# backend/app/models/problem.py
import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from app.db.base_class import Base

class ImagePath(Base):
    __tablename__ = "image_paths"

    image_path_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_name = Column(String, ForeignKey("users.user_name"), nullable=False)
    user_fullname = Column(String, nullable=False)
    user_grade = Column(String, nullable=False)
    image_path = Column(String, nullable=False)
