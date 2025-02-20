# backend/app/models/result.py
import uuid
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Result(Base):
    __tablename__ = "result"
    result_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String, ForeignKey("submission.submission_id"), nullable=False)
    test_case_id = Column(Integer, ForeignKey("testcase.test_case_id"),nullable=False)
    status = Column(String, nullable=False)

    # リレーションシップ
    submission = relationship("Submission", back_populates="results")
