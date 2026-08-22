"""initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-23 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=64), server_default='Administrator', nullable=True),
        sa.Column('company', sa.String(length=255), server_default='NEXORA Enterprise', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Products
    op.create_table(
        'products',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('sku', sa.String(length=128), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), server_default='', nullable=True),
        sa.Column('brand', sa.String(length=128), server_default='NEXORA', nullable=True),
        sa.Column('category', sa.String(length=128), server_default='General', nullable=True),
        sa.Column('price', sa.String(length=32), server_default='$0.00', nullable=True),
        sa.Column('stock', sa.Integer(), server_default='100', nullable=True),
        sa.Column('status', sa.String(length=32), server_default='Active', nullable=True),
        sa.Column('quality_score', sa.Integer(), server_default='75', nullable=True),
        sa.Column('ai_enriched', sa.Boolean(), server_default='false', nullable=True),
        sa.Column('attributes', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_sku'), 'products', ['sku'], unique=True)

    # 3. Quality Issues
    op.create_table(
        'quality_issues',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('product_id', sa.String(length=64), nullable=False),
        sa.Column('issue_type', sa.String(length=128), nullable=False),
        sa.Column('field_name', sa.String(length=128), nullable=False),
        sa.Column('severity', sa.String(length=32), server_default='high', nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('suggestion', sa.Text(), server_default='', nullable=True),
        sa.Column('status', sa.String(length=32), server_default='Unresolved', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quality_issues_product_id'), 'quality_issues', ['product_id'], unique=False)

    # 4. Enrichments
    op.create_table(
        'enrichments',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('product_id', sa.String(length=64), nullable=False),
        sa.Column('tone', sa.String(length=64), server_default='Professional', nullable=True),
        sa.Column('language', sa.String(length=64), server_default='English', nullable=True),
        sa.Column('generated_content', sa.JSON(), nullable=True),
        sa.Column('quality_score', sa.Integer(), server_default='94', nullable=True),
        sa.Column('status', sa.String(length=32), server_default='Draft', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_enrichments_product_id'), 'enrichments', ['product_id'], unique=False)

    # 5. Catalog Documents
    op.create_table(
        'catalog_documents',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('file_type', sa.String(length=32), server_default='PDF', nullable=True),
        sa.Column('processing_status', sa.String(length=64), server_default='Pending', nullable=True),
        sa.Column('extraction_data', sa.JSON(), nullable=True),
        sa.Column('confidence_score', sa.Integer(), server_default='95', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # 6. Integrations
    op.create_table(
        'integrations',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('channel', sa.String(length=64), nullable=False),
        sa.Column('status', sa.String(length=32), server_default='disconnected', nullable=True),
        sa.Column('last_sync_at', sa.DateTime(), nullable=True),
        sa.Column('sync_status', sa.String(length=64), server_default='Idle', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_integrations_channel'), 'integrations', ['channel'], unique=True)

    # 7. Sync Jobs
    op.create_table(
        'sync_jobs',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('integration_id', sa.String(length=64), nullable=False),
        sa.Column('status', sa.String(length=32), server_default='Pending', nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['integration_id'], ['integrations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sync_jobs_integration_id'), 'sync_jobs', ['integration_id'], unique=False)

    # 8. Activity Logs
    op.create_table(
        'activity_logs',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=64), nullable=True),
        sa.Column('action', sa.String(length=128), nullable=False),
        sa.Column('entity_type', sa.String(length=64), nullable=False),
        sa.Column('entity_id', sa.String(length=64), nullable=False),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # 9. Reports
    op.create_table(
        'reports',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('report_type', sa.String(length=64), server_default='catalog', nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('reports')
    op.drop_table('activity_logs')
    op.drop_table('sync_jobs')
    op.drop_table('integrations')
    op.drop_table('catalog_documents')
    op.drop_table('enrichments')
    op.drop_table('quality_issues')
    op.drop_table('products')
    op.drop_table('users')
