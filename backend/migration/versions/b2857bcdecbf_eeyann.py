"""eeyann

Revision ID: b2857bcdecbf
Revises: f49a24f43378
Create Date: 2025-02-21 14:08:23.032945

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2857bcdecbf'
down_revision: Union[str, None] = 'f49a24f43378'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('input_file_content_testcase_id_fkey', 'input_file_content', type_='foreignkey')
    op.create_foreign_key(None, 'input_file_content', 'testcase_with_path', ['testcase_id'], ['testcase_id'])
    op.drop_constraint('submission_result_testcase_id_fkey', 'submission_result', type_='foreignkey')
    op.create_foreign_key(None, 'submission_result', 'testcase_with_path', ['testcase_id'], ['testcase_id'])
    op.add_column('testcase', sa.Column('args_file_path', sa.Text(), nullable=False))
    op.drop_column('testcase', 'args_file_content')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('testcase', sa.Column('args_file_content', sa.TEXT(), autoincrement=False, nullable=False))
    op.drop_column('testcase', 'args_file_path')
    op.drop_constraint(None, 'submission_result', type_='foreignkey')
    op.create_foreign_key('submission_result_testcase_id_fkey', 'submission_result', 'testcase', ['testcase_id'], ['testcase_id'])
    op.drop_constraint(None, 'input_file_content', type_='foreignkey')
    op.create_foreign_key('input_file_content_testcase_id_fkey', 'input_file_content', 'testcase', ['testcase_id'], ['testcase_id'])
    # ### end Alembic commands ###
