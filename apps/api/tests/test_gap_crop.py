"""Unit and API tests for India-Wide Gap Crop Recommendation Engine (Phase 1B Verification)."""

from datetime import date
import pytest
from app.errors import AppError
from app.modules.gap_crop.schemas import GapCropRecommendRequest
from app.modules.gap_crop.seed_data import SEED_CROP_CATALOG, SEED_SOURCES, SEED_REGIONAL_CALENDAR
from app.modules.gap_crop.service import generate_gap_crop_recommendation
from app.modules.gap_crop.services.crop_calendar_service import evaluate_regional_suitability
from app.modules.gap_crop.services.crop_compatibility_service import evaluate_crop_compatibility
from app.modules.gap_crop.services.duration_filter import evaluate_duration_eligibility
from app.modules.gap_crop.services.gap_calc import calculate_gap_days
from app.modules.gap_crop.services.irrigation_filter import evaluate_irrigation_suitability
from app.modules.gap_crop.services.nutrient_estimator import evaluate_nutrient_rotation_impact
from app.modules.gap_crop.services.recommendation_ranker import rank_and_score_candidate_crops


# --------------------------------------------------------------------- A. Phase 1A.5 Verification & Provenance Tests
def test_source_provenance_registry_tiers():
    """Verify Phase 1A.5 source registry contains valid ICAR, SAU, and State Govt tiers."""
    source_ids = [s["id"] for s in SEED_SOURCES]
    assert "src_icar_iipr" in source_ids
    assert "src_pau_ludhiana" in source_ids
    assert "src_up_agri" in source_ids
    assert "src_tnau" in source_ids

    icar_source = next(s for s in SEED_SOURCES if s["id"] == "src_icar_iipr")
    assert icar_source["tier"] == "TIER_1_ICAR"
    assert icar_source["verification_status"] == "VERIFIED"


def test_verification_status_classification():
    """Verify records are explicitly classified into VERIFIED, PENDING_VERIFICATION, or DEVELOPMENT_DEMO."""
    valid_statuses = {"VERIFIED", "PENDING_VERIFICATION", "DEVELOPMENT_DEMO"}
    for source in SEED_SOURCES:
        assert source["verification_status"] in valid_statuses

    for crop in SEED_CROP_CATALOG:
        assert crop.get("verification_status") in valid_statuses

    for calendar in SEED_REGIONAL_CALENDAR:
        assert calendar["verification_status"] in valid_statuses


def test_location_scope_preservation():
    """Verify regional crop calendar records preserve spatial scopes without cross-state borrowing."""
    valid_scopes = {"DISTRICT", "AGRO_CLIMATIC_ZONE", "STATE", "NATIONAL", "DEVELOPMENT_DEMO"}
    for calendar in SEED_REGIONAL_CALENDAR:
        assert calendar["source_scope"] in valid_scopes

    up_entry = next(c for c in SEED_REGIONAL_CALENDAR if c["state_name"] == "Uttar Pradesh" and c["district_name"] == "Ghaziabad")
    assert up_entry["source_scope"] == "DISTRICT"


def test_demo_records_not_claimed_as_verified_icar():
    """Verify development/demo sources are never reported with TIER_1_ICAR tier or fake document IDs."""
    demo_source = next(s for s in SEED_SOURCES if s["id"] == "src_demo_fallback")
    assert demo_source["tier"] == "DEVELOPMENT_DEMO"
    assert demo_source["verification_status"] == "DEVELOPMENT_DEMO"
    assert demo_source["url"] is None


# --------------------------------------------------------------------- B. Gap Calculation Verification
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


# --------------------------------------------------------------------- C. Duration Filtering Boundaries
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


# --------------------------------------------------------------------- D. Crop Compatibility
def test_compatibility_wheat_to_summer_moong():
    status, notes, score = evaluate_crop_compatibility("Wheat", "Summer Moong")
    assert status == "Compatible"
    assert score == 20.0


# --------------------------------------------------------------------- E. Irrigation Filtering
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


# --------------------------------------------------------------------- F. Regional Location Precedence & Anti-Borrowing
def test_location_precedence_district_match():
    status, notes, score, meta = evaluate_regional_suitability("Summer Moong", "Punjab", "Ludhiana", 4)
    assert status == "High"
    assert meta["resolution_level"] == "District Official Data"
    assert "PAU" in meta["source_provenance"]


def test_location_precedence_unmapped_district_no_borrowing():
    status, notes, score, meta = evaluate_regional_suitability("Summer Moong", "Kerala", "Wayanad", 4)
    assert status == "Data Unavailable"
    assert meta["resolution_level"] == "Data Unavailable (No Borrowing)"


# --------------------------------------------------------------------- G. Nutrient / Rotation
def test_nutrient_estimation_legume_after_cereal():
    crop = {"crop_name": "Summer Moong", "is_legume": True}
    rating, explanation, score = evaluate_nutrient_rotation_impact("Wheat", crop)
    assert rating == "Favorable"
    assert "nitrogen demand" in explanation
    assert "measured soil test" not in explanation.lower()


