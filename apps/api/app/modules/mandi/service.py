"""Service logic for Module 2: Mandi Intelligence."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

MOCK_MANDI_DATABASE: dict[str, list[dict[str, Any]]] = {
    "Moong": [
        {
            "market_name": "Hapur APMC",
            "district": "Hapur",
            "state": "Uttar Pradesh",
            "distance_km": 28.5,
            "modal_price": 6950,
            "min_price": 6700,
            "max_price": 7100,
            "trend_7d": +3.5,
            "trend_15d": +5.2,
            "trend_30d": +8.1,
        },
        {
            "market_name": "Meerut APMC",
            "district": "Meerut",
            "state": "Uttar Pradesh",
            "distance_km": 35.0,
            "modal_price": 6820,
            "min_price": 6600,
            "max_price": 6950,
            "trend_7d": +2.1,
            "trend_15d": +4.0,
            "trend_30d": +6.5,
        },
        {
            "market_name": "Ghaziabad Grain Market",
            "district": "Ghaziabad",
            "state": "Uttar Pradesh",
            "distance_km": 12.0,
            "modal_price": 6700,
            "min_price": 6500,
            "max_price": 6850,
            "trend_7d": +1.0,
            "trend_15d": +2.5,
            "trend_30d": +4.0,
        },
        {
            "market_name": "Bulandshahr APMC",
            "district": "Bulandshahr",
            "state": "Uttar Pradesh",
            "distance_km": 48.0,
            "modal_price": 6880,
            "min_price": 6650,
            "max_price": 7000,
            "trend_7d": +2.8,
            "trend_15d": +4.5,
            "trend_30d": +7.0,
        }
    ],
    "Urad": [
        {
            "market_name": "Hapur APMC",
            "district": "Hapur",
            "state": "Uttar Pradesh",
            "distance_km": 28.5,
            "modal_price": 6820,
            "min_price": 6500,
            "max_price": 7000,
            "trend_7d": +2.0,
            "trend_15d": +3.5,
            "trend_30d": +5.0,
        },
        {
            "market_name": "Ghaziabad Grain Market",
            "district": "Ghaziabad",
            "state": "Uttar Pradesh",
            "distance_km": 12.0,
            "modal_price": 6600,
            "min_price": 6400,
            "max_price": 6750,
            "trend_7d": +0.8,
            "trend_15d": +1.9,
            "trend_30d": +3.2,
        }
    ],
    "Wheat": [
        {
            "market_name": "Hapur APMC",
            "district": "Hapur",
            "state": "Uttar Pradesh",
            "distance_km": 28.5,
            "modal_price": 2420,
            "min_price": 2350,
            "max_price": 2480,
            "trend_7d": +0.5,
            "trend_15d": +1.2,
            "trend_30d": +2.5,
        },
        {
            "market_name": "Ghaziabad Grain Market",
            "district": "Ghaziabad",
            "state": "Uttar Pradesh",
            "distance_km": 12.0,
            "modal_price": 2380,
            "min_price": 2300,
            "max_price": 2420,
            "trend_7d": +0.2,
            "trend_15d": +0.8,
            "trend_30d": +1.8,
        }
    ]
}


def get_latest_mandi_prices(commodity: str = "Moong", district: str = "Ghaziabad"):
    # Normalize commodity name
    norm_comm = "Moong"
    for k in MOCK_MANDI_DATABASE:
        if k.lower() in commodity.lower():
            norm_comm = k
            break

    markets = MOCK_MANDI_DATABASE.get(norm_comm, MOCK_MANDI_DATABASE["Moong"])

    # Sort markets by Highest Modal Price (Step 3: Market Ranking)
    sorted_markets = sorted(markets, key=lambda m: m["modal_price"], reverse=True)

    local_market = next((m for m in sorted_markets if m["district"].lower() == district.lower()), sorted_markets[-1])
    local_baseline_price = local_market["modal_price"]

    best_market = sorted_markets[0]
    extra_gain = best_market["modal_price"] - local_baseline_price

    today = date.today()

    items = []
    for idx, m in enumerate(sorted_markets):
        gain = m["modal_price"] - local_baseline_price
        items.append({
            "market_name": m["market_name"],
            "district": m["district"],
            "state": m["state"],
            "distance_km": m["distance_km"],
            "commodity": norm_comm,
            "modal_price": m["modal_price"],
            "min_price": m["min_price"],
            "max_price": m["max_price"],
            "extra_gain_per_qtl": gain,
            "is_best_market": (idx == 0),
            "price_date": today,
            "price_trend_7d": m["trend_7d"],
            "price_trend_15d": m["trend_15d"],
            "price_trend_30d": m["trend_30d"],
        })

    return {
        "commodity": norm_comm,
        "district": district,
        "best_market_name": best_market["market_name"],
        "best_market_price": best_market["modal_price"],
        "local_baseline_price": local_baseline_price,
        "extra_gain_callout": f"Extra Gain: ₹{extra_gain}/qtl at {best_market['market_name']} compared to local market (₹{local_baseline_price}/qtl)",
        "nearby_markets": items
    }


def get_mandi_history(commodity: str = "Moong", district: str = "Ghaziabad", days: int = 30):
    today = date.today()
    points = []
    base_p = 6950 if "moong" in commodity.lower() else 2400

    for i in range(days, -1, -5):
        dt_str = (today - timedelta(days=i)).isoformat()
        variance = (days - i) * 8
        p = base_p - 240 + variance
        points.append({"date": dt_str, "modal_price": p})

    return {
        "commodity": commodity,
        "district": district,
        "trend_7d_pct": +3.5,
        "trend_15d_pct": +5.2,
        "trend_30d_pct": +8.1,
        "historical_points": points
    }


def get_all_markets(district: str = "Ghaziabad"):
    return [
        {"market_name": "Hapur APMC", "district": "Hapur", "state": "Uttar Pradesh", "distance_km": 28.5, "latitude": 28.73, "longitude": 77.78},
        {"market_name": "Meerut APMC", "district": "Meerut", "state": "Uttar Pradesh", "distance_km": 35.0, "latitude": 28.98, "longitude": 77.70},
        {"market_name": "Ghaziabad Grain Market", "district": "Ghaziabad", "state": "Uttar Pradesh", "distance_km": 12.0, "latitude": 28.66, "longitude": 77.43},
        {"market_name": "Bulandshahr APMC", "district": "Bulandshahr", "state": "Uttar Pradesh", "distance_km": 48.0, "latitude": 28.40, "longitude": 77.85}
    ]
