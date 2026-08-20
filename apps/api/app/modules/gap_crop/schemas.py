"""Pydantic schemas for Gap Crop Recommendation Engine API."""

from __future__ import annotations

from datetime import date
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class GapCropRecommendRequest(BaseModel):
    state_name: str = Field(
        "Uttar Pradesh", example="Uttar Pradesh", description="State name for regional crop calendar lookup"
    )
    district_name: str = Field(
        "Ghaziabad", example="Ghaziabad", description="District name for regional agricultural knowledge"
    )
    previous_crop: str = Field(
        "Wheat", example="Wheat", description="Name of previous harvested crop"
    )
    harvest_date: date = Field(
        ..., example="2026-04-25", description="Harvest date of previous crop (YYYY-MM-DD)"
    )
    next_crop: str = Field(
        "Paddy", example="Paddy", description="Next planned main crop"
    )
    next_sowing_date: date = Field(
        ..., example="2026-07-02", description="Target sowing date for next main crop (YYYY-MM-DD)"
    )
    irrigation_type: str = Field(
        "Tube well", example="Tube well", description="Irrigation facility (e.g. Tube well, Canal, Rainfed)"
    )
    area_acres: float = Field(
        2.0, gt=0.0, le=100.0, example=2.0, description="Farm land size in acres (must be > 0)"
    )


class LocationContext(BaseModel):
    state_name: str = Field(..., example="Uttar Pradesh")
    district_name: str = Field(..., example="Ghaziabad")
    agro_climatic_zone: Optional[str] = Field("Upper Gangetic Plain Zone")
    resolution_level: Optional[str] = Field("District Official Data", description="Location resolution precedence level")


class ScoreBreakdown(BaseModel):
    gap_duration_fit: float = Field(..., example=40.0, description="Duration fit score (0-40)")
    crop_compatibility: float = Field(..., example=20.0, description="Previous crop rotation compatibility score (0-20)")
    regional_suitability: float = Field(..., example=13.5, description="Regional season suitability score (0-15)")
    irrigation_suitability: float = Field(..., example=10.0, description="Irrigation source matching score (0-10)")
    nutrient_rotation_benefit: float = Field(..., example=15.0, description="Nutrient rotation impact score (0-15)")
    total: float = Field(..., example=98.5, description="Total composite ranking score (0-100)")


class GapCropRecommendationItem(BaseModel):
    rank: int = Field(..., example=1, description="Ranking position (1..3)")
    crop_code: str = Field(..., example="summer_moong")
    crop_name: str = Field(..., example="Summer Moong")
    hindi_name: str = Field(..., example="ग्रीष्मकालीन मूंग")
    scientific_name: Optional[str] = Field("Vigna radiata")
    category: str = Field(..., example="Pulse")
    duration_days: str = Field(..., example="55-65 Days")
    water_requirement: str = Field(..., example="Low")
    suitability_status: str = Field(..., example="High")
    rotation_benefit: str = Field(..., example="Favorable")
    estimated_nutrient_impact: str = Field(
        ...,
        example="Previous Wheat cultivation may have a relatively high nitrogen demand; this Summer Moong recommendation receives a favorable rotation benefit.",
    )
    expected_yield: str = Field(..., example="4.5 qtl/acre")
    projected_profit_per_acre: str = Field(..., example="₹22,000 - ₹30,000 / Acre")
    projected_profit_total: int = Field(..., example=60000)
    score: float = Field(..., example=98.5)
    score_breakdown: ScoreBreakdown
    location_resolution_level: Optional[str] = Field("District Official Data")
    agro_climatic_zone: Optional[str] = Field("Upper Gangetic Plain Zone")
    reasons: List[str] = Field(..., example=["✓ Optimal fit for 68-day window", "✓ Favorable cereal-legume rotation"])
    warnings: List[str] = Field(default_factory=list)
    source_provenance: str = Field("ICAR-IIPR Kanpur / UP Agri Dept Guidelines")


class InputSummary(BaseModel):
    previous_crop: str
    harvest_date: str
    next_crop: str
    next_sowing_date: str
    irrigation_type: str
    state_name: str
    district_name: str
    area_acres: float


class GapCropRecommendResponse(BaseModel):
    status: str = Field(..., example="success")
    calculated_gap_days: int = Field(..., example=68)
    location_context: LocationContext
    input_summary: InputSummary
    top_recommendations: List[GapCropRecommendationItem]
    eligible_crops_count: int = Field(..., example=4)
    rejected_summary: List[Dict[str, Any]] = Field(default_factory=list)
    disclaimer: str = Field(
        "Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test."
    )


class NoSuitableCropResponse(BaseModel):
    status: str = Field("no_suitable_crop", example="no_suitable_crop")
    message: str = Field(
        "No suitable gap crop was found for the available period and conditions.",
        example="No suitable gap crop was found for the available period and conditions.",
    )
    gap_days: int = Field(..., example=35)
    suggestion: str = Field(
        "Consider changing the planned sowing date or consult a local agricultural expert."
    )
    location_context: LocationContext
    input_summary: InputSummary
    recommendations: List[Any] = Field(default_factory=list)
