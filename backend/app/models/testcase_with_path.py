# backend/app/models/testcase_with_path.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class TestcaseWithPath(Base):
    __tablename__ = "testcase_with_path"

    test_case_id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), nullable=False)
    args_file_path = Column(String, nullable=False)
    stdin_file_path = Column(String, nullable=False)
    input_file_path_list = Column(String)
    output_file_name = Column(String, nullable=False)
    answer_file_path = Column(String, nullable=False)

    # リレーションシップ
    problem = relationship("Problem", back_populates="testcase_with_paths")
