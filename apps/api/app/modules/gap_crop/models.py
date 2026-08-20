"""SQLAlchemy models for India-Wide Gap Crop Engine module.

Entities:
- StateModel
- AgroClimaticZoneModel
- DistrictModel
- AgriculturalSourceModel
- CropMaster
- CropVariety
- CropRegionSuitability
- CropRotationMatrix
- FieldObservation
"""

from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import Boolean, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, Timestamped, UUIDPrimaryKey


class StateModel(Base, UUIDPrimaryKey, Timestamped):
    """Database table: states"""

    __tablename__ = "states"

    code: Mapped[str] = mapped_column(String(16), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)


class AgroClimaticZoneModel(Base, UUIDPrimaryKey, Timestamped):
    """Database table: agro_climatic_zones"""

    __tablename__ = "agro_climatic_zones"

    zone_code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    zone_name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)


class DistrictModel(Base, UUIDPrimaryKey, Timestamped):
    """Database table: districts"""

    __tablename__ = "districts"

    state_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("states.id"), nullable=False, index=True)
    agro_climatic_zone_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agro_climatic_zones.id"), index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)


class AgriculturalSourceModel(Base, UUIDPrimaryKey, Timestamped):
    """Database table: agricultural_sources"""

    __tablename__ = "agricultural_sources"

    tier: Mapped[str] = mapped_column(String(32), nullable=False)  # TIER_1_ICAR, TIER_2_GOI, TIER_3_STATE_GOV, TIER_4_SAU
    organization: Mapped[str] = mapped_column(String(255), nullable=False)
    source_title: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str | None] = mapped_column(String(512))
    document_identifier: Mapped[str | None] = mapped_column(String(120))
    publication_year: Mapped[int | None] = mapped_column(Integer)
    verification_status: Mapped[str] = mapped_column(String(32), nullable=False, default="Verified")


class CropMaster(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_catalog (Master Crop Entity)"""

    __tablename__ = "crop_catalog"

    crop_name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(48), unique=True, nullable=False, index=True)
    scientific_name: Mapped[str | None] = mapped_column(String(120))
    hindi_name: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(48), nullable=False, default="Pulse")
    growth_habit: Mapped[str] = mapped_column(String(32), nullable=False, default="Annual")
    is_gap_candidate: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    min_duration_days: Mapped[int] = mapped_column(Integer, nullable=False, default=60)
    max_duration_days: Mapped[int] = mapped_column(Integer, nullable=False, default=68)
    water_requirement: Mapped[str] = mapped_column(String(32), nullable=False, default="Low")
    season: Mapped[str] = mapped_column(String(48), nullable=False, default="Zaid / Summer")
    is_legume: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    expected_yield_qtl_per_acre: Mapped[float] = mapped_column(Float, nullable=False, default=4.5)
    net_profit_per_acre_min: Mapped[int] = mapped_column(Integer, nullable=False, default=20000)
    net_profit_per_acre_max: Mapped[int] = mapped_column(Integer, nullable=False, default=30000)
    investment_per_acre: Mapped[int] = mapped_column(Integer, nullable=False, default=7500)
    market_price_per_quintal: Mapped[int] = mapped_column(Integer, nullable=False, default=6950)
    description: Mapped[str | None] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class CropVariety(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_varieties"""

    __tablename__ = "crop_varieties"

    crop_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("crop_catalog.id"), nullable=False, index=True)
    variety_name: Mapped[str] = mapped_column(String(120), nullable=False)
    variety_code: Mapped[str] = mapped_column(String(48), unique=True, nullable=False, index=True)
    duration_days_min: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_days_max: Mapped[int] = mapped_column(Integer, nullable=False)
    typical_yield_qtl_acre: Mapped[float | None] = mapped_column(Float)
    source_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agricultural_sources.id"))


class CropRegionSuitability(Base, UUIDPrimaryKey, Timestamped):
    """Database table: regional_crop_calendar"""

    __tablename__ = "regional_crop_calendar"

    crop_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("crop_catalog.id"), index=True)
    variety_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("crop_varieties.id"), index=True)
    state_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    district_name: Mapped[str | None] = mapped_column(String(120), index=True)
    agro_climatic_zone: Mapped[str | None] = mapped_column(String(120), index=True)
    crop_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    sowing_start_month: Mapped[int] = mapped_column(Integer, nullable=False)  # 1..12
    sowing_end_month: Mapped[int] = mapped_column(Integer, nullable=False)    # 1..12
    harvest_start_month: Mapped[int] = mapped_column(Integer, nullable=False) # 1..12
    harvest_end_month: Mapped[int] = mapped_column(Integer, nullable=False)   # 1..12
    regional_suitability: Mapped[str] = mapped_column(String(32), nullable=False, default="High")
    irrigation_condition: Mapped[str] = mapped_column(String(32), nullable=False, default="All")
    confidence_weight: Mapped[float] = mapped_column(Float, nullable=False, default=0.85)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    source_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agricultural_sources.id"))
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class CropNutrientProfile(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_nutrient_profile"""

    __tablename__ = "crop_nutrient_profile"

    crop_name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    nitrogen_effect: Mapped[str] = mapped_column(String(120), nullable=False)
    phosphorus_effect: Mapped[str] = mapped_column(String(120), nullable=False)
    potassium_effect: Mapped[str] = mapped_column(String(120), nullable=False)
    organic_matter_effect: Mapped[str] = mapped_column(String(120), nullable=False)
    is_legume: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    rotation_notes: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(255), nullable=False)


class CropCompatibility(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_compatibility"""

    __tablename__ = "crop_compatibility"

    previous_crop: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    candidate_crop: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    compatibility_status: Mapped[str] = mapped_column(String(32), nullable=False)  # Compatible / Caution / Incompatible
    rotation_notes: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(255), nullable=False)


class FieldObservation(Base, UUIDPrimaryKey, Timestamped):
    """Database table: field_observations"""

    __tablename__ = "field_observations"

    farmer_id: Mapped[str | None] = mapped_column(String(80), index=True)
    state_name: Mapped[str] = mapped_column(String(120), nullable=False)
    district_name: Mapped[str] = mapped_column(String(120), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    previous_crop: Mapped[str] = mapped_column(String(80), nullable=False)
    harvest_date: Mapped[date] = mapped_column(Date, nullable=False)
    next_crop: Mapped[str] = mapped_column(String(80), nullable=False)
    next_sowing_date: Mapped[date] = mapped_column(Date, nullable=False)
    irrigation_type: Mapped[str] = mapped_column(String(48), nullable=False)
    area_acres: Mapped[float] = mapped_column(Float, nullable=False)
    calculated_gap_days: Mapped[int] = mapped_column(Integer, nullable=False)
    recommended_crop: Mapped[str] = mapped_column(String(80), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
