from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class InputFileContent(Base):
    __tablename__ = "input_file_content"
    # 複合主キー: test_case_id と file_name
    test_case_id = Column(Integer, ForeignKey("testcase.test_case_id"), primary_key=True)
    file_name = Column(String, primary_key=True)
    content = Column(String, nullable=False)

    # リレーションシップ: どのテストケースの入力ファイルか
    testcase = relationship("Testcase", back_populates="input_file_contents")
