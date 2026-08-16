"""Gap Crop Engine tables: crop_catalog, regional_crop_calendar, crop_nutrient_profile, crop_compatibility, field_observations.

Revision ID: 0003_gap_crop_engine
Revises: 0002_profile
Create Date: 2026-08-17
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003_gap_crop_engine"
down_revision: str | None = "0002_profile"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. crop_catalog
    op.create_table(
        "crop_catalog",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("crop_name", sa.String(120), nullable=False),
        sa.Column("code", sa.String(48), nullable=False),
        sa.Column("scientific_name", sa.String(120), nullable=True),
        sa.Column("hindi_name", sa.String(120), nullable=False),
        sa.Column("category", sa.String(48), nullable=False, server_default="Pulse"),
        sa.Column("min_duration_days", sa.Integer(), nullable=False, server_default="60"),
        sa.Column("max_duration_days", sa.Integer(), nullable=False, server_default="68"),
        sa.Column("water_requirement", sa.String(32), nullable=False, server_default="Low"),
        sa.Column("season", sa.String(48), nullable=False, server_default="Zaid / Summer"),
        sa.Column("is_legume", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("expected_yield_qtl_per_acre", sa.Float(), nullable=False, server_default="4.5"),
        sa.Column("net_profit_per_acre_min", sa.Integer(), nullable=False, server_default="20000"),
        sa.Column("net_profit_per_acre_max", sa.Integer(), nullable=False, server_default="30000"),
        sa.Column("investment_per_acre", sa.Integer(), nullable=False, server_default="7500"),
        sa.Column("market_price_per_quintal", sa.Integer(), nullable=False, server_default="6950"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_crop_catalog"),
        sa.UniqueConstraint("crop_name", name="uq_crop_catalog_crop_name"),
        sa.UniqueConstraint("code", name="uq_crop_catalog_code"),
    )
    op.create_index("ix_crop_catalog_crop_name", "crop_catalog", ["crop_name"])
    op.create_index("ix_crop_catalog_code", "crop_catalog", ["code"])

    # 2. regional_crop_calendar
    op.create_table(
        "regional_crop_calendar",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("state_name", sa.String(120), nullable=False),
        sa.Column("district_name", sa.String(120), nullable=False),
        sa.Column("crop_name", sa.String(120), nullable=False),
        sa.Column("sowing_start_month", sa.Integer(), nullable=False),
        sa.Column("sowing_end_month", sa.Integer(), nullable=False),
        sa.Column("harvest_start_month", sa.Integer(), nullable=False),
        sa.Column("harvest_end_month", sa.Integer(), nullable=False),
        sa.Column("regional_suitability", sa.String(32), nullable=False, server_default="High"),
        sa.Column("confidence_weight", sa.Float(), nullable=False, server_default="0.85"),
        sa.Column("source", sa.String(255), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_regional_crop_calendar"),
    )
    op.create_index("ix_regional_crop_calendar_state_name", "regional_crop_calendar", ["state_name"])
    op.create_index("ix_regional_crop_calendar_district_name", "regional_crop_calendar", ["district_name"])
    op.create_index("ix_regional_crop_calendar_crop_name", "regional_crop_calendar", ["crop_name"])

    # 3. crop_nutrient_profile
    op.create_table(
        "crop_nutrient_profile",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("crop_name", sa.String(80), nullable=False),
        sa.Column("nitrogen_effect", sa.String(120), nullable=False),
        sa.Column("phosphorus_effect", sa.String(120), nullable=False),
        sa.Column("potassium_effect", sa.String(120), nullable=False),
        sa.Column("organic_matter_effect", sa.String(120), nullable=False),
        sa.Column("is_legume", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("rotation_notes", sa.Text(), nullable=True),
        sa.Column("source", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_crop_nutrient_profile"),
        sa.UniqueConstraint("crop_name", name="uq_crop_nutrient_profile_crop_name"),
    )
    op.create_index("ix_crop_nutrient_profile_crop_name", "crop_nutrient_profile", ["crop_name"])

    # 4. crop_compatibility
    op.create_table(
        "crop_compatibility",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("previous_crop", sa.String(80), nullable=False),
        sa.Column("candidate_crop", sa.String(80), nullable=False),
        sa.Column("compatibility_status", sa.String(32), nullable=False),
        sa.Column("rotation_notes", sa.Text(), nullable=True),
        sa.Column("source", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_crop_compatibility"),
    )
    op.create_index("ix_crop_compatibility_previous_crop", "crop_compatibility", ["previous_crop"])
    op.create_index("ix_crop_compatibility_candidate_crop", "crop_compatibility", ["candidate_crop"])

    # 5. field_observations
    op.create_table(
        "field_observations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farmer_id", sa.String(80), nullable=True),
        sa.Column("state_name", sa.String(120), nullable=False),
        sa.Column("district_name", sa.String(120), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("previous_crop", sa.String(80), nullable=False),
        sa.Column("harvest_date", sa.Date(), nullable=False),
        sa.Column("next_crop", sa.String(80), nullable=False),
        sa.Column("next_sowing_date", sa.Date(), nullable=False),
        sa.Column("irrigation_type", sa.String(48), nullable=False),
        sa.Column("area_acres", sa.Float(), nullable=False),
        sa.Column("calculated_gap_days", sa.Integer(), nullable=False),
        sa.Column("recommended_crop", sa.String(80), nullable=False),
        sa.Column("score", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_field_observations"),
    )
    op.create_index("ix_field_observations_farmer_id", "field_observations", ["farmer_id"])


def downgrade() -> None:
    op.drop_table("field_observations")
    op.drop_table("crop_compatibility")
    op.drop_table("crop_nutrient_profile")
    op.drop_table("regional_crop_calendar")
    op.drop_table("crop_catalog")
