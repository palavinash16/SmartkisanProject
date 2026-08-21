"""Unit test suite for Phase 2C Weather Advisory Module."""

import pytest
import respx
from httpx import Response
from app.modules.weather.providers.open_meteo import OpenMeteoProvider
from app.modules.weather.service import _MEMORY_WEATHER_CACHE, evaluate_weather_advisory, get_normalized_weather_data

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
        "precipitation_sum": [20.0, 5.0, 0.0, 0.0, 12.0, 35.0, 8.0],
        "rain_sum": [20.0, 5.0, 0.0, 0.0, 12.0, 35.0, 8.0],
        "precipitation_probability_max": [80.0, 30.0, 10.0, 5.0, 50.0, 90.0, 40.0],
        "weather_code": [61, 2, 0, 0, 61, 63, 3],
        "wind_speed_10m_max": [11.0, 12.0, 10.0, 9.0, 14.0, 18.0, 11.0],
    },
}


@pytest.mark.asyncio
async def test_openmeteo_provider_fetch_success():
    """1. Test OpenMeteoProvider HTTP response normalizer."""
    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=MOCK_OPEN_METEO_RESPONSE)
        )
        provider = OpenMeteoProvider()
        data = await provider.fetch_weather_and_forecast(28.66, 77.43)

        assert data["provider"] == "Open-Meteo"
        assert data["current"]["temperature_c"] == 34.0
        assert len(data["forecast_7d"]) == 7


@pytest.mark.asyncio
async def test_irrigation_delay_rule_triggers_on_irrigated_farm():
    """2. Test ADVISORY_IRRIGATION_DELAY triggers for irrigated farm when 24h rain >= 15.6mm."""
    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=MOCK_OPEN_METEO_RESPONSE)
        )
        res = await evaluate_weather_advisory(
            28.66, 77.43, district="Ghaziabad", irrigation_source="Tube well"
        )

        assert len(res["active_rules"]) == 1
        rule = res["active_rules"][0]
        assert rule["rule_code"] == "ADVISORY_IRRIGATION_DELAY"
        assert rule["action"] == "POSTPONE_IRRIGATION"
        assert rule["severity"] == "MEDIUM"
        assert rule["agricultural_source"] == "IMD GKMS Agromet Advisory Service"
        assert rule["weather_source"] == "Open-Meteo"
        assert "Official IMD Advice" not in rule["agricultural_source"]


@pytest.mark.asyncio
async def test_irrigation_delay_rule_does_not_trigger_on_rainfed_farm():
    """3. Test ADVISORY_IRRIGATION_DELAY is suppressed on rainfed farm."""
    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=MOCK_OPEN_METEO_RESPONSE)
        )
        res = await evaluate_weather_advisory(
            28.66, 77.43, district="Ghaziabad", irrigation_source="Rainfed"
        )

        assert len(res["active_rules"]) == 0
        assert res["summary_advisory_code"] == "NO_RELIABLE_ADVISORY"


@pytest.mark.asyncio
async def test_irrigation_delay_rule_suppressed_when_rain_below_15_6mm():
    """4. Test ADVISORY_IRRIGATION_DELAY does not trigger when rain < 15.6mm."""
    low_rain_mock = {
        "latitude": 28.66,
        "longitude": 77.43,
        "current": dict(MOCK_OPEN_METEO_RESPONSE["current"]),
        "daily": dict(MOCK_OPEN_METEO_RESPONSE["daily"]),
    }
    low_rain_mock["daily"]["precipitation_sum"] = [5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    low_rain_mock["daily"]["rain_sum"] = [5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=low_rain_mock)
        )
        res = await evaluate_weather_advisory(
            28.66, 77.43, district="Ghaziabad", irrigation_source="Tube well"
        )

        assert len(res["active_rules"]) == 0
        assert res["summary_advisory_code"] == "NO_RELIABLE_ADVISORY"


