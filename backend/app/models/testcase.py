# backend/app/models/testcase.py
import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Testcase(Base):
    __tablename__ = "testcase"

    testcase_id = Column(String, ForeignKey("testcase_with_path.testcase_id"), primary_key=True)
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), nullable=False, index=True)
    testcase_number = Column(Integer, nullable=False)
    args_file_content = Column(Text, nullable=False)
    stdin_file_content = Column(Text, nullable=False)
    answer_file_content = Column(Text, nullable=False)
    input_file_content = Column(Text, nullable=True)

    # リレーションシップ
    problem = relationship("Problem", back_populates="testcases")
    testcase_with_path = relationship("TestcaseWithPath", back_populates="testcases")
