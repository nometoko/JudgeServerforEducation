"""removed ProblemWithTestcase

Revision ID: c1a5e15b21e0
Revises: 65880800bb15
Create Date: 2025-02-21 02:59:49.483211

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "c1a5e15b21e0"
down_revision: Union[str, None] = "65880800bb15"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(
        "ix_problem_with_testcase_problem_id", table_name="problem_with_testcase"
    )
    op.drop_constraint("testcase_problem_id_fkey", "testcase", type_="foreignkey")
    op.drop_table("problem_with_testcase")
    op.create_foreign_key(None, "testcase", "problems", ["problem_id"], ["problem_id"])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "testcase", type_="foreignkey")
    op.create_foreign_key(
        "testcase_problem_id_fkey",
        "testcase",
        "problem_with_testcase",
        ["problem_id"],
        ["problem_id"],
    )
    op.create_table(
        "problem_with_testcase",
        sa.Column("problem_id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column("name", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("statement", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("constraints", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("execution_time", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column("memory_limit", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column("input_format", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("output_format", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column(
            "open_date", postgresql.TIMESTAMP(), autoincrement=False, nullable=True
        ),
        sa.Column(
            "close_date", postgresql.TIMESTAMP(), autoincrement=False, nullable=True
        ),
        sa.Column("border_score", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.PrimaryKeyConstraint("problem_id", name="problem_with_testcase_pkey"),
    )
    op.create_index(
        "ix_problem_with_testcase_problem_id",
        "problem_with_testcase",
        ["problem_id"],
        unique=False,
    )
    # ### end Alembic commands ###