@pytest.mark.asyncio
async def test_sowing_safety_rule_triggers_for_pulse_sowing_on_heavy_rain():
    """5. Test ADVISORY_SOWING_SAFETY triggers for pulse sowing when rain >= 64.5mm."""
    heavy_rain_mock = {
        "latitude": 28.66,
        "longitude": 77.43,
        "current": dict(MOCK_OPEN_METEO_RESPONSE["current"]),
        "daily": dict(MOCK_OPEN_METEO_RESPONSE["daily"]),
    }
    heavy_rain_mock["daily"]["precipitation_sum"] = [70.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    heavy_rain_mock["daily"]["rain_sum"] = [70.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0]

    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=heavy_rain_mock)
        )
        res = await evaluate_weather_advisory(
            28.66,
            77.43,
            district="Ghaziabad",
            planned_activity="SOWING",
            target_crop="Summer Moong",
            planned_sowing_date="2026-08-22",
        )

        assert len(res["active_rules"]) >= 1
        sowing_rule = [r for r in res["active_rules"] if r["rule_code"] == "ADVISORY_SOWING_SAFETY"][0]
        assert sowing_rule["action"] == "DELAY_SOWING"
        assert sowing_rule["severity"] == "HIGH"
        assert sowing_rule["agricultural_source"] == "ICAR-CRIDA Pulse Contingency Guidance"


@pytest.mark.asyncio
async def test_sowing_safety_rule_suppressed_for_non_pulse_crop():
    """6. Test ADVISORY_SOWING_SAFETY does not trigger for non-pulse crop (e.g. Wheat)."""
    heavy_rain_mock = {
        "latitude": 28.66,
        "longitude": 77.43,
        "current": dict(MOCK_OPEN_METEO_RESPONSE["current"]),
        "daily": dict(MOCK_OPEN_METEO_RESPONSE["daily"]),
    }
    heavy_rain_mock["daily"]["precipitation_sum"] = [70.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    heavy_rain_mock["daily"]["rain_sum"] = [70.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0]

    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=heavy_rain_mock)
        )
        res = await evaluate_weather_advisory(
            28.66,
            77.43,
            district="Ghaziabad",
            planned_activity="SOWING",
            target_crop="Wheat",
            planned_sowing_date="2026-08-22",
        )

        sowing_rules = [r for r in res["active_rules"] if r["rule_code"] == "ADVISORY_SOWING_SAFETY"]
        assert len(sowing_rules) == 0


@pytest.mark.asyncio
async def test_sowing_safety_rule_suppressed_when_sowing_date_missing():
    """7. Test ADVISORY_SOWING_SAFETY suppresses when sowing date / activity missing."""
    heavy_rain_mock = {
        "latitude": 28.66,
        "longitude": 77.43,
        "current": dict(MOCK_OPEN_METEO_RESPONSE["current"]),
        "daily": dict(MOCK_OPEN_METEO_RESPONSE["daily"]),
    }
    heavy_rain_mock["daily"]["precipitation_sum"] = [70.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    heavy_rain_mock["daily"]["rain_sum"] = [70.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0]

    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=heavy_rain_mock)
        )
        res = await evaluate_weather_advisory(
            28.66,
            77.43,
            district="Ghaziabad",
            target_crop="Moong",
        )

        sowing_rules = [r for r in res["active_rules"] if r["rule_code"] == "ADVISORY_SOWING_SAFETY"]
        assert len(sowing_rules) == 0


@pytest.mark.asyncio
async def test_language_independent_rule_evaluation():
    """8. Test rule evaluation output is language-independent."""
    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=MOCK_OPEN_METEO_RESPONSE)
        )
        res = await evaluate_weather_advisory(
            28.66, 77.43, district="Ghaziabad", irrigation_source="Tube well"
        )

        assert res["summary_advisory_code"] == "ADVISORY_IRRIGATION_DELAY"
        rule = res["active_rules"][0]
        assert rule["rule_code"] == "ADVISORY_IRRIGATION_DELAY"
        assert rule["action"] == "POSTPONE_IRRIGATION"
        assert rule["weather_source"] == "Open-Meteo"
        assert rule["agricultural_source"] == "IMD GKMS Agromet Advisory Service"
        assert rule["decision_source"] == "SmartKisan Rule Engine"


@pytest.mark.asyncio
async def test_malformed_provider_response_fallback():
    """9. Test fallback when provider returns malformed JSON payload."""
    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json={"invalid_structure": True})
        )
        res = await get_normalized_weather_data(28.66, 77.43, district="Ghaziabad")

        assert res["meta"]["is_stale"] is False
        assert "temperature_c" in res["current"]


@pytest.mark.asyncio
async def test_location_resolution_metadata():
    """10. Test location resolution metadata attribution."""
    with respx.mock:
        respx.get("https://api.open-meteo.com/v1/forecast").mock(
            return_value=Response(200, json=MOCK_OPEN_METEO_RESPONSE)
        )
        res = await get_normalized_weather_data(28.66, 77.43)
        assert res["meta"]["location_resolution"] == "GPS / Field Coordinates"
