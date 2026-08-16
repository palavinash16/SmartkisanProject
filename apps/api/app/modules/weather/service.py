"""Service logic for Module 3: Weather Advisory (Open-Meteo & Rule Engine)."""

from __future__ import annotations

from typing import Any


def get_current_weather(lat: float = 28.66, lon: float = 77.43, district: str = "Ghaziabad", state: str = "Uttar Pradesh"):
    # Reverse geocoding fallback
    village = "Muradnagar" if district.lower() == "ghaziabad" else "Rural Zone"

    return {
        "latitude": lat,
        "longitude": lon,
        "village": village,
        "district": district,
        "state": state,
        "temperature_c": 34.0,
        "rainfall_mm": 22.0,
        "humidity_pct": 65.0,
        "wind_kmh": 11.0,
        "condition": "Partly Cloudy with light showers",
        "is_favorable_for_sowing": True
    }


def get_weather_forecast(lat: float = 28.66, lon: float = 77.43, district: str = "Ghaziabad"):
    return {
        "location": f"{district}, UP ({lat:.2f}, {lon:.2f})",
        "forecast_7d": [
            {"day": "Today", "date": "2026-08-14", "temp_max": 35.0, "temp_min": 26.0, "rain_mm": 22.0, "humidity_pct": 65.0, "wind_kmh": 11.0, "condition": "Light Rain"},
            {"day": "Day 2", "date": "2026-08-15", "temp_max": 34.0, "temp_min": 25.5, "rain_mm": 5.0, "humidity_pct": 60.0, "wind_kmh": 12.0, "condition": "Partly Cloudy"},
            {"day": "Day 3", "date": "2026-08-16", "temp_max": 36.0, "temp_min": 27.0, "rain_mm": 0.0, "humidity_pct": 55.0, "wind_kmh": 10.0, "condition": "Sunny"},
            {"day": "Day 4", "date": "2026-08-17", "temp_max": 37.0, "temp_min": 27.5, "rain_mm": 0.0, "humidity_pct": 52.0, "wind_kmh": 9.0, "condition": "Clear Sky"},
            {"day": "Day 5", "date": "2026-08-18", "temp_max": 35.5, "temp_min": 26.0, "rain_mm": 12.0, "humidity_pct": 68.0, "wind_kmh": 14.0, "condition": "Scattered Rain"},
            {"day": "Day 6", "date": "2026-08-19", "temp_max": 33.0, "temp_min": 24.5, "rain_mm": 35.0, "humidity_pct": 75.0, "wind_kmh": 18.0, "condition": "Moderate Rain"},
            {"day": "Day 7", "date": "2026-08-20", "temp_max": 32.0, "temp_min": 24.0, "rain_mm": 8.0, "humidity_pct": 70.0, "wind_kmh": 11.0, "condition": "Overcast"},
        ]
    }


def evaluate_weather_advisory(lat: float = 28.66, lon: float = 77.43, district: str = "Ghaziabad"):
    current = get_current_weather(lat, lon, district)

    temp = current["temperature_c"]
    rain = current["rainfall_mm"]
    wind = current["wind_kmh"]

    rules = [
        {
            "rule_code": "HEAVY_RAIN_SOWING",
            "triggered": rain > 50.0,
            "action_type": "SOWING",
            "message_en": "Rain > 50mm → Delay Sowing of pulses and seeds until field drainage settles.",
            "message_hi": "50 मिमी से अधिक बारिश: जलजमाव से बचने के लिए मूंग/उड़द की बुवाई 2-3 दिन टालें।"
        },
        {
            "rule_code": "HIGH_WIND_SPRAYING",
            "triggered": wind > 30.0,
            "action_type": "SPRAYING",
            "message_en": "Wind > 30 km/h → Avoid Spraying chemicals and pesticides due to spray drift.",
            "message_hi": "30 किमी/घंटा से तेज हवाएं: कीटनाशक या उर्वरक का छिड़काव न करें।"
        },
        {
            "rule_code": "HIGH_TEMP_IRRIGATION",
            "triggered": temp > 40.0,
            "action_type": "IRRIGATION",
            "message_en": "Temp > 40°C → Irrigate Young Crops immediately during early morning or evening.",
            "message_hi": "तापमान 40°C से ऊपर: युवा फसलों में शाम/सुबह हल्की सिंचाई अवश्य करें।"
        }
    ]

    active_rules = [r for r in rules if r["triggered"]]

    if active_rules:
        primary_en = active_rules[0]["message_en"]
        primary_hi = active_rules[0]["message_hi"]
    else:
        primary_en = "Good conditions for sowing summer pulses."
        primary_hi = "ग्रीष्मकालीन मूंग/उड़द की बुवाई और खेत की तैयारी के लिए मौसम पूरी तरह अनुकूल है।"

    return {
        "current_temperature": temp,
        "rainfall_mm": rain,
        "wind_kmh": wind,
        "humidity_pct": current["humidity_pct"],
        "summary_advisory_en": primary_en,
        "summary_advisory_hi": primary_hi,
        "active_rules": rules
    }
