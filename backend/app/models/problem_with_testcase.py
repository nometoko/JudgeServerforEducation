# backend/app/models/problem_with_testcase.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ProblemWithTestcase(Base):
    __tablename__ = "problem_with_testcase"

    problem_id = Column(Integer, primary_key=True, index=True)
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
    testcases = relationship("Testcase", back_populates="problem")
