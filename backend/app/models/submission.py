# backend/app/models/submission.py

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Submission(Base):
    __tablename__ = "submission"

    submission_id = Column(String, primary_key=True, index=True)
    user_name = Column(String, ForeignKey("users.user_name"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), nullable=False)
    submitted_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)

    # リレーションシップ
    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")
    results = relationship("Result", back_populates="submission")
    submitted_files = relationship("SubmittedFile", back_populates="submission")
    submission_with_problem_name = relationship("SubmissionWithProblemName", back_populates="submission", uselist=False)
