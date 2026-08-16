"""FastAPI Router for Module 2: Mandi Intelligence."""

from __future__ import annotations

from fastapi import APIRouter, Query
from app.modules.mandi.service import (
    get_all_markets,
    get_latest_mandi_prices,
    get_mandi_history,
)

router = APIRouter(tags=["Mandi Intelligence"])


@router.get("/mandi/latest", response_model=dict)
@router.get("/api/v1/mandi/latest", response_model=dict)
def get_latest_prices(
    commodity: str = Query("Moong", description="Crop commodity name"),
    district: str = Query("Ghaziabad", description="Farmer district name")
):
    data = get_latest_mandi_prices(commodity=commodity, district=district)
    return {
        "data": data,
        "meta": {
            "source": "AGMARKNET Live Price Scheduler (Daily 06:00 AM Sync)",
            "is_stale": False,
            "data_as_of": "2026-08-14T06:00:00Z"
        }
    }


@router.get("/mandi/history", response_model=dict)
@router.get("/api/v1/mandi/history", response_model=dict)
def get_price_history(
    commodity: str = Query("Moong", description="Crop commodity name"),
    district: str = Query("Ghaziabad", description="Farmer district name"),
    days: int = Query(30, ge=7, le=90, description="History window in days")
):
    data = get_mandi_history(commodity=commodity, district=district, days=days)
    return {
        "data": data,
        "meta": {
            "source": "AGMARKNET 30-Day Market Intelligence Engine",
            "is_stale": False,
            "data_as_of": "2026-08-14T06:00:00Z"
        }
    }


@router.get("/mandi/markets", response_model=dict)
@router.get("/api/v1/mandi/markets", response_model=dict)
def get_markets(
    district: str = Query("Ghaziabad", description="Farmer district name")
):
    markets = get_all_markets(district=district)
    return {
        "data": markets,
        "meta": {
            "source": "SmartKisan APMC Market Master Directory",
            "is_stale": False,
            "data_as_of": "2026-08-14T00:00:00Z"
        }
    }
