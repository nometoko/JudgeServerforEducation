# backend/app/models/__init__.py

"""
このモジュールは、全モデルを一括でインポートするためのものです。
各モデルが Base.metadata に登録されるようにすることで、
Alembic の autogenerate 機能が全モデルの変更を検出できるようになります。

また、各モデル間で相互にリレーションシップを組む際の循環参照の問題を回避するためにも、
ここで一度すべてのモデルを読み込むようにしておくのが一般的なパターンです。
"""

from app.db.base_class import Base  # Base を明示的にインポート

# 各モデルのインポート（各ファイルで定義されているクラス名をそのまま利用）
from .user import User
from .problem import Problem
from .testcase_with_path import TestcaseWithPath
from .testcase import Testcase
from .input_file_content import InputFileContent
from .submission import Submission
from .submission_result import SubmissionResult
from .submitted_file import SubmittedFile
from .submission_with_problem_name import SubmissionWithProblemName

# __all__ に登録しておくと、from app.models import * などの形でも全モデルが取り込まれる
__all__ = [
    "User",
    "Problem",
    "TestcaseWithPath",
    "Testcase",
    "InputFileContent",
    "Submission",
    "SubmissionResult",
    "SubmittedFile",
    "SubmissionWithProblemName",
]
