# backend/app/models/result.py
import uuid
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SubmissionResult(Base):
    __tablename__ = "submission_result"
    submission_id = Column(String, ForeignKey("submission.submission_id"), nullable=False, primary_key=True)
    testcase_id = Column(String, ForeignKey("testcase_with_path.testcase_id"), nullable=False, primary_key=True)
    status = Column(String, nullable=False)

    # リレーションシップ
    submission = relationship("Submission", back_populates="results")
