"""add Submission.complie_error

Revision ID: 01f672b68b36
Revises: 451d40032884
Create Date: 2025-02-23 16:44:29.496817

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '01f672b68b36'
down_revision: Union[str, None] = '451d40032884'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submission', sa.Column('compile_error', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('submission', 'compile_error')
    # ### end Alembic commands ###
