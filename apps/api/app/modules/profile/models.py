"""Farmer, farm, and plot models (FR-1.2–1.4, §3 Data Design)."""

from __future__ import annotations

import uuid
from datetime import date
from decimal import Decimal

from geoalchemy2 import Geometry
from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    ForeignKey,
    Index,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, Timestamped, UUIDPrimaryKey


class Farmer(Base, UUIDPrimaryKey, Timestamped):
    """A registered farmer.

    NFR-4.4: no full Aadhaar, no bank account numbers — not stored, ever.
    `phone_hash` is what we look up by; `phone_encrypted` holds the reversible
    value needed to send an SMS.
    """

    __tablename__ = "farmer"

    phone_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    phone_encrypted: Mapped[str] = mapped_column(Text, nullable=False)

    name: Mapped[str | None] = mapped_column(String(120))
    preferred_language: Mapped[str] = mapped_column(String(8), nullable=False, default="hi")
    gender: Mapped[str | None] = mapped_column(String(16))
    social_category: Mapped[str | None] = mapped_column(String(16))
    date_of_birth: Mapped[date | None] = mapped_column(Date)

    # DPDP Act 2023 (NFR-4.6)
    consent_given: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    consent_version: Mapped[str | None] = mapped_column(String(16))

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    farms: Mapped[list[Farm]] = relationship(
        back_populates="farmer", cascade="all, delete-orphan", lazy="selectin"
    )

    @property
    def profile_completeness(self) -> float:
        """Drives the onboarding nudge in the UI."""
        filled = sum(
            1
            for f in (self.name, self.gender, self.social_category, self.date_of_birth)
            if f is not None
        )
        return round((filled + (1 if self.farms else 0)) / 5, 2)


class Farm(Base, UUIDPrimaryKey, Timestamped):
    """A farm at one location. Weather and mandi distance are computed from `location`."""

    __tablename__ = "farm"

    farmer_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("farmer.id", ondelete="CASCADE"), nullable=False
    )

    village: Mapped[str] = mapped_column(String(120), nullable=False)
    district: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    pincode: Mapped[str | None] = mapped_column(String(6))

    # WGS-84 point; GIST-indexed for "mandis within N km" (FR-3.2)
    location: Mapped[object | None] = mapped_column(Geometry("POINT", srid=4326))
    geocode_source: Mapped[str | None] = mapped_column(String(32))
    geocode_confidence: Mapped[str | None] = mapped_column(String(32))

    farmer: Mapped[Farmer] = relationship(back_populates="farms")
    plots: Mapped[list[Plot]] = relationship(
        back_populates="farm", cascade="all, delete-orphan", lazy="selectin"
    )

    __table_args__ = (
        Index("ix_farm_farmer", "farmer_id"),
        Index("ix_farm_geo", "location", postgresql_using="gist"),
    )

    @property
    def total_area_acres(self) -> Decimal:
        return sum((p.area_acres for p in self.plots), Decimal("0"))


class Plot(Base, UUIDPrimaryKey, Timestamped):
    """A cultivable parcel — the unit recommendations are made for.

    FR-1.5 / risk R9: we store BOTH what the farmer typed (`area_input_value` +
    `area_input_unit`) and the canonical `area_acres`. Keeping the original input
    means a wrong conversion factor can be corrected later by recomputing, rather
    than being silently baked in and unrecoverable.
    """

    __tablename__ = "plot"

    farm_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("farm.id", ondelete="CASCADE"), nullable=False
    )

    name: Mapped[str | None] = mapped_column(String(80))

    area_input_value: Mapped[Decimal] = mapped_column(Numeric(12, 3), nullable=False)
    area_input_unit: Mapped[str] = mapped_column(String(24), nullable=False)
    area_acres: Mapped[Decimal] = mapped_column(Numeric(12, 4), nullable=False)

    soil_type: Mapped[str] = mapped_column(String(32), nullable=False)
    irrigation_source: Mapped[str] = mapped_column(String(32), nullable=False)

    previous_crop_code: Mapped[str | None] = mapped_column(String(48))
    previous_harvest_date: Mapped[date | None] = mapped_column(Date)

    boundary: Mapped[object | None] = mapped_column(Geometry("POLYGON", srid=4326))

    farm: Mapped[Farm] = relationship(back_populates="plots")
    soil_tests: Mapped[list[SoilTest]] = relationship(
        back_populates="plot", cascade="all, delete-orphan", lazy="selectin"
    )

    __table_args__ = (
        Index("ix_plot_farm", "farm_id"),
        CheckConstraint("area_acres > 0", name="area_positive"),
        CheckConstraint("area_input_value > 0", name="input_area_positive"),
    )

    @property
    def latest_soil_test(self) -> SoilTest | None:
        if not self.soil_tests:
            return None
        return max(self.soil_tests, key=lambda t: t.tested_on or date.min)


class SoilTest(Base, UUIDPrimaryKey, Timestamped):
    """Soil Health Card values (FR-1.6). Optional but improves yield estimates."""

    __tablename__ = "soil_test"

    plot_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("plot.id", ondelete="CASCADE"), nullable=False
    )

    ph: Mapped[Decimal | None] = mapped_column(Numeric(4, 2))
    ec_ds_m: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    organic_carbon_pct: Mapped[Decimal | None] = mapped_column(Numeric(5, 3))
    n_kg_ha: Mapped[Decimal | None] = mapped_column(Numeric(8, 2))
    p_kg_ha: Mapped[Decimal | None] = mapped_column(Numeric(8, 2))
    k_kg_ha: Mapped[Decimal | None] = mapped_column(Numeric(8, 2))
    micronutrients: Mapped[dict | None] = mapped_column(JSONB)

    source: Mapped[str] = mapped_column(String(16), nullable=False, default="SHC")
    tested_on: Mapped[date | None] = mapped_column(Date)

    plot: Mapped[Plot] = relationship(back_populates="soil_tests")

    __table_args__ = (
        Index("ix_soil_test_plot", "plot_id"),
        # Data-quality gates (§6 Data Design) — bad values never enter the table
        CheckConstraint("ph IS NULL OR (ph >= 3 AND ph <= 10)", name="ph_range"),
        CheckConstraint(
            "organic_carbon_pct IS NULL OR (organic_carbon_pct >= 0 AND organic_carbon_pct <= 5)",
            name="oc_range",
        ),
        CheckConstraint("n_kg_ha IS NULL OR n_kg_ha >= 0", name="n_non_negative"),
        CheckConstraint("p_kg_ha IS NULL OR p_kg_ha >= 0", name="p_non_negative"),
        CheckConstraint("k_kg_ha IS NULL OR k_kg_ha >= 0", name="k_non_negative"),
    )
