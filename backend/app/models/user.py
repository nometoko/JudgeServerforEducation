from datetime import datetime
from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"
    # ユーザー名を主キーとする（ER図の user エンティティ）
    user_name = Column(String, primary_key=True, index=True)
    password = Column(String, nullable=False)
    joined_date = Column(DateTime, default=datetime.utcnow)

    # リレーションシップ: ユーザーは複数の提出 (submission) を持つ
    submissions = relationship("Submission", back_populates="user")
