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
    rainfall_mm: float
    humidity_pct: float
    wind_kmh: float
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
    condition: str


class WeatherForecastResponse(BaseModel):
    location: str
    forecast_7d: list[ForecastDayItem]


class AdvisoryRuleResult(BaseModel):
    rule_code: str
    triggered: bool
    action_type: str
    message_en: str
    message_hi: str


class WeatherAdvisoryResponse(BaseModel):
    current_temperature: float
    rainfall_mm: float
    wind_kmh: float
    humidity_pct: float
    summary_advisory_en: str
    summary_advisory_hi: str
    active_rules: list[AdvisoryRuleResult]
