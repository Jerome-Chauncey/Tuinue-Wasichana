"""Add donation fields (nullable)

Revision ID: 26e8058203a3
Revises: 3590e7329299
Create Date: 2025-07-24 23:06:25.303844

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '26e8058203a3'
down_revision = '3590e7329299'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('donations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('frequency', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('is_anonymous', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('donations', schema=None) as batch_op:
        batch_op.drop_column('is_anonymous')
        batch_op.drop_column('frequency')

    # ### end Alembic commands ###
