"""Pydantic schemas for Weather Advisory module."""

from __future__ import annotations

from pydantic import BaseModel, Field


class WeatherCurrentResponse(BaseModel):
    latitude: float
    longitude: float
    village: str
    district: str
    state: str
    temperature_c: float
    apparent_temperature_c: float = 0.0
    rainfall_mm: float
    humidity_pct: float
    wind_kmh: float
    wind_direction_deg: float = 0.0
    weather_code: int = 0
    condition: str
    is_favorable_for_sowing: bool


class ForecastDayItem(BaseModel):
    day: str
    date: str
    temp_max: float
    temp_min: float
    rain_mm: float
    humidity_pct: float
    wind_kmh: float
    precipitation_probability_max: float = 0.0
    weather_code: int = 0
    condition: str


class WeatherForecastResponse(BaseModel):
    location: str
    forecast_7d: list[ForecastDayItem]


class AdvisoryRuleResult(BaseModel):
    rule_code: str
    action: str = ""
    severity: str = "MEDIUM"
    triggered: bool = False
    action_type: str = ""
    weather_source: str = "Open-Meteo"
    agricultural_source: str = ""
    decision_source: str = "SmartKisan Rule Engine"
    message_en: str
    message_hi: str


class WeatherAdvisoryResponse(BaseModel):
    current_temperature: float
    rainfall_mm: float
    wind_kmh: float
    humidity_pct: float
    summary_advisory_code: str = "NO_RELIABLE_ADVISORY"
    summary_advisory_en: str
    summary_advisory_hi: str
    active_rules: list[AdvisoryRuleResult]


class WeatherMeta(BaseModel):
    source: str = "Open-Meteo"
    is_stale: bool = False
    data_as_of: str | None = None
    cached_at: str | None = None
    location_resolution: str = "GPS / Field Coordinates"
