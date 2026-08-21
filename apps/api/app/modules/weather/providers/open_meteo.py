"""Open-Meteo Weather Provider Implementation for SmartKisan."""

from __future__ import annotations

import logging
from typing import Any, Dict
import httpx

from app.config import settings
from app.modules.weather.providers.base import BaseWeatherProvider

logger = logging.getLogger(__name__)

WMO_WEATHER_CODES: Dict[int, str] = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    62: "Moderate Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Light Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail",
}


class OpenMeteoProvider(BaseWeatherProvider):
    """Live HTTP client for Open-Meteo Weather API."""

    def __init__(self, base_url: str | None = None, timeout_seconds: float = 5.0):
        self.base_url = base_url or settings.openmeteo_forecast_url
        self.timeout_seconds = timeout_seconds

    @property
    def provider_name(self) -> str:
        return "Open-Meteo"

    async def fetch_weather_and_forecast(self, lat: float, lon: float) -> Dict[str, Any]:
        """Executes live HTTP GET request to Open-Meteo API and normalizes data."""
        params = {
            "latitude": lat,
            "longitude": lon,
            "temperature_unit": "celsius",
            "wind_speed_unit": "kmh",
            "precipitation_unit": "mm",
            "timezone": "Asia/Kolkata",
            "forecast_days": 7,
            "current": ",".join([
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "rain",
                "weather_code",
                "wind_speed_10m",
                "wind_direction_10m",
                "wind_gusts_10m",
            ]),
            "daily": ",".join([
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "rain_sum",
                "precipitation_probability_max",
                "weather_code",
                "wind_speed_10m_max",
            ]),
        }

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.get(self.base_url, params=params)
            response.raise_for_status()
            raw_data = response.json()

        return self._normalize_openmeteo_response(raw_data, lat, lon)

    def _normalize_openmeteo_response(self, raw: Dict[str, Any], lat: float, lon: float) -> Dict[str, Any]:
        current_raw = raw.get("current", {})
        daily_raw = raw.get("daily", {})

        w_code = current_raw.get("weather_code", 0)
        condition_str = WMO_WEATHER_CODES.get(w_code, "Partly Cloudy")

        temp = float(current_raw.get("temperature_2m", 0.0))
        humidity = float(current_raw.get("relative_humidity_2m", 0.0))
        apparent_temp = float(current_raw.get("apparent_temperature", temp))
        rain_mm = float(current_raw.get("rain", current_raw.get("precipitation", 0.0)))
        wind_kmh = float(current_raw.get("wind_speed_10m", 0.0))
        wind_dir = float(current_raw.get("wind_direction_10m", 0.0))

        dates = daily_raw.get("time", [])
        t_max = daily_raw.get("temperature_2m_max", [])
        t_min = daily_raw.get("temperature_2m_min", [])
        rain_sums = daily_raw.get("rain_sum", daily_raw.get("precipitation_sum", []))
        pop_max = daily_raw.get("precipitation_probability_max", [])
        daily_codes = daily_raw.get("weather_code", [])
        w_max = daily_raw.get("wind_speed_10m_max", [])

        forecast_7d = []
        days_names = ["Today", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]

        for i in range(min(7, len(dates))):
            d_code = daily_codes[i] if i < len(daily_codes) else 0
            forecast_7d.append({
                "day": days_names[i] if i < len(days_names) else f"Day {i+1}",
                "date": dates[i] if i < len(dates) else "",
                "temp_max": float(t_max[i]) if i < len(t_max) else temp,
                "temp_min": float(t_min[i]) if i < len(t_min) else temp - 5.0,
                "rain_mm": float(rain_sums[i]) if i < len(rain_sums) else 0.0,
                "humidity_pct": humidity,
                "wind_kmh": float(w_max[i]) if i < len(w_max) else wind_kmh,
                "precipitation_probability_max": float(pop_max[i]) if (pop_max and i < len(pop_max) and pop_max[i] is not None) else 0.0,
                "weather_code": d_code,
                "condition": WMO_WEATHER_CODES.get(d_code, "Partly Cloudy"),
            })

        return {
            "current": {
                "temperature_c": temp,
                "humidity_pct": humidity,
                "apparent_temperature_c": apparent_temp,
                "rainfall_mm": rain_mm,
                "wind_kmh": wind_kmh,
                "wind_direction_deg": wind_dir,
                "weather_code": w_code,
                "condition": condition_str,
                "is_favorable_for_sowing": rain_mm < 50.0 and temp < 40.0,
            },
            "forecast_7d": forecast_7d,
            "provider": self.provider_name,
        }
