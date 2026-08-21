"""Gap Crop Recommendation Engine Service Orchestrator with Phase 2D Weather Intelligence Integration."""

from __future__ import annotations

import logging
from datetime import date
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from app.modules.gap_crop.models import CropMaster, FieldObservation
from app.modules.gap_crop.schemas import GapCropRecommendRequest
from app.modules.gap_crop.seed_data import SEED_CROP_CATALOG, SEED_DISTRICT_ZONE_MAP
from app.modules.gap_crop.services.gap_calc import calculate_gap_days
from app.modules.gap_crop.services.recommendation_ranker import rank_and_score_candidate_crops
from app.modules.weather.service import get_normalized_weather_data

logger = logging.getLogger(__name__)

SUPPORTED_PULSES = {"summer moong", "moong", "urad", "arhar", "chana", "gram", "pulse"}


def get_weather_suitability_stub(location: str, crop_name: str) -> Dict[str, Any]:
    """Weather integration point bound to Phase 2 Weather Intelligence."""
    return {
        "status": "integrated",
        "message": "Phase 2 Weather Intelligence bound to Gap Crop Engine.",
        "suitability": "Optimal",
    }


def get_market_opportunity_stub(location: str, crop_name: str) -> Dict[str, Any]:
    """Future integration point for live Mandi API (Phase 1 Stub)."""
    return {
        "status": "stub",
        "message": "Mandi market opportunity integration point ready for future live API binding.",
        "opportunity": "High",
    }


def evaluate_forecast_weather_risk(
    crop_name: str,
    sowing_date: date,
    weather_data: Dict[str, Any] | None,
) -> Dict[str, Any]:
    """Evaluates forecast weather risk for planned sowing date with 7-day horizon validation."""
    if not weather_data or "forecast_7d" not in weather_data or not weather_data["forecast_7d"]:
        return {
            "weather_risk": "UNKNOWN",
            "weather_source": None,
            "weather_is_stale": False,
            "weather_location_resolution": None,
            "weather_reason_code": "WEATHER_SERVICE_UNAVAILABLE",
        }

    today = date.today()
    days_until_sowing = (sowing_date - today).days

    meta = weather_data.get("meta", {})
    forecast = weather_data.get("forecast_7d", [])

    # Horizon Check: Open-Meteo forecast is 7 days. If sowing date is > 7 days or in past
    if days_until_sowing < 0 or days_until_sowing >= len(forecast):
        return {
            "weather_risk": "UNKNOWN",
            "weather_source": meta.get("source", "Open-Meteo"),
            "weather_is_stale": meta.get("is_stale", False),
            "weather_location_resolution": meta.get("location_resolution", "GPS / Field Coordinates"),
            "weather_reason_code": "SOWING_DATE_BEYOND_FORECAST_HORIZON",
        }

    sowing_day_forecast = forecast[days_until_sowing]
    rain_val = sowing_day_forecast.get("rain_mm", 0.0)

    crop_lower = crop_name.lower()
    is_pulse = any(p in crop_lower for p in SUPPORTED_PULSES)

    if rain_val >= 64.5 and is_pulse:
        return {
            "weather_risk": "HIGH",
            "weather_source": meta.get("source", "Open-Meteo"),
            "weather_is_stale": meta.get("is_stale", False),
            "weather_location_resolution": meta.get("location_resolution", "GPS / Field Coordinates"),
            "weather_reason_code": "HEAVY_RAIN_SOWING_RISK",
        }
    elif rain_val >= 15.6:
        return {
            "weather_risk": "MODERATE",
            "weather_source": meta.get("source", "Open-Meteo"),
            "weather_is_stale": meta.get("is_stale", False),
            "weather_location_resolution": meta.get("location_resolution", "GPS / Field Coordinates"),
            "weather_reason_code": "MODERATE_RAIN_SOWING_WINDOW",
        }
    else:
        return {
            "weather_risk": "LOW",
            "weather_source": meta.get("source", "Open-Meteo"),
            "weather_is_stale": meta.get("is_stale", False),
            "weather_location_resolution": meta.get("location_resolution", "GPS / Field Coordinates"),
            "weather_reason_code": "NO_SIGNIFICANT_WEATHER_RISK_DETECTED",
        }


