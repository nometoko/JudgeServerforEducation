from datetime import datetime
from sqlalchemy import Column, DateTime, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Submission(Base):
    __tablename__ = "submission"
    # ObjectID の代わりに String 型で扱う（必要に応じて UUID 等に変更可）
    submission_id = Column(String, primary_key=True, index=True)
    user_name = Column(String, ForeignKey("users.user_name"), nullable=False)
    # 基本版の問題（problems テーブル）を対象とする
    problem_id = Column(Integer, ForeignKey("problems.problem_id"), nullable=False)
    submitted_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)

    # リレーションシップ
    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")
    results = relationship("Result", back_populates="submission")
    submitted_files = relationship("SubmittedFile", back_populates="submission")
    # 提出＋問題名の拡張情報（1:1 関係を想定）
    submission_with_problem_name = relationship("SubmissionWithProblemName", back_populates="submission", uselist=False)
