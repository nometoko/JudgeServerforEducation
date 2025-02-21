# backend/app/models/testcase_with_path.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.db.base_class import Base

class TestcaseWithPath(Base):
    __tablename__ = "testcase_with_path"

    testcase_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), nullable=False, index=True)
    testcase_number = Column(Integer, nullable=False)
    args_file_path = Column(String, nullable=False)
    stdin_file_path = Column(String, nullable=False)
    input_file_path_list = Column(String)
    output_file_name = Column(String, nullable=False)
    answer_file_path = Column(String, nullable=False)

    # リレーションシップ
    problem = relationship("Problem", back_populates="testcase_with_paths")
