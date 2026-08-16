"""Unit and API tests for Phase 1: Gap Crop Recommendation Engine."""

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
    # 2028 is a leap year (Feb 29 exists)
    harvest = date(2028, 2, 28)
    sowing = date(2028, 3, 1)
    gap = calculate_gap_days(harvest, sowing)
    assert gap == 2  # 28-Feb to 29-Feb is 1, 29-Feb to 1-Mar is 2 total days


# --------------------------------------------------------------------- B. Duration Filtering
def test_duration_filtering_eligible_crop():
    crop = {"min_duration_days": 60, "max_duration_days": 65}
    eligible, status, score = evaluate_duration_eligibility(crop, 68)
    assert eligible is True
    assert score >= 30.0


def test_duration_filtering_too_long_crop_rejected():
    crop = {"min_duration_days": 80, "max_duration_days": 90}
    eligible, reason, score = evaluate_duration_eligibility(crop, 68)
    assert eligible is False
    assert "exceeds available gap" in reason
    assert score == 0.0


def test_duration_filtering_exact_boundary():
    crop = {"min_duration_days": 60, "max_duration_days": 68}
    eligible, status, score = evaluate_duration_eligibility(crop, 68)
    assert eligible is True
    assert score >= 30.0


# --------------------------------------------------------------------- C. Crop Compatibility
def test_compatibility_wheat_to_summer_moong():
    status, notes, score = evaluate_crop_compatibility("Wheat", "Summer Moong")
    assert status == "Compatible"
    assert score == 20.0


def test_compatibility_unknown_crop_pair():
    status, notes, score = evaluate_crop_compatibility("RandomCropX", "RandomCandidateY")
    assert status in ("Unknown / Neutral", "Compatible")
    assert score > 0


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


def test_irrigation_tubewell_and_medium_water_crop():
    crop = {"crop_name": "Summer Urad", "water_requirement": "Medium"}
    suitable, reason, score = evaluate_irrigation_suitability(crop, "Tube well")
    assert suitable is True
    assert score >= 8.0


# --------------------------------------------------------------------- E. Regional Crop Calendar
def test_regional_calendar_valid_season():
    status, notes, score = evaluate_regional_suitability("Summer Moong", "Uttar Pradesh", "Ghaziabad", 4)
    assert status == "High"
    assert score >= 12.0


def test_regional_calendar_missing_data_fallback():
    status, notes, score = evaluate_regional_suitability("Summer Moong", "UnknownState", "UnknownDistrict", 4)
    assert status == "Data Unavailable"
    assert notes == "Regional suitability data unavailable."
    assert score == 10.0


# --------------------------------------------------------------------- F. Nutrient / Rotation
def test_nutrient_estimation_legume_after_cereal():
    crop = {"crop_name": "Summer Moong", "is_legume": True}
    rating, explanation, score = evaluate_nutrient_rotation_impact("Wheat", crop)
    assert rating == "Favorable"
    assert "nitrogen demand" in explanation
    assert "measured soil test" not in explanation.lower()
    assert score == 15.0


def test_nutrient_estimation_non_legume():
    crop = {"crop_name": "Summer Sesame", "is_legume": False}
    rating, explanation, score = evaluate_nutrient_rotation_impact("Wheat", crop)
    assert rating == "Standard"
    assert score < 15.0


# --------------------------------------------------------------------- G. Recommendation Ranking
def test_recommendation_ranking_returns_top_3():
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
    assert len(res["top_recommendations"]) <= 3
    assert res["top_recommendations"][0]["crop_name"] == "Summer Moong"


def test_recommendation_ranking_no_suitable_crop():
    res = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Wheat",
        harvest_month=4,
        gap_days=30,  # Narrow 30-day gap: no crop fits (min is 45-50 days)
        irrigation_type="Tube well",
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        area_acres=2.0,
    )
    assert res["status"] == "no_suitable_crop"
    assert "No suitable gap crop was found" in res["message"]


# --------------------------------------------------------------------- H. API Surface Tests
def test_api_recommendation_success(client):
    payload = {
        "state_name": "Uttar Pradesh",
        "district_name": "Ghaziabad",
        "previous_crop": "Wheat",
        "harvest_date": "2026-04-25",
        "next_crop": "Paddy",
        "next_sowing_date": "2026-07-02",
        "irrigation_type": "Tube well",
        "area_acres": 2.0,
    }
    response = client.post("/api/v1/gap-crop/recommend", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["data"]["status"] == "success"
    assert body["data"]["calculated_gap_days"] == 68
    assert len(body["data"]["top_recommendations"]) > 0
    assert body["meta"]["source"]


def test_api_recommendation_invalid_dates_rejected(client):
    payload = {
        "state_name": "Uttar Pradesh",
        "district_name": "Ghaziabad",
        "previous_crop": "Wheat",
        "harvest_date": "2026-07-02",
        "next_crop": "Paddy",
        "next_sowing_date": "2026-04-25",  # Harvest after sowing!
        "irrigation_type": "Tube well",
        "area_acres": 2.0,
    }
    response = client.post("/api/v1/gap-crop/recommend", json=payload)
    assert response.status_code == 400
    body = response.json()
    assert body["error"]["code"] == "INVALID_DATE_RANGE"


def test_api_recommendation_no_suitable_crop_response(client):
    payload = {
        "state_name": "Uttar Pradesh",
        "district_name": "Ghaziabad",
        "previous_crop": "Wheat",
        "harvest_date": "2026-04-25",
        "next_crop": "Paddy",
        "next_sowing_date": "2026-05-15",  # 20-day gap: no seed crop fits
        "irrigation_type": "Tube well",
        "area_acres": 2.0,
    }
    response = client.post("/api/v1/gap-crop/recommend", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["data"]["status"] == "no_suitable_crop"
    assert body["data"]["gap_days"] == 20
