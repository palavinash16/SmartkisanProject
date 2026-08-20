"""Regional Crop Calendar & Location Precedence Service.

Evaluates regional agricultural suitability adhering strictly to the location precedence hierarchy:
1. District-Specific Match (Level 1 - Highest Resolution)
2. Agro-Climatic Zone Match (Level 2 - Regional Homogeneity)
3. State-Level Match (Level 3 - State Administrative Level)
4. Fallback (Level 4 - Data Unavailable Notice)

CRITICAL REQUIREMENT:
- Never assume a recommendation from one state applies to another state.
- No cross-state data borrowing without evidence.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from app.modules.gap_crop.seed_data import SEED_DISTRICT_ZONE_MAP, SEED_REGIONAL_CALENDAR, SEED_SOURCES


def evaluate_regional_suitability(
    crop_name: str,
    state_name: Optional[str],
    district_name: Optional[str],
    sowing_month: int,
    calendar_records: Optional[List[Dict]] = None
) -> tuple[str, str, float, Dict[str, Any]]:
    """Evaluate regional suitability adhering to strict location precedence hierarchy.

    Returns:
        (suitability_status, explanation, score_0_to_15, location_context_meta)
    """
    records = calendar_records or SEED_REGIONAL_CALENDAR

    if not state_name:
        return (
            "Data Unavailable",
            "State information missing; regional suitability data unavailable.",
            10.0,
            {"resolution_level": "Data Unavailable", "zone": None, "source_provenance": "None"},
        )

    norm_state = state_name.strip().lower()
    norm_dist = (district_name or "").strip().lower()
    norm_crop = crop_name.strip().lower()

    # Determine Agro-Climatic Zone for district if available (supports (state, district) tuple or string key)
    mapped_zone = None
    if state_name and district_name:
        zone_val = SEED_DISTRICT_ZONE_MAP.get((state_name, district_name))
        if isinstance(zone_val, str):
            mapped_zone = zone_val
        elif isinstance(zone_val, dict):
            mapped_zone = zone_val.get("zone")

    if not mapped_zone and district_name:
        zone_val = SEED_DISTRICT_ZONE_MAP.get(district_name)
        if isinstance(zone_val, str):
            mapped_zone = zone_val
        elif isinstance(zone_val, dict):
            mapped_zone = zone_val.get("zone")

    # ---------------------------------------------------------------- Level 1: District-Specific Match
    if norm_dist:
        district_matches = [
            r for r in records
            if r.get("state_name", "").strip().lower() == norm_state
            and (r.get("district_name") or "").strip().lower() == norm_dist
            and (r.get("crop_name", "").strip().lower() in norm_crop or norm_crop in r.get("crop_name", "").strip().lower())
        ]
        if district_matches:
            rec = district_matches[0]
            s_start = rec["sowing_start_month"]
            s_end = rec["sowing_end_month"]
            if s_start <= sowing_month <= s_end:
                score = round(15.0 * rec.get("confidence_weight", 0.95), 1)
                return (
                    rec.get("regional_suitability", "High"),
                    f"Favorable district sowing window ({s_start}-{s_end} month) for {district_name}, {state_name}.",
                    score,
                    {
                        "resolution_level": "District Official Data",
                        "zone": mapped_zone or rec.get("agro_climatic_zone"),
                        "source_provenance": rec.get("source", "Official State / ICAR Records"),
                    },
                )
            else:
                return (
                    "Low Suitability",
                    f"Suboptimal sowing window for {district_name}; recommended district window is month {s_start} to {s_end}.",
                    5.0,
                    {
                        "resolution_level": "District Official Data",
                        "zone": mapped_zone or rec.get("agro_climatic_zone"),
                        "source_provenance": rec.get("source", "Official State / ICAR Records"),
                    },
                )

    # ---------------------------------------------------------------- Level 2: Agro-Climatic Zone Match
    if mapped_zone:
        zone_matches = [
            r for r in records
            if (r.get("agro_climatic_zone") or "").strip().lower() == mapped_zone.strip().lower()
            and (r.get("crop_name", "").strip().lower() in norm_crop or norm_crop in r.get("crop_name", "").strip().lower())
        ]
        if zone_matches:
            rec = zone_matches[0]
            s_start = rec["sowing_start_month"]
            s_end = rec["sowing_end_month"]
            if s_start <= sowing_month <= s_end:
                score = round(13.5 * rec.get("confidence_weight", 0.85), 1)
                return (
                    rec.get("regional_suitability", "High"),
                    f"Favorable agro-climatic zone sowing window ({mapped_zone}) for {state_name}.",
                    score,
                    {
                        "resolution_level": "Agro-Climatic Zone Data",
                        "zone": mapped_zone,
                        "source_provenance": rec.get("source", "ICAR Agro-Climatic Zone Guide"),
                    },
                )

    # ---------------------------------------------------------------- Level 3: State-Level Match
    state_matches = [
        r for r in records
        if r.get("state_name", "").strip().lower() == norm_state
        and (r.get("crop_name", "").strip().lower() in norm_crop or norm_crop in r.get("crop_name", "").strip().lower())
    ]
    if state_matches:
        rec = state_matches[0]
        s_start = rec["sowing_start_month"]
        s_end = rec["sowing_end_month"]
        if s_start <= sowing_month <= s_end:
            score = round(12.0 * rec.get("confidence_weight", 0.80), 1)
            return (
                rec.get("regional_suitability", "Medium"),
                f"Favorable state-level sowing window for {state_name}.",
                score,
                {
                    "resolution_level": "State Official Data",
                    "zone": mapped_zone,
                    "source_provenance": rec.get("source", "State Agriculture Department Guidelines"),
                },
            )

    # ---------------------------------------------------------------- Level 4: Data Unavailable (No Borrowing)
    return (
        "Data Unavailable",
        f"Regional suitability data unavailable for {district_name or state_name}. Relying on core crop duration & irrigation rules.",
        10.0,
        {
            "resolution_level": "Data Unavailable (No Borrowing)",
            "zone": mapped_zone,
            "source_provenance": "Demo/seed data — requires source verification",
        },
    )