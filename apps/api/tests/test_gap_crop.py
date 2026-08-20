"""Unit and API tests for India-Wide Gap Crop Recommendation Engine."""

from datetime import date
import pytest
from app.errors import AppError
from app.modules.gap_crop.schemas import GapCropRecommendRequest
from app.modules.gap_crop.seed_data import SEED_CROP_CATALOG
from app.modules.gap_crop.service import generate_gap_crop_recommendation
from app.modules.gap_crop.services.crop_calendar_service import evaluate_regional_suitability
from app.modules.gap_crop.services.crop_compatibility_service import evaluate_crop_compatibility
from app.modules.gap_crop.services.duration_filter import evaluate_duration_eligibility
from app.modules.gap_crop.services.gap_calc import calculate_gap_days
from app.modules.gap_crop.services.irrigation_filter import evaluate_irrigation_suitability
from app.modules.gap_crop.services.nutrient_estimator import evaluate_nutrient_rotation_impact
from app.modules.gap_crop.services.recommendation_ranker import rank_and_score_candidate_crops


# --------------------------------------------------------------------- A. Gap Calculation
def test_gap_calculation_valid_68_days():
    harvest = date(2026, 4, 25)
    sowing = date(2026, 7, 2)
    gap = calculate_gap_days(harvest, sowing)
    assert gap == 68


def test_gap_calculation_same_date_raises_error():
    harvest = date(2026, 4, 25)
    sowing = date(2026, 4, 25)
    with pytest.raises(AppError) as exc_info:
        calculate_gap_days(harvest, sowing)
    assert exc_info.value.code in ("INVALID_DATE_RANGE", "INVALID_GAP_DURATION")


def test_gap_calculation_harvest_after_sowing_raises_error():
    harvest = date(2026, 7, 2)
    sowing = date(2026, 4, 25)
    with pytest.raises(AppError) as exc_info:
        calculate_gap_days(harvest, sowing)
    assert exc_info.value.code == "INVALID_DATE_RANGE"


def test_gap_calculation_leap_year_handling():
    harvest = date(2028, 2, 28)
    sowing = date(2028, 3, 1)
    gap = calculate_gap_days(harvest, sowing)
    assert gap == 2


# --------------------------------------------------------------------- B. Duration Filtering
def test_duration_filtering_eligible_crop():
    crop = {"min_duration_days": 55, "max_duration_days": 65}
    eligible, status, score = evaluate_duration_eligibility(crop, 68)
    assert eligible is True
    assert score >= 30.0


def test_duration_filtering_too_long_crop_rejected():
    crop = {"min_duration_days": 80, "max_duration_days": 90}
    eligible, reason, score = evaluate_duration_eligibility(crop, 68)
    assert eligible is False
    assert "exceeds available gap" in reason
    assert score == 0.0


# --------------------------------------------------------------------- C. Crop Compatibility
def test_compatibility_wheat_to_summer_moong():
    status, notes, score = evaluate_crop_compatibility("Wheat", "Summer Moong")
    assert status == "Compatible"
    assert score == 20.0


# --------------------------------------------------------------------- D. Irrigation Filtering
def test_irrigation_rainfed_and_low_water_crop():
    crop = {"crop_name": "Cowpea", "water_requirement": "Low"}
    suitable, reason, score = evaluate_irrigation_suitability(crop, "Rainfed")
    assert suitable is True
    assert score == 10.0


def test_irrigation_rainfed_and_high_water_crop():
    crop = {"crop_name": "Paddy", "water_requirement": "High"}
    suitable, reason, score = evaluate_irrigation_suitability(crop, "Rainfed")
    assert suitable is False
    assert score == 0.0


# --------------------------------------------------------------------- E. Regional Location Precedence
def test_location_precedence_district_match():
    status, notes, score, meta = evaluate_regional_suitability("Summer Moong", "Punjab", "Ludhiana", 4)
    assert status == "High"
    assert meta["resolution_level"] == "District Official Data"
    assert "PAU" in meta["source_provenance"]


def test_location_precedence_zone_match():
    # Karnal in Haryana maps to Trans-Gangetic Plain Zone
    status, notes, score, meta = evaluate_regional_suitability("Summer Moong", "Haryana", "Karnal", 4)
    assert meta["resolution_level"] in ("District Official Data", "Agro-Climatic Zone Data")


def test_location_precedence_unmapped_district_no_borrowing():
    # Unmapped location returns Data Unavailable notice (no cross-state borrowing)
    status, notes, score, meta = evaluate_regional_suitability("Summer Moong", "Kerala", "Wayanad", 4)
    assert status == "Data Unavailable"
    assert meta["resolution_level"] == "Data Unavailable (No Borrowing)"


# --------------------------------------------------------------------- F. Nutrient / Rotation
def test_nutrient_estimation_legume_after_cereal():
    crop = {"crop_name": "Summer Moong", "is_legume": True}
    rating, explanation, score = evaluate_nutrient_rotation_impact("Wheat", crop)
    assert rating == "Favorable"
    assert "nitrogen demand" in explanation
    assert "measured soil test" not in explanation.lower()


# --------------------------------------------------------------------- G. Recommendation Ranking & Non-gap Exclusions
def test_recommendation_ranking_excludes_non_gap_crops():
    res = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Wheat",
        harvest_month=4,
        gap_days=68,
        irrigation_type="Tube well",
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        area_acres=2.0,
    )
    assert res["status"] == "success"
    crop_names = [c["crop_name"] for c in res["top_recommendations"]]
    assert "Paddy / Rice (Main Crop)" not in crop_names
    assert "Sugarcane" not in crop_names


def test_recommendation_ranking_no_suitable_crop():
    res = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Wheat",
        harvest_month=4,
        gap_days=25,  # 25-day gap: no crop fits
        irrigation_type="Tube well",
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        area_acres=2.0,
    )
    assert res["status"] == "no_suitable_crop"


# --------------------------------------------------------------------- H. API Surface Tests
def test_api_recommendation_success_punjab(client):
    payload = {
        "state_name": "Punjab",
        "district_name": "Ludhiana",
        "previous_crop": "Wheat",
        "harvest_date": "2026-04-20",
        "next_crop": "Paddy",
        "next_sowing_date": "2026-06-25",
        "irrigation_type": "Tube well",
        "area_acres": 3.0,
    }
    response = client.post("/api/v1/gap-crop/recommend", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["data"]["status"] == "success"
    assert body["data"]["location_context"]["state_name"] == "Punjab"
    assert body["data"]["location_context"]["district_name"] == "Ludhiana"
    assert len(body["data"]["top_recommendations"]) > 0
