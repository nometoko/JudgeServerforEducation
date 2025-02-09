# backend/app/models/submitted_file.py

from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SubmittedFile(Base):
    __tablename__ = "submitted_file"

    submission_id = Column(String, ForeignKey("submission.submission_id"), primary_key=True)
    name = Column(String, primary_key=True)
    content = Column(String, nullable=False)

    # リレーションシップ
    submission = relationship("Submission", back_populates="submitted_files")
