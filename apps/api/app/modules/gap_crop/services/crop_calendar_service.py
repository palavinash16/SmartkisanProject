"""Regional Crop Calendar Suitability Service.

Evaluates regional agricultural suitability by state, district, and sowing season.

Rules:
- If regional calendar data exists for location + crop, verify sowing month window.
- If regional calendar data is unavailable, fallback gracefully with explicit text:
  "Regional suitability data unavailable."
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from app.modules.gap_crop.seed_data import SEED_REGIONAL_CALENDAR


def evaluate_regional_suitability(
    crop_name: str,
    state_name: Optional[str],
    district_name: Optional[str],
    sowing_month: int,
    calendar_records: Optional[List[Dict]] = None
) -> tuple[str, str, float]:
    """Evaluate regional suitability.

    Returns:
        (suitability_status, explanation, score_0_to_15)
    """
    records = calendar_records or SEED_REGIONAL_CALENDAR

    if not state_name or not district_name:
        return (
            "Data Unavailable",
            "Regional suitability data unavailable.",
            10.0,  # Neutral default score
        )

    norm_state = state_name.strip().lower()
    norm_dist = district_name.strip().lower()
    norm_crop = crop_name.strip().lower()

    matches = [
        r for r in records
        if r["state_name"].strip().lower() in norm_state
        and r["district_name"].strip().lower() in norm_dist
        and (r["crop_name"].strip().lower() in norm_crop or norm_crop in r["crop_name"].strip().lower())
    ]

    if not matches:
        return (
            "Data Unavailable",
            "Regional suitability data unavailable.",
            10.0,
        )

    rec = matches[0]
    s_start = rec["sowing_start_month"]
    s_end = rec["sowing_end_month"]

    # Month match check
    if s_start <= sowing_month <= s_end:
        score = 15.0 * rec.get("confidence_weight", 0.85)
        return (
            rec.get("regional_suitability", "High"),
            f"Favorable regional sowing window ({s_start}-{s_end} month) for {district_name}, {state_name}.",
            round(score, 1),
        )

    # Outside window
    return (
        "Low Suitability",
        f"Suboptimal sowing window for {district_name}; recommended window is month {s_start} to {s_end}.",
        5.0,
    )
