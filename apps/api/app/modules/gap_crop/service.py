"""Gap Crop Recommendation Engine Service Orchestrator.

Orchestrates validation, gap days calculation, crop catalog querying, filtering,
compatibility matching, irrigation matching, regional calendar checking, nutrient estimation,
and transparent ranking.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from app.modules.gap_crop.models import CropMaster, FieldObservation
from app.modules.gap_crop.schemas import GapCropRecommendRequest
from app.modules.gap_crop.seed_data import SEED_CROP_CATALOG, SEED_DISTRICT_ZONE_MAP
from app.modules.gap_crop.services.gap_calc import calculate_gap_days
from app.modules.gap_crop.services.recommendation_ranker import rank_and_score_candidate_crops


# ---------------------------------------------------------------- Future Integration Stubs (§23)
def get_weather_suitability_stub(location: str, crop_name: str) -> Dict[str, Any]:
    """Future integration point for live weather API (Phase 1 Stub)."""
    return {
        "status": "stub",
        "message": "Weather integration point ready for future live API binding.",
        "suitability": "Optimal",
    }


def get_market_opportunity_stub(location: str, crop_name: str) -> Dict[str, Any]:
    """Future integration point for live Mandi API (Phase 1 Stub)."""
    return {
        "status": "stub",
        "message": "Mandi market opportunity integration point ready for future live API binding.",
        "opportunity": "High",
    }


# ---------------------------------------------------------------- Main Orchestrator
def generate_gap_crop_recommendation(
    req: GapCropRecommendRequest, db: Optional[Session] = None
) -> Dict[str, Any]:
    """Orchestrate top-3 gap crop recommendation pipeline with location precedence."""

    # 1. Validate & calculate gap days
    gap_days = calculate_gap_days(req.harvest_date, req.next_sowing_date)

    # 2. Get candidate crop catalog (Database or Seed Data fallback)
    candidate_crops = []
    if db is not None:
        try:
            db_crops = db.query(CropMaster).filter(CropMaster.active == True).all()
            for c in db_crops:
                candidate_crops.append({
                    "code": c.code,
                    "crop_name": c.crop_name,
                    "scientific_name": c.scientific_name,
                    "hindi_name": c.hindi_name,
                    "category": c.category,
                    "growth_habit": getattr(c, "growth_habit", "Annual"),
                    "is_gap_candidate": c.is_gap_candidate,
                    "min_duration_days": c.min_duration_days,
                    "max_duration_days": c.max_duration_days,
                    "water_requirement": c.water_requirement,
                    "season": c.season,
                    "is_legume": c.is_legume,
                    "expected_yield_qtl_per_acre": c.expected_yield_qtl_per_acre,
                    "net_profit_per_acre_min": c.net_profit_per_acre_min,
                    "net_profit_per_acre_max": c.net_profit_per_acre_max,
                    "investment_per_acre": c.investment_per_acre,
                    "market_price_per_quintal": c.market_price_per_quintal,
                    "description": c.description,
                })
        except Exception:
            candidate_crops = []

    if not candidate_crops:
        candidate_crops = SEED_CROP_CATALOG

    # 3. Harvest month
    harvest_month = req.harvest_date.month

    # 4. Rank candidates
    ranking_result = rank_and_score_candidate_crops(
        candidates=candidate_crops,
        previous_crop=req.previous_crop,
        harvest_month=harvest_month,
        gap_days=gap_days,
        irrigation_type=req.irrigation_type,
        state_name=req.state_name,
        district_name=req.district_name,
        area_acres=req.area_acres,
    )

    # Location context mapping
    dist_info = SEED_DISTRICT_ZONE_MAP.get(req.district_name or "", {})
    zone_name = dist_info.get("zone", "Regional Zone")

    # If no suitable crop scenario:
    if ranking_result["status"] == "no_suitable_crop":
        return {
            "status": "no_suitable_crop",
            "message": ranking_result["message"],
            "gap_days": gap_days,
            "suggestion": ranking_result["suggestion"],
            "location_context": {
                "state_name": req.state_name,
                "district_name": req.district_name,
                "agro_climatic_zone": zone_name,
            },
            "input_summary": {
                "previous_crop": req.previous_crop,
                "harvest_date": str(req.harvest_date),
                "next_crop": req.next_crop,
                "next_sowing_date": str(req.next_sowing_date),
                "irrigation_type": req.irrigation_type,
                "state_name": req.state_name,
                "district_name": req.district_name,
                "area_acres": req.area_acres,
            },
            "recommendations": [],
        }

    top_recommendations = ranking_result["top_recommendations"]

    # Save field observation to database if db session exists
    if db is not None and top_recommendations:
        try:
            best = top_recommendations[0]
            obs = FieldObservation(
                farmer_id=getattr(req, "farmer_id", None),
                state_name=req.state_name or "Uttar Pradesh",
                district_name=req.district_name or "Ghaziabad",
                previous_crop=req.previous_crop,
                harvest_date=req.harvest_date,
                next_crop=req.next_crop,
                next_sowing_date=req.next_sowing_date,
                irrigation_type=req.irrigation_type,
                area_acres=req.area_acres,
                calculated_gap_days=gap_days,
                recommended_crop=best["crop_name"],
                score=best["score"],
            )
            db.add(obs)
            db.commit()
        except Exception:
            db.rollback()

    top_res_level = top_recommendations[0].get("location_resolution_level", "State Official Data") if top_recommendations else "State Official Data"

    return {
        "status": "success",
        "calculated_gap_days": gap_days,
        "location_context": {
            "state_name": req.state_name,
            "district_name": req.district_name,
            "agro_climatic_zone": zone_name,
            "resolution_level": top_res_level,
        },
        "input_summary": {
            "previous_crop": req.previous_crop,
            "harvest_date": str(req.harvest_date),
            "next_crop": req.next_crop,
            "next_sowing_date": str(req.next_sowing_date),
            "irrigation_type": req.irrigation_type,
            "state_name": req.state_name,
            "district_name": req.district_name,
            "area_acres": req.area_acres,
        },
        "top_recommendations": top_recommendations,
        "eligible_crops_count": ranking_result["all_eligible_count"],
        "rejected_summary": ranking_result.get("rejected_summary", []),
        "disclaimer": "Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test.",
    }
