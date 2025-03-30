# backend/app/models/submission.py
import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Submission(Base):
    __tablename__ = "submission"

    submission_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_name = Column(String, ForeignKey("users.user_name"), nullable=False, index=True)
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), nullable=False)
    submitted_date = Column(String, nullable=False)
    status = Column(String, nullable=False)
    compile_error = Column(Text, nullable=True)

    # リレーションシップ
    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")
    results = relationship("SubmissionResult", back_populates="submission")
    submitted_files = relationship("SubmittedFile", back_populates="submission")
    submission_with_problem_name = relationship("SubmissionWithProblemName", back_populates="submission", uselist=False)
