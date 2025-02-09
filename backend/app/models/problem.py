# backend/app/models/problem.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Problem(Base):
    __tablename__ = "problems"

    problem_id = Column(Integer, primary_key=True, index=True)
    is_petit_coder = Column(Boolean, default=False)
    name = Column(String, nullable=False)
    statement = Column(Text, nullable=False)
    constraints = Column(Text)
    execution_time = Column(Integer, nullable=False)
    memory_limit = Column(Integer, nullable=False)
    input_format = Column(Text)
    output_format = Column(Text)
    open_date = Column(DateTime, default=datetime.utcnow)
    close_date = Column(DateTime)
    border_score = Column(Integer, nullable=False)

    # リレーションシップ
    submissions = relationship("Submission", back_populates="problem")
    testcase_with_paths = relationship("TestcaseWithPath", back_populates="problem")
