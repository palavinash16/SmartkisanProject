"""Integration test suite for Phase 2D Weather Intelligence & Crop Recommendation Integration."""

from datetime import date, timedelta
import pytest
import respx
from httpx import Response

from app.modules.gap_crop.schemas import GapCropRecommendRequest
from app.modules.gap_crop.service import evaluate_forecast_weather_risk, get_gap_crop_recommendations
from app.modules.weather.service import _MEMORY_WEATHER_CACHE

@pytest.fixture(autouse=True)
def clear_weather_cache():
    _MEMORY_WEATHER_CACHE.clear()
    yield
    _MEMORY_WEATHER_CACHE.clear()

MOCK_OPEN_METEO_RESPONSE = {
    "latitude": 28.66,
    "longitude": 77.43,
    "current": {
        "temperature_2m": 34.0,
        "relative_humidity_2m": 65.0,
        "apparent_temperature": 35.0,
        "precipitation": 0.0,
        "rain": 0.0,
        "weather_code": 2,
        "wind_speed_10m": 11.0,
        "wind_direction_10m": 180.0,
    },
    "daily": {
        "time": ["2026-08-21", "2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27"],
        "temperature_2m_max": [35.0, 34.0, 36.0, 37.0, 35.5, 33.0, 32.0],
        "temperature_2m_min": [26.0, 25.5, 27.0, 27.5, 26.0, 24.5, 24.0],
        "precipitation_sum": [5.0, 0.0, 0.0, 0.0, 12.0, 35.0, 8.0],
        "rain_sum": [5.0, 0.0, 0.0, 0.0, 12.0, 35.0, 8.0],
        "precipitation_probability_max": [20.0, 10.0, 5.0, 5.0, 50.0, 90.0, 40.0],
        "weather_code": [2, 2, 0, 0, 61, 63, 3],
        "wind_speed_10m_max": [11.0, 12.0, 10.0, 9.0, 14.0, 18.0, 11.0],
    },
}


@pytest.mark.asyncio
async def test_pulse_heavy_rain_sowing_risk():
    """1. Test Pulse + >= 64.5mm rain + valid sowing date yields HIGH risk."""
    sowing_dt = date.today() + timedelta(days=1)
    weather_data = {
        "forecast_7d": [{"rain_mm": 5.0}, {"rain_mm": 70.0}],
        "meta": {"source": "Open-Meteo", "is_stale": False, "location_resolution": "GPS / Field Coordinates"}
    }
    w_info = evaluate_forecast_weather_risk("Summer Moong", sowing_dt, weather_data)
    assert w_info["weather_risk"] == "HIGH"
    assert w_info["weather_reason_code"] == "HEAVY_RAIN_SOWING_RISK"


@pytest.mark.asyncio
async def test_non_pulse_heavy_rain_does_not_trigger_pulse_high_risk():
    """2. Test non-pulse crop with heavy rain does NOT trigger pulse-specific HIGH risk."""
    sowing_dt = date.today() + timedelta(days=1)
    weather_data = {
        "forecast_7d": [{"rain_mm": 5.0}, {"rain_mm": 70.0}],
        "meta": {"source": "Open-Meteo", "is_stale": False, "location_resolution": "GPS / Field Coordinates"}
    }
    w_info = evaluate_forecast_weather_risk("Mustard", sowing_dt, weather_data)
    assert w_info["weather_risk"] == "MODERATE"
    assert w_info["weather_reason_code"] == "MODERATE_RAIN_SOWING_WINDOW"


@pytest.mark.asyncio
async def test_low_rain_yields_no_significant_risk_code():
    """3. Test rain < 15.6mm yields LOW risk + NO_SIGNIFICANT_WEATHER_RISK_DETECTED."""
    sowing_dt = date.today() + timedelta(days=1)
    weather_data = {
        "forecast_7d": [{"rain_mm": 2.0}, {"rain_mm": 4.0}],
        "meta": {"source": "Open-Meteo", "is_stale": False, "location_resolution": "GPS / Field Coordinates"}
    }
    w_info = evaluate_forecast_weather_risk("Summer Moong", sowing_dt, weather_data)
    assert w_info["weather_risk"] == "LOW"
    assert w_info["weather_reason_code"] == "NO_SIGNIFICANT_WEATHER_RISK_DETECTED"


@pytest.mark.asyncio
async def test_sowing_date_beyond_horizon_returns_unknown():
    """4. Test sowing date > 7 days in future safely returns weather_risk = UNKNOWN."""
    far_future_sowing = date.today() + timedelta(days=20)
    weather_data = {
        "forecast_7d": [{"rain_mm": 5.0} for _ in range(7)],
        "meta": {"source": "Open-Meteo", "is_stale": False, "location_resolution": "GPS / Field Coordinates"}
    }
    w_info = evaluate_forecast_weather_risk("Summer Moong", far_future_sowing, weather_data)
    assert w_info["weather_risk"] == "UNKNOWN"
    assert w_info["weather_reason_code"] == "SOWING_DATE_BEYOND_FORECAST_HORIZON"


@pytest.mark.asyncio
async def test_past_sowing_date_returns_unknown():
    """5. Test past sowing date returns UNKNOWN."""
    past_sowing = date.today() - timedelta(days=5)
    weather_data = {
        "forecast_7d": [{"rain_mm": 5.0} for _ in range(7)],
        "meta": {"source": "Open-Meteo", "is_stale": False, "location_resolution": "GPS / Field Coordinates"}
    }
    w_info = evaluate_forecast_weather_risk("Summer Moong", past_sowing, weather_data)
    assert w_info["weather_risk"] == "UNKNOWN"
    assert w_info["weather_reason_code"] == "SOWING_DATE_BEYOND_FORECAST_HORIZON"


@pytest.mark.asyncio
async def test_missing_weather_data_preserves_safe_recommendations():
    """6. Test recommendations succeed safely when weather API is unavailable."""
    req = GapCropRecommendRequest(
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        previous_crop="Wheat",
        harvest_date=date(2026, 4, 25),
        next_crop="Paddy",
        next_sowing_date=date(2026, 7, 2),
        irrigation_type="Tube well",
        area_acres=2.0,
    )

    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(500)
        )
        res = await get_gap_crop_recommendations(req)

        assert res["status"] == "success"
        assert len(res["top_recommendations"]) > 0
        top = res["top_recommendations"][0]
        assert top["weather_risk"] == "UNKNOWN"
        assert top["weather_reason_code"] == "SOWING_DATE_BEYOND_FORECAST_HORIZON"


@pytest.mark.asyncio
async def test_weather_does_not_override_ineligible_phase1_crop():
    """7 & 8. Test Phase 1 eligibility happens first and weather does NOT rescue ineligible crop."""
    req = GapCropRecommendRequest(
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        previous_crop="Wheat",
        harvest_date=date(2026, 4, 25),
        next_crop="Paddy",
        next_sowing_date=date(2026, 5, 15),
        irrigation_type="Tube well",
        area_acres=2.0,
    )

    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=MOCK_OPEN_METEO_RESPONSE)
        )
        res = await get_gap_crop_recommendations(req)

        assert res["status"] == "no_suitable_crop"
        assert len(res["recommendations"]) == 0
