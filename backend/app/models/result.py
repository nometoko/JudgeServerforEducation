# backend/app/models/result.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Result(Base):
    __tablename__ = "result"

    submission_id = Column(String, ForeignKey("submission.submission_id"), primary_key=True)
    test_case_id = Column(Integer, primary_key=True)
    status = Column(String, nullable=False)

    # リレーションシップ
    submission = relationship("Submission", back_populates="results")
