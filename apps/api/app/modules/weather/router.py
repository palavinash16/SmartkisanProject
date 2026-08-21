"""FastAPI Router for Module 3: Weather Advisory."""

from __future__ import annotations

from fastapi import APIRouter, Query
from app.modules.weather.service import (
    evaluate_weather_advisory,
    get_current_weather,
    get_normalized_weather_data,
    get_weather_forecast,
)

router = APIRouter(tags=["Weather Advisory"])


@router.get("/weather/current", response_model=dict)
@router.get("/api/v1/weather/current", response_model=dict)
async def current_weather(
    lat: float = Query(28.66, description="Latitude"),
    lon: float = Query(77.43, description="Longitude"),
    district: str = Query("Ghaziabad", description="District name"),
    state: str = Query("Uttar Pradesh", description="State name"),
):
    normalized = await get_normalized_weather_data(lat=lat, lon=lon, district=district, state=state)
    return {
        "data": normalized["current"],
        "meta": normalized["meta"],
    }


@router.get("/weather/forecast", response_model=dict)
@router.get("/api/v1/weather/forecast", response_model=dict)
async def weather_forecast(
    lat: float = Query(28.66, description="Latitude"),
    lon: float = Query(77.43, description="Longitude"),
    district: str = Query("Ghaziabad", description="District name"),
):
    normalized = await get_normalized_weather_data(lat=lat, lon=lon, district=district)
    return {
        "data": {
            "location": f"{district}, {normalized['current']['state']} ({lat:.2f}, {lon:.2f})",
            "forecast_7d": normalized["forecast_7d"],
        },
        "meta": normalized["meta"],
    }


@router.get("/weather/advisory", response_model=dict)
@router.get("/api/v1/weather/advisory", response_model=dict)
async def weather_advisory(
    lat: float = Query(28.66, description="Latitude"),
    lon: float = Query(77.43, description="Longitude"),
    district: str = Query("Ghaziabad", description="District name"),
    irrigation_source: str | None = Query(None, description="Farm irrigation source (e.g. Tube well)"),
    planned_activity: str | None = Query(None, description="Planned activity (e.g. SOWING)"),
    target_crop: str | None = Query(None, description="Target crop (e.g. Moong)"),
    planned_sowing_date: str | None = Query(None, description="Planned sowing date"),
):
    data = await evaluate_weather_advisory(
        lat=lat,
        lon=lon,
        district=district,
        irrigation_source=irrigation_source,
        planned_activity=planned_activity,
        target_crop=target_crop,
        planned_sowing_date=planned_sowing_date,
    )
    meta = data.pop("meta") if "meta" in data else {
        "source": "Open-Meteo",
        "is_stale": False,
        "location_resolution": "GPS / Field Coordinates",
    }
    return {
        "data": data,
        "meta": meta,
    }
