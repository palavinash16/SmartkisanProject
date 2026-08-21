"""Gap crop engine database models (FR-1.5, §3 Data Design) with Phase 3A.1 Knowledge Base Profiles."""

from __future__ import annotations

import uuid
from datetime import date
from typing import Optional

from sqlalchemy import (
    JSON,
    JSON,
    Boolean,
    Date,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, Timestamped, UUIDPrimaryKey


class StateModel(Base, UUIDPrimaryKey, Timestamped):
    """Database table: states"""

    __tablename__ = "states"

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(8), unique=True, nullable=False, index=True)


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
    """Database table: agricultural_sources (Knowledge Source & Provenance Registry)"""

    __tablename__ = "agricultural_sources"

    tier: Mapped[str] = mapped_column(String(32), nullable=False)  # TIER_1_ICAR, TIER_2_GOI, TIER_3_STATE_GOV, TIER_4_SAU
    organization: Mapped[str] = mapped_column(String(255), nullable=False)
    source_title: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str | None] = mapped_column(String(512))
    document_identifier: Mapped[str | None] = mapped_column(String(120))
    publication_year: Mapped[int | None] = mapped_column(Integer)
    verification_status: Mapped[str] = mapped_column(String(32), nullable=False, default="Verified")
    source_type: Mapped[str | None] = mapped_column(String(64))  # ICAR, ICAR_CRIDA, STATE_AGRICULTURAL_UNIVERSITY, IMD, etc.
    notes: Mapped[str | None] = mapped_column(Text)


# Alias for Phase 3 KnowledgeSource naming compatibility
KnowledgeSource = AgriculturalSourceModel


class CropMaster(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_catalog (Master Crop Entity)"""

    __tablename__ = "crop_catalog"

    crop_name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(48), unique=True, nullable=False, index=True)
    scientific_name: Mapped[str | None] = mapped_column(String(120))
    hindi_name: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(48), nullable=False, default="Pulse")
    sub_category: Mapped[str | None] = mapped_column(String(48))
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

    # Relationships to Phase 3A.1 Profiles
    agronomic_profile: Mapped[Optional[CropAgronomicProfile]] = relationship(
        "CropAgronomicProfile", back_populates="crop", uselist=False, cascade="all, delete-orphan"
    )
    regional_profiles: Mapped[list[CropRegionalProfile]] = relationship(
        "CropRegionalProfile", back_populates="crop", cascade="all, delete-orphan"
    )
    economic_profiles: Mapped[list[CropEconomicProfile]] = relationship(
        "CropEconomicProfile", back_populates="crop", cascade="all, delete-orphan"
    )
    varieties: Mapped[list[CropVariety]] = relationship(
        "CropVariety", back_populates="crop", cascade="all, delete-orphan"
    )


class CropVariety(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_varieties (Optional Future-Ready Crop Varieties)"""

    __tablename__ = "crop_varieties"

    crop_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("crop_catalog.id", ondelete="CASCADE"), nullable=False, index=True)
    variety_name: Mapped[str] = mapped_column(String(120), nullable=False)
    variety_code: Mapped[str] = mapped_column(String(48), unique=True, nullable=False, index=True)
    duration_days_min: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_days_max: Mapped[int] = mapped_column(Integer, nullable=False)
    typical_yield_qtl_acre: Mapped[float | None] = mapped_column(Float)
    characteristics: Mapped[Optional[dict]] = mapped_column(JSON().with_variant(JSONB, 'postgresql'), nullable=True)
    source_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agricultural_sources.id"))

    crop: Mapped[CropMaster] = relationship("CropMaster", back_populates="varieties")


