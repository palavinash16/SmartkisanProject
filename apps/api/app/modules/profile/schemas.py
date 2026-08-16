"""Profile request/response schemas (FR-1.2–1.6)."""

from __future__ import annotations

import uuid
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.shared.enums import (
    Gender,
    GeocodeConfidence,
    IrrigationSource,
    Language,
    SocialCategory,
    SoilType,
)

# --------------------------------------------------------------------- farmer


class FarmerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str | None
    phone_masked: str
    preferred_language: str
    gender: str | None
    social_category: str | None
    date_of_birth: date | None
    consent_given: bool
    profile_completeness: float


class FarmerUpdateIn(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    preferred_language: Language | None = None
    gender: Gender | None = None
    social_category: SocialCategory | None = None
    date_of_birth: date | None = None
    consent_given: bool | None = None


# --------------------------------------------------------------------- farm


class FarmCreateIn(BaseModel):
    village: str = Field(min_length=1, max_length=120)
    district: str = Field(min_length=1, max_length=120)
    state: str = Field(min_length=1, max_length=120)
    pincode: str | None = Field(default=None, pattern=r"^\d{6}$")
    # Omit both to have the server geocode the village name.
    latitude: float | None = Field(default=None, ge=6.0, le=38.0)
    longitude: float | None = Field(default=None, ge=68.0, le=98.0)


class FarmUpdateIn(BaseModel):
    village: str | None = None
    district: str | None = None
    state: str | None = None
    pincode: str | None = Field(default=None, pattern=r"^\d{6}$")
    latitude: float | None = Field(default=None, ge=6.0, le=38.0)
    longitude: float | None = Field(default=None, ge=68.0, le=98.0)


class FarmOut(BaseModel):
    id: uuid.UUID
    village: str
    district: str
    state: str
    pincode: str | None
    latitude: float | None
    longitude: float | None
    geocode_source: str | None
    geocode_confidence: str | None
    total_area_acres: Decimal
    plot_count: int
    #: True when coordinates are coarse — the UI must prompt for a precise pin.
    needs_location_confirmation: bool


# --------------------------------------------------------------------- plot


class PlotCreateIn(BaseModel):
    """Area is supplied in the farmer's own unit; the server converts (FR-1.5)."""

    name: str | None = Field(default=None, max_length=80)
    area_input_value: Decimal = Field(gt=0, le=100000)
    area_input_unit: str = Field(description="acre | bigha | biswa | katha | hectare | ...")
    soil_type: SoilType
    irrigation_source: IrrigationSource
    previous_crop_code: str | None = Field(default=None, max_length=48)
    previous_harvest_date: date | None = None


class PlotUpdateIn(BaseModel):
    name: str | None = None
    area_input_value: Decimal | None = Field(default=None, gt=0, le=100000)
    area_input_unit: str | None = None
    soil_type: SoilType | None = None
    irrigation_source: IrrigationSource | None = None
    previous_crop_code: str | None = None
    previous_harvest_date: date | None = None


class PlotOut(BaseModel):
    id: uuid.UUID
    farm_id: uuid.UUID
    name: str | None
    area_input_value: Decimal
    area_input_unit: str
    area_acres: Decimal
    #: Echoed back so the farmer can catch a unit mistake (FR-1.5, risk R9).
    area_display: str
    conversion_note: str
    soil_type: str
    soil_type_label: str
    irrigation_source: str
    irrigation_label: str
    previous_crop_code: str | None
    previous_harvest_date: date | None
    #: Days until the next Kharif sowing — seeds the gap-crop flow (FR-2.1).
    suggested_gap_days: int | None


# --------------------------------------------------------------------- soil test


class SoilTestIn(BaseModel):
    ph: Decimal | None = Field(default=None, ge=3, le=10)
    ec_ds_m: Decimal | None = Field(default=None, ge=0)
    organic_carbon_pct: Decimal | None = Field(default=None, ge=0, le=5)
    n_kg_ha: Decimal | None = Field(default=None, ge=0)
    p_kg_ha: Decimal | None = Field(default=None, ge=0)
    k_kg_ha: Decimal | None = Field(default=None, ge=0)
    micronutrients: dict | None = None
    source: str = "SHC"
    tested_on: date | None = None


class SoilTestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    plot_id: uuid.UUID
    ph: Decimal | None
    ec_ds_m: Decimal | None
    organic_carbon_pct: Decimal | None
    n_kg_ha: Decimal | None
    p_kg_ha: Decimal | None
    k_kg_ha: Decimal | None
    micronutrients: dict | None
    source: str
    tested_on: date | None


# --------------------------------------------------------------------- reference


class LandUnitOut(BaseModel):
    code: str
    label_en: str
    label_local: str
    note: str
    acres_per_unit: float


class ReferenceOut(BaseModel):
    land_units: list[LandUnitOut]
    soil_types: list[dict]
    irrigation_sources: list[dict]
    languages: list[dict]


__all__ = [
    "FarmCreateIn",
    "FarmOut",
    "FarmUpdateIn",
    "FarmerOut",
    "FarmerUpdateIn",
    "GeocodeConfidence",
    "LandUnitOut",
    "PlotCreateIn",
    "PlotOut",
    "PlotUpdateIn",
    "ReferenceOut",
    "SoilTestIn",
    "SoilTestOut",
]
