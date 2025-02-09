# backend/app/models/submission_with_problem_name.py

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SubmissionWithProblemName(Base):
    __tablename__ = "submission_with_problem_name"

    submission_id = Column(String, ForeignKey("submission.submission_id"), primary_key=True)
    user_name = Column(String, ForeignKey("users.user_name"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), nullable=False)
    submitted_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)
    problem_name = Column(String, nullable=False)

    # リレーションシップ
    submission = relationship("Submission", back_populates="submission_with_problem_name")
