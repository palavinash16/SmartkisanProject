"""Phase 3A.1 Crop Knowledge Base tables: crop_agronomic_profiles, crop_regional_profiles, crop_economic_profiles.

Revision ID: 0005_crop_knowledge_base
Revises: 0004_weather_module
Create Date: 2026-08-21
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0005_crop_knowledge_base"
down_revision: str | None = "0004_weather_module"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. Add optional sub_category to crop_catalog
    op.add_column("crop_catalog", sa.Column("sub_category", sa.String(length=48), nullable=True))

    # 2. Add optional source_type and notes to agricultural_sources
    op.add_column("agricultural_sources", sa.Column("source_type", sa.String(length=64), nullable=True))
    op.add_column("agricultural_sources", sa.Column("notes", sa.Text(), nullable=True))

    # 3. Create crop_agronomic_profiles
    op.create_table(
        "crop_agronomic_profiles",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("crop_id", sa.UUID(), nullable=False),
        sa.Column("temperature_min_c", sa.Float(), nullable=True),
        sa.Column("temperature_optimal_min_c", sa.Float(), nullable=True),
        sa.Column("temperature_optimal_max_c", sa.Float(), nullable=True),
        sa.Column("temperature_max_c", sa.Float(), nullable=True),
        sa.Column("rainfall_min_mm", sa.Float(), nullable=True),
        sa.Column("rainfall_optimal_min_mm", sa.Float(), nullable=True),
        sa.Column("rainfall_optimal_max_mm", sa.Float(), nullable=True),
        sa.Column("soil_types", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("soil_ph_min", sa.Float(), nullable=True),
        sa.Column("soil_ph_max", sa.Float(), nullable=True),
        sa.Column("water_requirement", sa.String(length=32), nullable=True),
        sa.Column("irrigation_requirement", sa.String(length=32), nullable=True),
        sa.Column("waterlogging_tolerance", sa.String(length=32), nullable=True),
        sa.Column("drought_tolerance", sa.String(length=32), nullable=True),
        sa.Column("heat_sensitivity", sa.String(length=32), nullable=True),
        sa.Column("sowing_window", sa.String(length=64), nullable=True),
        sa.Column("harvest_window", sa.String(length=64), nullable=True),
        sa.Column("source_id", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["crop_id"], ["crop_catalog.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_id"], ["agricultural_sources.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("crop_id"),
    )
    op.create_index("ix_crop_agronomic_profiles_crop_id", "crop_agronomic_profiles", ["crop_id"])

    # 4. Create crop_regional_profiles
    op.create_table(
        "crop_regional_profiles",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("crop_id", sa.UUID(), nullable=False),
        sa.Column("state_name", sa.String(length=120), nullable=False),
        sa.Column("district_name", sa.String(length=120), nullable=True),
        sa.Column("agro_climatic_zone", sa.String(length=120), nullable=True),
        sa.Column("season", sa.String(length=48), nullable=False),
        sa.Column("sowing_start_month", sa.Integer(), nullable=True),
        sa.Column("sowing_end_month", sa.Integer(), nullable=True),
        sa.Column("harvest_start_month", sa.Integer(), nullable=True),
        sa.Column("harvest_end_month", sa.Integer(), nullable=True),
        sa.Column("soil_suitability", sa.String(length=32), nullable=True),
        sa.Column("irrigation_suitability", sa.String(length=32), nullable=True),
        sa.Column("regional_suitability", sa.String(length=32), nullable=False, server_default="SUITABLE"),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="Active"),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("source_id", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["crop_id"], ["crop_catalog.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_id"], ["agricultural_sources.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_crop_regional_profiles_crop_id", "crop_regional_profiles", ["crop_id"])
    op.create_index("ix_crop_regional_profiles_state_name", "crop_regional_profiles", ["state_name"])
    op.create_index("ix_crop_regional_profiles_district_name", "crop_regional_profiles", ["district_name"])
    op.create_index("ix_crop_regional_profiles_agro_climatic_zone", "crop_regional_profiles", ["agro_climatic_zone"])
    op.create_index("ix_crop_regional_profiles_season", "crop_regional_profiles", ["season"])
    op.create_index("ix_crop_reg_prof_lookup", "crop_regional_profiles", ["crop_id", "state_name", "season"])

    # 5. Create crop_economic_profiles
    op.create_table(
        "crop_economic_profiles",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("crop_id", sa.UUID(), nullable=False),
        sa.Column("regional_profile_id", sa.UUID(), nullable=True),
        sa.Column("yield_min_qtl_acre", sa.Float(), nullable=True),
        sa.Column("yield_typical_qtl_acre", sa.Float(), nullable=True),
        sa.Column("yield_max_qtl_acre", sa.Float(), nullable=True),
        sa.Column("yield_unit", sa.String(length=32), nullable=False, server_default="qtl/acre"),
        sa.Column("seed_cost_per_acre", sa.Float(), nullable=True),
        sa.Column("fertilizer_cost_per_acre", sa.Float(), nullable=True),
        sa.Column("pesticide_cost_per_acre", sa.Float(), nullable=True),
        sa.Column("labour_cost_per_acre", sa.Float(), nullable=True),
        sa.Column("irrigation_cost_per_acre", sa.Float(), nullable=True),
        sa.Column("machinery_cost_per_acre", sa.Float(), nullable=True),
        sa.Column("other_cost_per_acre", sa.Float(), nullable=True),
        sa.Column("total_cost_min", sa.Float(), nullable=True),
        sa.Column("total_cost_typical", sa.Float(), nullable=True),
        sa.Column("total_cost_max", sa.Float(), nullable=True),
        sa.Column("cost_period", sa.String(length=32), nullable=False, server_default="Per Crop Season"),
        sa.Column("currency", sa.String(length=8), nullable=False, server_default="INR"),
        sa.Column("source_id", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["crop_id"], ["crop_catalog.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["regional_profile_id"], ["crop_regional_profiles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_id"], ["agricultural_sources.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_crop_economic_profiles_crop_id", "crop_economic_profiles", ["crop_id"])
    op.create_index("ix_crop_economic_profiles_regional_profile_id", "crop_economic_profiles", ["regional_profile_id"])


def downgrade() -> None:
    op.drop_table("crop_economic_profiles")
    op.drop_table("crop_regional_profiles")
    op.drop_table("crop_agronomic_profiles")
    op.drop_column("agricultural_sources", "notes")
    op.drop_column("agricultural_sources", "source_type")
    op.drop_column("crop_catalog", "sub_category")
