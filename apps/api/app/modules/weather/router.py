"""FastAPI Router for Module 3: Weather Advisory."""

from __future__ import annotations

from fastapi import APIRouter, Query
from app.modules.weather.service import (
    evaluate_weather_advisory,
    get_current_weather,
    get_weather_forecast,
)

router = APIRouter(tags=["Weather Advisory"])


@router.get("/weather/current", response_model=dict)
@router.get("/api/v1/weather/current", response_model=dict)
def current_weather(
    lat: float = Query(28.66, description="Latitude"),
    lon: float = Query(77.43, description="Longitude"),
    district: str = Query("Ghaziabad", description="District name"),
    state: str = Query("Uttar Pradesh", description="State name")
):
    data = get_current_weather(lat=lat, lon=lon, district=district, state=state)
    return {
        "data": data,
        "meta": {
            "source": "Open-Meteo Weather API & Reverse Geocoding",
            "is_stale": False,
            "data_as_of": "2026-08-14T19:00:00Z"
        }
    }


@router.get("/weather/forecast", response_model=dict)
@router.get("/api/v1/weather/forecast", response_model=dict)
def weather_forecast(
    lat: float = Query(28.66, description="Latitude"),
    lon: float = Query(77.43, description="Longitude"),
    district: str = Query("Ghaziabad", description="District name")
):
    data = get_weather_forecast(lat=lat, lon=lon, district=district)
    return {
        "data": data,
        "meta": {
            "source": "Open-Meteo 7-Day High Resolution Forecast",
            "is_stale": False,
            "data_as_of": "2026-08-14T19:00:00Z"
        }
    }


@router.get("/weather/advisory", response_model=dict)
@router.get("/api/v1/weather/advisory", response_model=dict)
def weather_advisory(
    lat: float = Query(28.66, description="Latitude"),
    lon: float = Query(77.43, description="Longitude"),
    district: str = Query("Ghaziabad", description="District name")
):
    data = evaluate_weather_advisory(lat=lat, lon=lon, district=district)
    return {
        "data": data,
        "meta": {
            "source": "SmartKisan Rule-Based Weather Advisory Engine",
            "is_stale": False,
            "data_as_of": "2026-08-14T19:00:00Z"
        }
    }
