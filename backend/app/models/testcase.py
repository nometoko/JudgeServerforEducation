from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Testcase(Base):
    __tablename__ = "testcase"
    test_case_id = Column(Integer, primary_key=True, index=True)
    # 内容保持版の問題と関連付けるための外部キー
    problem_id = Column(Integer, ForeignKey("problem_with_testcase.problem_id"), nullable=False)
    args_file_content = Column(String, nullable=False)
    stdin_file_content = Column(String, nullable=False)
    answer_file_content = Column(String, nullable=False)

    # リレーションシップ
    problem = relationship("ProblemWithTestcase", back_populates="testcases")
    input_file_contents = relationship("InputFileContent", back_populates="testcase")