class CropAgronomicProfile(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_agronomic_profiles (Phase 3A.1 General Agronomic Requirements)"""

    __tablename__ = "crop_agronomic_profiles"

    crop_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("crop_catalog.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    # Temperature Range (°C) - Nullable when unverified
    temperature_min_c: Mapped[float | None] = mapped_column(Float)
    temperature_optimal_min_c: Mapped[float | None] = mapped_column(Float)
    temperature_optimal_max_c: Mapped[float | None] = mapped_column(Float)
    temperature_max_c: Mapped[float | None] = mapped_column(Float)

    # Rainfall Requirements (mm)
    rainfall_min_mm: Mapped[float | None] = mapped_column(Float)
    rainfall_optimal_min_mm: Mapped[float | None] = mapped_column(Float)
    rainfall_optimal_max_mm: Mapped[float | None] = mapped_column(Float)

    # Soil Requirements
    soil_types: Mapped[Optional[dict]] = mapped_column(JSON().with_variant(JSONB, 'postgresql'), nullable=True)
    soil_ph_min: Mapped[float | None] = mapped_column(Float)
    soil_ph_max: Mapped[float | None] = mapped_column(Float)

    # Water & Irrigation Requirements
    water_requirement: Mapped[str | None] = mapped_column(String(32))
    irrigation_requirement: Mapped[str | None] = mapped_column(String(32))

    # Environmental Sensitivity
    waterlogging_tolerance: Mapped[str | None] = mapped_column(String(32))  # High, Moderate, Low, Sensitive
    drought_tolerance: Mapped[str | None] = mapped_column(String(32))       # High, Moderate, Low
    heat_sensitivity: Mapped[str | None] = mapped_column(String(32))        # High, Moderate, Low

    # Sowing / Harvest Window
    sowing_window: Mapped[str | None] = mapped_column(String(64))
    harvest_window: Mapped[str | None] = mapped_column(String(64))

    source_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agricultural_sources.id"))

    crop: Mapped[CropMaster] = relationship("CropMaster", back_populates="agronomic_profile")
    source: Mapped[AgriculturalSourceModel | None] = relationship("AgriculturalSourceModel")


class CropRegionalProfile(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_regional_profiles (Phase 3A.1 Regional Environmental Suitability)"""

    __tablename__ = "crop_regional_profiles"

    crop_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("crop_catalog.id", ondelete="CASCADE"), nullable=False, index=True
    )
    state_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    district_name: Mapped[str | None] = mapped_column(String(120), index=True)
    agro_climatic_zone: Mapped[str | None] = mapped_column(String(120), index=True)
    season: Mapped[str] = mapped_column(String(48), nullable=False, index=True)  # Kharif, Rabi, Zaid / Summer

    sowing_start_month: Mapped[int | None] = mapped_column(Integer)  # 1..12
    sowing_end_month: Mapped[int | None] = mapped_column(Integer)    # 1..12
    harvest_start_month: Mapped[int | None] = mapped_column(Integer) # 1..12
    harvest_end_month: Mapped[int | None] = mapped_column(Integer)   # 1..12

    soil_suitability: Mapped[str | None] = mapped_column(String(32))
    irrigation_suitability: Mapped[str | None] = mapped_column(String(32))
    regional_suitability: Mapped[str] = mapped_column(String(32), nullable=False, default="SUITABLE")  # SUITABLE, CONDITIONALLY_SUITABLE, NOT_SUITABLE, UNKNOWN
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="Active")
    reason: Mapped[str | None] = mapped_column(Text)

    source_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agricultural_sources.id"))

    crop: Mapped[CropMaster] = relationship("CropMaster", back_populates="regional_profiles")
    source: Mapped[AgriculturalSourceModel | None] = relationship("AgriculturalSourceModel")

    __table_args__ = (
        Index("ix_crop_reg_prof_lookup", "crop_id", "state_name", "season"),
    )


class CropEconomicProfile(Base, UUIDPrimaryKey, Timestamped):
    """Database table: crop_economic_profiles (Phase 3A.1 Cultivation Cost Breakdown & Yield Projections)"""

    __tablename__ = "crop_economic_profiles"

    crop_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("crop_catalog.id", ondelete="CASCADE"), nullable=False, index=True
    )
    regional_profile_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("crop_regional_profiles.id", ondelete="CASCADE"), index=True
    )

    # Yield Projections (qtl/acre)
    yield_min_qtl_acre: Mapped[float | None] = mapped_column(Float)
    yield_typical_qtl_acre: Mapped[float | None] = mapped_column(Float)
    yield_max_qtl_acre: Mapped[float | None] = mapped_column(Float)
    yield_unit: Mapped[str] = mapped_column(String(32), nullable=False, default="qtl/acre")

    # Granular Cost of Cultivation Breakdown (₹/acre)
    seed_cost_per_acre: Mapped[float | None] = mapped_column(Float)
    fertilizer_cost_per_acre: Mapped[float | None] = mapped_column(Float)
    pesticide_cost_per_acre: Mapped[float | None] = mapped_column(Float)
    labour_cost_per_acre: Mapped[float | None] = mapped_column(Float)
    irrigation_cost_per_acre: Mapped[float | None] = mapped_column(Float)
    machinery_cost_per_acre: Mapped[float | None] = mapped_column(Float)
    other_cost_per_acre: Mapped[float | None] = mapped_column(Float)

    # Calculated / Reference Total Costs
    total_cost_min: Mapped[float | None] = mapped_column(Float)
    total_cost_typical: Mapped[float | None] = mapped_column(Float)
    total_cost_max: Mapped[float | None] = mapped_column(Float)

    cost_period: Mapped[str] = mapped_column(String(32), nullable=False, default="Per Crop Season")
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="INR")

    source_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("agricultural_sources.id"))

    crop: Mapped[CropMaster] = relationship("CropMaster", back_populates="economic_profiles")
    regional_profile: Mapped[CropRegionalProfile | None] = relationship("CropRegionalProfile")
    source: Mapped[AgriculturalSourceModel | None] = relationship("AgriculturalSourceModel")


class CropRegionSuitability(Base, UUIDPrimaryKey, Timestamped):
    """Database table: regional_crop_calendar"""

    __tablename__ = "regional_crop_calendar"

    crop_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("crop_catalog.id"), index=True)
    variety_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("crop_varieties.id"), index=True)
    state_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    district_name: Mapped[str | None] = mapped_column(String(120), index=True)
    agro_climatic_zone: Mapped[str | None] = mapped_column(String(120), index=True)
    crop_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    sowing_start_month: Mapped[int] = mapped_column(Integer, nullable=False)
    sowing_end_month: Mapped[int] = mapped_column(Integer, nullable=False)
    harvest_start_month: Mapped[int] = mapped_column(Integer, nullable=False)
    harvest_end_month: Mapped[int] = mapped_column(Integer, nullable=False)
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
    compatibility_status: Mapped[str] = mapped_column(String(32), nullable=False)
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
