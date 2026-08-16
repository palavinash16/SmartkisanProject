"""Pydantic schemas for Mandi Intelligence module."""

from __future__ import annotations

from datetime import date
from pydantic import BaseModel, Field


class MandiMarketPriceItem(BaseModel):
    market_name: str
    district: str
    state: str
    distance_km: float
    commodity: str
    modal_price: int
    min_price: int
    max_price: int
    extra_gain_per_qtl: int
    is_best_market: bool
    price_date: date
    price_trend_7d: float
    price_trend_15d: float
    price_trend_30d: float


class MandiLatestResponse(BaseModel):
    commodity: str
    district: str
    best_market_name: str
    best_market_price: int
    local_baseline_price: int
    extra_gain_callout: str
    nearby_markets: list[MandiMarketPriceItem]


class PriceTrendPoint(BaseModel):
    date: str
    modal_price: int


class MandiHistoryResponse(BaseModel):
    commodity: str
    district: str
    trend_7d_pct: float
    trend_15d_pct: float
    trend_30d_pct: float
    historical_points: list[PriceTrendPoint]