# --------------------------------------------------------------------- H. Recommendation Scenarios & Determinism
def test_scenario_1_uttar_pradesh_ghaziabad():
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
    top1 = res["top_recommendations"][0]
    assert top1["crop_name"] == "Summer Moong"
    assert "ICAR-IIPR" in top1["source_provenance"] or "UP Agri" in top1["source_provenance"]


def test_scenario_2_punjab_ludhiana():
    res = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Wheat",
        harvest_month=4,
        gap_days=66,
        irrigation_type="Tube well",
        state_name="Punjab",
        district_name="Ludhiana",
        area_acres=3.0,
    )
    assert res["status"] == "success"
    crop_names = [c["crop_name"] for c in res["top_recommendations"]]
    assert "Summer Moong" in crop_names or "Cowpea (Lobia)" in crop_names
    top1 = res["top_recommendations"][0]
    assert len(top1["source_provenance"]) > 0


def test_scenario_3_tamil_nadu_thanjavur():
    res = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Paddy",
        harvest_month=2,
        gap_days=60,
        irrigation_type="Canal",
        state_name="Tamil Nadu",
        district_name="Thanjavur",
        area_acres=2.5,
    )
    assert res["status"] == "success"
    crop_names = [c["crop_name"] for c in res["top_recommendations"]]
    assert "Cowpea (Lobia)" in crop_names


def test_recommendation_determinism_multiple_runs():
    """Verify recommendation scoring is 100% deterministic across multiple executions."""
    run1 = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Wheat",
        harvest_month=4,
        gap_days=68,
        irrigation_type="Tube well",
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        area_acres=2.0,
    )
    run2 = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Wheat",
        harvest_month=4,
        gap_days=68,
        irrigation_type="Tube well",
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        area_acres=2.0,
    )
    assert run1["top_recommendations"][0]["score"] == run2["top_recommendations"][0]["score"]
    assert run1["top_recommendations"][0]["crop_name"] == run2["top_recommendations"][0]["crop_name"]


def test_recommendation_ranking_no_suitable_crop():
    res = rank_and_score_candidate_crops(
        candidates=SEED_CROP_CATALOG,
        previous_crop="Wheat",
        harvest_month=4,
        gap_days=20,  # 20-day gap: no crop fits
        irrigation_type="Tube well",
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        area_acres=2.0,
    )
    assert res["status"] == "no_suitable_crop"
    assert "No suitable gap crop was found" in res["message"]


# --------------------------------------------------------------------- I. API Surface Tests
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


def test_all_india_36_states_district_zone_mapping_completeness():
    """Verify that SEED_DISTRICT_ZONE_MAP covers all 36 Indian States/UTs."""
    from app.modules.gap_crop.seed_data import SEED_DISTRICT_ZONE_MAP
    
    represented_states = set(k[0] for k in SEED_DISTRICT_ZONE_MAP.keys())
    assert len(represented_states) >= 36, f"Expected 36 states/UTs mapped, got {len(represented_states)}"
    
    # Check sample states from all corners of India
    assert "Uttar Pradesh" in represented_states
    assert "Punjab" in represented_states
    assert "Tamil Nadu" in represented_states
    assert "Kerala" in represented_states
    assert "Gujarat" in represented_states
    assert "Assam" in represented_states
    assert "Jammu and Kashmir" in represented_states
    assert "Ladakh" in represented_states
    assert "Andaman and Nicobar Islands" in represented_states


def test_multilingual_recommendation_logic_independence(client):
    """Verify that recommendation calculation produces 100% identical scores regardless of UI language requested."""
    payload = {
        "state_name": "Uttar Pradesh",
        "district_name": "Ghaziabad",
        "previous_crop": "Wheat",
        "harvest_date": "2026-04-25",
        "next_crop": "Paddy",
        "next_sowing_date": "2026-07-02",
        "irrigation_type": "Tube well",
        "area_acres": 2.0
    }
    
    # Request in Hindi
    res_hi = client.post("/api/v1/gap-crop/recommend", json=payload, headers={"Accept-Language": "hi"})
    assert res_hi.status_code == 200
    data_hi = res_hi.json()["data"]
    
    # Request in Punjabi
    res_pa = client.post("/api/v1/gap-crop/recommend", json=payload, headers={"Accept-Language": "pa"})
    assert res_pa.status_code == 200
    data_pa = res_pa.json()["data"]
    
    # Request in English
    res_en = client.post("/api/v1/gap-crop/recommend", json=payload, headers={"Accept-Language": "en"})
    assert res_en.status_code == 200
    data_en = res_en.json()["data"]
    
    # Math & Scores must be 100% identical regardless of language
    assert data_hi["calculated_gap_days"] == data_pa["calculated_gap_days"] == data_en["calculated_gap_days"]
    assert len(data_hi["top_recommendations"]) == len(data_pa["top_recommendations"]) == len(data_en["top_recommendations"])
    assert data_hi["top_recommendations"][0]["score"] == data_pa["top_recommendations"][0]["score"] == data_en["top_recommendations"][0]["score"]
