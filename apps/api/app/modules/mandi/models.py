"""SQLAlchemy models for Mandi Intelligence module (mandi_prices, market_master)."""

from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, Timestamped, UUIDPrimaryKey


class MarketMaster(Base, UUIDPrimaryKey, Timestamped):
    """Database table: market_master"""

    __tablename__ = "market_master"

    market_name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    district: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(120), nullable=False, default="Uttar Pradesh")
    distance_km: Mapped[float] = mapped_column(Float, nullable=False, default=15.0)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)


class MandiPrice(Base, UUIDPrimaryKey, Timestamped):
    """Database table: mandi_prices"""

    __tablename__ = "mandi_prices"

    market_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    district: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(120), nullable=False, default="Uttar Pradesh")
    commodity: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    modal_price: Mapped[int] = mapped_column(Integer, nullable=False)
    min_price: Mapped[int] = mapped_column(Integer, nullable=False)
    max_price: Mapped[int] = mapped_column(Integer, nullable=False)
    price_date: Mapped[date] = mapped_column(Date, nullable=False)
    price_trend_7d: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    price_trend_15d: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    price_trend_30d: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
