# backend/app/models/input_file_content.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class InputFileContent(Base):
    __tablename__ = "input_file_content"

    testcase_id = Column(String, ForeignKey("testcase_with_path.testcase_id"), primary_key=True)
    file_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)

    # リレーションシップ
    testcase_with_path = relationship("TestcaseWithPath", back_populates="input_file_contents")