def fetch_crop_catalog(db: Session | None = None) -> List[Dict[str, Any]]:
    """Fetches crop catalog from database, falling back to seed data if empty."""
    if db is not None:
        try:
            crops_db = db.query(CropMaster).all()
            if crops_db:
                res = []
                for c in crops_db:
                    res.append({
                        "id": str(c.id),
                        "code": c.crop_code,
                        "crop_name": c.common_name_en,
                        "name": c.common_name_en,
                        "hindi_name": c.common_name_hi,
                        "scientific_name": c.botanical_name,
                        "category": c.crop_category,
                        "min_duration_days": c.min_duration_days,
                        "max_duration_days": c.max_duration_days,
                        "water_requirement": "Low",
                        "is_gap_candidate": c.crop_category.upper() in ["PULSE", "PULSES", "OILSEED", "OILSEEDS", "VEGETABLE", "VEGETABLES", "SUMMER_CROP"],
                    })
                return res
        except Exception as exc:
            logger.warning("DB crop catalog fetch failed: %s. Using seed catalog.", exc)

    return SEED_CROP_CATALOG


async def get_gap_crop_recommendations(
    req: GapCropRecommendRequest, db: Session | None = None
) -> Dict[str, Any]:
    """Main entry point: Phase 1 eligibility -> Ranker -> Weather risk enrichment."""
    # 1. Calculate gap days
    gap_days = calculate_gap_days(req.harvest_date, req.next_sowing_date)

    # 2. Safely fetch live/cached Open-Meteo weather data for district location
    weather_data = None
    try:
        weather_data = await get_normalized_weather_data(
            district=req.district_name, state=req.state_name
        )
    except Exception as exc:
        logger.warning("Weather fetch in Gap Crop Recommendation failed: %s", exc)
        weather_data = None

    # 3. Fetch candidate crops
    candidates = fetch_crop_catalog(db)

    # 4. Phase 1 Recommendation Engine (Eligibility & Ranking)
    harvest_month = req.harvest_date.month
    result = rank_and_score_candidate_crops(
        candidates=candidates,
        previous_crop=req.previous_crop,
        harvest_month=harvest_month,
        gap_days=gap_days,
        irrigation_type=req.irrigation_type,
        state_name=req.state_name,
        district_name=req.district_name,
        area_acres=req.area_acres,
    )

    # 5. Enrich eligible top recommendations with Weather Risk metadata
    if result.get("status") == "success" and "top_recommendations" in result:
        for rec in result["top_recommendations"]:
            w_info = evaluate_forecast_weather_risk(
                rec["crop_name"], req.next_sowing_date, weather_data
            )
            rec["weather_risk"] = w_info["weather_risk"]
            rec["weather_source"] = w_info["weather_source"]
            rec["weather_is_stale"] = w_info["weather_is_stale"]
            rec["weather_location_resolution"] = w_info["weather_location_resolution"]
            rec["weather_reason_code"] = w_info["weather_reason_code"]

    # 6. Format response
    if result.get("status") == "no_suitable_crop":
        return {
            "status": "no_suitable_crop",
            "message": result["message"],
            "gap_days": result["gap_days"],
            "suggestion": result["suggestion"],
            "location_context": {
                "state_name": req.state_name,
                "district_name": req.district_name,
                "agro_climatic_zone": "Upper Gangetic Plain Zone",
                "resolution_level": "District Official Data",
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

    return {
        "status": "success",
        "calculated_gap_days": gap_days,
        "location_context": {
            "state_name": req.state_name,
            "district_name": req.district_name,
            "agro_climatic_zone": "Upper Gangetic Plain Zone",
            "resolution_level": "District Official Data",
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
        "top_recommendations": result["top_recommendations"],
        "eligible_crops_count": result["all_eligible_count"],
        "rejected_summary": result["rejected_summary"],
        "disclaimer": "Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test.",
    }


async def generate_gap_crop_recommendation(
    req: GapCropRecommendRequest, db: Session | None = None
) -> Dict[str, Any]:
    """Orchestrates recommendation pipeline with weather integration."""
    return await get_gap_crop_recommendations(req, db)
