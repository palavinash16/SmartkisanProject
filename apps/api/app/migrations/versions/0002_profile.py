"""Farmer, farm, plot, and soil_test tables (FR-1.2-1.6).

Revision ID: 0002_profile
Revises: 0001_extensions
Create Date: 2026-08-04
"""

from collections.abc import Sequence

import geoalchemy2
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0002_profile"
down_revision: str | None = "0001_extensions"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "farmer",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        # NFR-4.3: phone is stored hashed (for lookup) and encrypted (for SMS).
        # The plaintext number is never persisted.
        sa.Column("phone_hash", sa.String(64), nullable=False),
        sa.Column("phone_encrypted", sa.Text(), nullable=False),
        sa.Column("name", sa.String(120), nullable=True),
        sa.Column("preferred_language", sa.String(8), nullable=False, server_default="hi"),
        sa.Column("gender", sa.String(16), nullable=True),
        sa.Column("social_category", sa.String(16), nullable=True),
        sa.Column("date_of_birth", sa.Date(), nullable=True),
        sa.Column("consent_given", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("consent_version", sa.String(16), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.PrimaryKeyConstraint("id", name="pk_farmer"),
        sa.UniqueConstraint("phone_hash", name="uq_farmer_phone_hash"),
    )
    op.create_index("ix_farmer_phone_hash", "farmer", ["phone_hash"])

    op.create_table(
        "farm",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farmer_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("village", sa.String(120), nullable=False),
        sa.Column("district", sa.String(120), nullable=False),
        sa.Column("state", sa.String(120), nullable=False),
        sa.Column("pincode", sa.String(6), nullable=True),
        sa.Column(
            "location",
            geoalchemy2.types.Geometry(geometry_type="POINT", srid=4326, spatial_index=False),
            nullable=True,
        ),
        sa.Column("geocode_source", sa.String(32), nullable=True),
        sa.Column("geocode_confidence", sa.String(32), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["farmer_id"], ["farmer.id"], name="fk_farm_farmer_id_farmer", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_farm"),
    )
    op.create_index("ix_farm_farmer", "farm", ["farmer_id"])
    op.create_index("ix_farm_district", "farm", ["district"])
    op.create_index("ix_farm_state", "farm", ["state"])
    # GIST index makes "mandis within N km" an index scan rather than a table scan (FR-3.2).
    op.create_index("ix_farm_geo", "farm", ["location"], postgresql_using="gist")

    op.create_table(
        "plot",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(80), nullable=True),
        # FR-1.5 / risk R9: keep the farmer's original input alongside the
        # canonical acres so a corrected conversion factor can be re-applied.
        sa.Column("area_input_value", sa.Numeric(12, 3), nullable=False),
        sa.Column("area_input_unit", sa.String(24), nullable=False),
        sa.Column("area_acres", sa.Numeric(12, 4), nullable=False),
        sa.Column("soil_type", sa.String(32), nullable=False),
        sa.Column("irrigation_source", sa.String(32), nullable=False),
        sa.Column("previous_crop_code", sa.String(48), nullable=True),
        sa.Column("previous_harvest_date", sa.Date(), nullable=True),
        sa.Column(
            "boundary",
            geoalchemy2.types.Geometry(geometry_type="POLYGON", srid=4326, spatial_index=False),
            nullable=True,
        ),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["farm_id"], ["farm.id"], name="fk_plot_farm_id_farm", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_plot"),
        sa.CheckConstraint("area_acres > 0", name="ck_plot_area_positive"),
        sa.CheckConstraint("area_input_value > 0", name="ck_plot_input_area_positive"),
    )
    op.create_index("ix_plot_farm", "plot", ["farm_id"])

    op.create_table(
        "soil_test",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("plot_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ph", sa.Numeric(4, 2), nullable=True),
        sa.Column("ec_ds_m", sa.Numeric(6, 3), nullable=True),
        sa.Column("organic_carbon_pct", sa.Numeric(5, 3), nullable=True),
        sa.Column("n_kg_ha", sa.Numeric(8, 2), nullable=True),
        sa.Column("p_kg_ha", sa.Numeric(8, 2), nullable=True),
        sa.Column("k_kg_ha", sa.Numeric(8, 2), nullable=True),
        sa.Column("micronutrients", postgresql.JSONB(), nullable=True),
        sa.Column("source", sa.String(16), nullable=False, server_default="SHC"),
        sa.Column("tested_on", sa.Date(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["plot_id"], ["plot.id"], name="fk_soil_test_plot_id_plot", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_soil_test"),
        # Data-quality gates (§6 Data Design) enforced by the database, not by app code.
        sa.CheckConstraint("ph IS NULL OR (ph >= 3 AND ph <= 10)", name="ck_soil_test_ph_range"),
        sa.CheckConstraint(
            "organic_carbon_pct IS NULL OR (organic_carbon_pct >= 0 AND organic_carbon_pct <= 5)",
            name="ck_soil_test_oc_range",
        ),
        sa.CheckConstraint("n_kg_ha IS NULL OR n_kg_ha >= 0", name="ck_soil_test_n_non_negative"),
        sa.CheckConstraint("p_kg_ha IS NULL OR p_kg_ha >= 0", name="ck_soil_test_p_non_negative"),
        sa.CheckConstraint("k_kg_ha IS NULL OR k_kg_ha >= 0", name="ck_soil_test_k_non_negative"),
    )
    op.create_index("ix_soil_test_plot", "soil_test", ["plot_id"])


def downgrade() -> None:
    op.drop_table("soil_test")
    op.drop_table("plot")
    op.drop_index("ix_farm_geo", table_name="farm")
    op.drop_table("farm")
    op.drop_table("farmer")
