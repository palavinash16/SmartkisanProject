"""SQLAlchemy models for Weather Advisory module (weather_cache, weather_advisories)."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, String, Text, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, Timestamped, UUIDPrimaryKey


class WeatherCache(Base, UUIDPrimaryKey, Timestamped):
    """Database table: weather_cache"""

    __tablename__ = "weather_cache"

    location_key: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    village: Mapped[str | None] = mapped_column(String(120))
    district: Mapped[str | None] = mapped_column(String(120))
    state: Mapped[str | None] = mapped_column(String(120))
    temperature_c: Mapped[float] = mapped_column(Float, nullable=False)
    rainfall_mm: Mapped[float] = mapped_column(Float, nullable=False)
    humidity_pct: Mapped[float] = mapped_column(Float, nullable=False)
    wind_kmh: Mapped[float] = mapped_column(Float, nullable=False)
    forecast_data: Mapped[dict | None] = mapped_column(JSON)
    cached_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class WeatherAdvisory(Base, UUIDPrimaryKey, Timestamped):
    """Database table: weather_advisories"""

    __tablename__ = "weather_advisories"

    rule_code: Mapped[str] = mapped_column(String(48), unique=True, nullable=False)
    condition_expr: Mapped[str] = mapped_column(String(120), nullable=False)
    message_hi: Mapped[str] = mapped_column(Text, nullable=False)
    message_en: Mapped[str] = mapped_column(Text, nullable=False)
    action_type: Mapped[str] = mapped_column(String(32), nullable=False, default="GENERAL")
