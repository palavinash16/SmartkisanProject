"""FastAPI Router for Gap Crop Engine module."""

from __future__ import annotations

from typing import Union
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.gap_crop.schemas import (
    GapCropRecommendRequest,
    GapCropRecommendResponse,
    NoSuitableCropResponse,
)
from app.modules.gap_crop.seed_data import SEED_CROP_CATALOG
from app.modules.gap_crop.service import generate_gap_crop_recommendation

router = APIRouter(tags=["Gap Crop Engine"])


@router.post(
    "/api/v1/gap-crop/recommend",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Recommend short-duration gap crops",
    description=(
        "Identifies and ranks suitable short-duration gap crops that can be grown between "
        "the previous harvest date and the next planned sowing date.\n\n"
        "Calculates gap duration, evaluates crop rotation compatibility, irrigation suitability, "
        "regional crop season alignment, and estimated nutrient/rotation benefits."
    ),
    responses={
        200: {
            "description": "Successful top-3 recommendation or explicit no_suitable_crop response",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "status": "success",
                            "calculated_gap_days": 68,
                            "input_summary": {
                                "previous_crop": "Wheat",
                                "harvest_date": "2026-04-25",
                                "next_crop": "Paddy",
                                "next_sowing_date": "2026-07-02",
                                "irrigation_type": "Tube well",
                                "state_name": "Uttar Pradesh",
                                "district_name": "Ghaziabad",
                                "area_acres": 2.0,
                            },
                            "top_recommendations": [
                                {
                                    "rank": 1,
                                    "crop_code": "summer_moong",
                                    "crop_name": "Summer Moong",
                                    "hindi_name": "ग्रीष्मकालीन मूंग",
                                    "scientific_name": "Vigna radiata",
                                    "category": "Pulse",
                                    "duration_days": "60-65 Days",
                                    "water_requirement": "Low",
                                    "suitability_status": "High",
                                    "rotation_benefit": "Favorable",
                                    "estimated_nutrient_impact": "Previous Wheat cultivation may have a relatively high nitrogen demand; this Summer Moong recommendation receives a favorable rotation benefit.",
                                    "expected_yield": "4.5 qtl/acre",
                                    "projected_profit_per_acre": "₹22,000 - ₹30,000 / Acre",
                                    "projected_profit_total": 60000,
                                    "score": 98.5,
                                    "score_breakdown": {
                                        "gap_duration_fit": 40.0,
                                        "crop_compatibility": 20.0,
                                        "regional_suitability": 13.5,
                                        "irrigation_suitability": 10.0,
                                        "nutrient_rotation_benefit": 15.0,
                                        "total": 98.5,
                                    },
                                    "reasons": [
                                        "✓ Fits 68-day gap window",
                                        "✓ Favorable cereal-legume rotation",
                                    ],
                                    "warnings": [],
                                    "source_provenance": "Demo/seed data — requires source verification",
                                }
                            ],
                            "eligible_crops_count": 4,
                            "disclaimer": "Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test.",
                        },
                        "meta": {
                            "source": "SmartKisan Gap Crop Decision Engine v1.0",
                            "is_stale": False,
                            "data_as_of": "2026-08-17T00:00:00Z",
                            "model_version": "1.0.0",
                        },
                    }
                }
            },
        },
        400: {
            "description": "Validation failure (e.g. harvest date after sowing date, negative area, zero gap)",
        },
    },
)
@router.post("/gap-crop/recommend", response_model=dict, include_in_schema=False)
def recommend_gap_crop(
    req: GapCropRecommendRequest, db: Session = Depends(get_db)
):
    recommendation = generate_gap_crop_recommendation(req, db)
    return {
        "data": recommendation,
        "meta": {
            "source": "SmartKisan Gap Crop Decision Engine v1.0",
            "is_stale": False,
            "data_as_of": "2026-08-17T00:00:00Z",
            "model_version": "1.0.0",
        },
    }


@router.get("/api/v1/gap-crop/catalog", response_model=dict, summary="Get gap crop catalog")
@router.get("/gap-crop/catalog", response_model=dict, include_in_schema=False)
def get_gap_crop_catalog():
    return {
        "data": SEED_CROP_CATALOG,
        "meta": {
            "source": "SmartKisan Crop Catalog Database — Seed Version",
            "is_stale": False,
            "data_as_of": "2026-08-17T00:00:00Z",
            "model_version": None,
        },
    }
