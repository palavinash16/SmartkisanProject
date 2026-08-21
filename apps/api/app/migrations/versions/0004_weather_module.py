"""Weather module tables: weather_cache, weather_advisories.

Revision ID: 0004_weather_module
Revises: 0003_gap_crop_engine
Create Date: 2026-08-21
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0004_weather_module"
down_revision: str | None = "0003_gap_crop_engine"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "weather_cache",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("location_key", sa.String(length=80), nullable=False, unique=True, index=True),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("village", sa.String(length=120), nullable=True),
        sa.Column("district", sa.String(length=120), nullable=True),
        sa.Column("state", sa.String(length=120), nullable=True),
        sa.Column("temperature_c", sa.Float(), nullable=False),
        sa.Column("rainfall_mm", sa.Float(), nullable=False),
        sa.Column("humidity_pct", sa.Float(), nullable=False),
        sa.Column("wind_kmh", sa.Float(), nullable=False),
        sa.Column("forecast_data", sa.JSON(), nullable=True),
        sa.Column("cached_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "weather_advisories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("rule_code", sa.String(length=48), nullable=False, unique=True),
        sa.Column("condition_expr", sa.String(length=120), nullable=False),
        sa.Column("message_hi", sa.Text(), nullable=False),
        sa.Column("message_en", sa.Text(), nullable=False),
        sa.Column("action_type", sa.String(length=32), nullable=False, server_default="GENERAL"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("weather_advisories")
    op.drop_table("weather_cache")
