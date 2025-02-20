# backend/app/models/input_file_content.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class InputFileContent(Base):
    __tablename__ = "input_file_content"

    test_case_id = Column(Integer, ForeignKey("testcase.test_case_id"), primary_key=True)
    file_name = Column(String, primary_key=True)
    content = Column(Text, nullable=False)

    # リレーションシップ
    testcase = relationship("Testcase", back_populates="input_file_contents")
