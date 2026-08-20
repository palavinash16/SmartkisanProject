"""Recommendation Ranker and Scorer.

Combines evaluated scores from duration, compatibility, irrigation, regional calendar,
and nutrient estimation services to rank candidate gap crops.

Scoring breakdown (Max 100):
- Gap Duration Fit: 0..40
- Previous Crop Compatibility: 0..20
- Regional Suitability: 0..15
- Irrigation Suitability: 0..10
- Nutrient / Rotation Benefit: 0..15
"""

from __future__ import annotations

from typing import Any, Dict, List
from app.modules.gap_crop.services.crop_calendar_service import evaluate_regional_suitability
from app.modules.gap_crop.services.crop_compatibility_service import evaluate_crop_compatibility
from app.modules.gap_crop.services.duration_filter import evaluate_duration_eligibility
from app.modules.gap_crop.services.irrigation_filter import evaluate_irrigation_suitability
from app.modules.gap_crop.services.nutrient_estimator import evaluate_nutrient_rotation_impact


def rank_and_score_candidate_crops(
    candidates: List[Dict[str, Any]],
    previous_crop: str,
    harvest_month: int,
    gap_days: int,
    irrigation_type: str,
    state_name: str | None,
    district_name: str | None,
    area_acres: float,
) -> Dict[str, Any]:
    """Evaluates candidates, scores them out of 100, and returns Top 3 or no_suitable_crop."""
    evaluated_crops = []
    rejected_summary = []

    for crop in candidates:
        crop_name = crop.get("crop_name", crop.get("name", ""))

        # Filter out non-gap candidates (e.g. main crops like Paddy, Sugarcane)
        if crop.get("is_gap_candidate") is False:
            rejected_summary.append({"crop_name": crop_name, "reason": "Excluded: Non-gap crop candidate (Main Crop / Long duration)"})
            continue

        # 1. Duration filter
        dur_eligible, dur_status, dur_score = evaluate_duration_eligibility(crop, gap_days)
        if not dur_eligible:
            rejected_summary.append({"crop_name": crop_name, "reason": dur_status})
            continue

        # 2. Irrigation filter
        irr_suitable, irr_reason, irr_score = evaluate_irrigation_suitability(crop, irrigation_type)
        if not irr_suitable:
            rejected_summary.append({"crop_name": crop_name, "reason": irr_reason})
            continue

        # 3. Rotation compatibility
        comp_status, comp_notes, comp_score = evaluate_crop_compatibility(previous_crop, crop_name)

        # 4. Regional calendar suitability & Location Precedence
        reg_status, reg_notes, reg_score, loc_meta = evaluate_regional_suitability(
            crop_name, state_name, district_name, harvest_month
        )

        # 5. Nutrient / Rotation evaluation
        nutr_rating, nutr_notes, nutr_score = evaluate_nutrient_rotation_impact(previous_crop, crop)

        # Total Score
        total_score = round(dur_score + comp_score + reg_score + irr_score + nutr_score, 1)

        # Reasons list
        reasons = [
            f"✓ {dur_status}",
            f"✓ {comp_notes}",
            f"✓ {irr_reason}",
            f"✓ {reg_notes}",
            f"✓ {nutr_notes}",
        ]

        warnings = []
        if comp_status == "Caution":
            warnings.append(f"Caution: {comp_notes}")
        if reg_status == "Low Suitability":
            warnings.append(f"Regional Notice: {reg_notes}")

        min_prof = crop.get("net_profit_per_acre_min", 15000)
        max_prof = crop.get("net_profit_per_acre_max", 25000)
        projected_profit_total = int(max_prof * area_acres)

        source_provenance = loc_meta.get("source_provenance", "Demo/seed data — requires source verification")

        evaluated_crops.append({
            "rank": 0,  # assigned after sort
            "crop_code": crop.get("code", crop_name.lower().replace(" ", "_")),
            "crop_name": crop_name,
            "hindi_name": crop.get("hindi_name", crop_name),
            "scientific_name": crop.get("scientific_name"),
            "category": crop.get("category", "Pulse"),
            "duration_days": f"{crop.get('min_duration_days', 60)}-{crop.get('max_duration_days', 68)} Days",
            "water_requirement": crop.get("water_requirement", "Low"),
            "suitability_status": reg_status if reg_status != "Data Unavailable" else "Eligible",
            "rotation_benefit": nutr_rating,
            "estimated_nutrient_impact": nutr_notes,
            "expected_yield": f"{crop.get('expected_yield_qtl_per_acre', 4.5)} qtl/acre",
            "projected_profit_per_acre": f"₹{min_prof:,} - ₹{max_prof:,} / Acre",
            "projected_profit_total": projected_profit_total,
            "score": total_score,
            "score_breakdown": {
                "gap_duration_fit": dur_score,
                "crop_compatibility": comp_score,
                "regional_suitability": reg_score,
                "irrigation_suitability": irr_score,
                "nutrient_rotation_benefit": nutr_score,
                "total": total_score,
            },
            "location_resolution_level": loc_meta.get("resolution_level", "State Official Data"),
            "agro_climatic_zone": loc_meta.get("zone"),
            "reasons": reasons,
            "warnings": warnings,
            "source_provenance": source_provenance,
        })

    # Sort descending by score
    evaluated_crops.sort(key=lambda x: x["score"], reverse=True)

    # Assign ranks
    for idx, c in enumerate(evaluated_crops, start=1):
        c["rank"] = idx

    top_3 = evaluated_crops[:3]

    if not top_3:
        return {
            "status": "no_suitable_crop",
            "message": "No suitable gap crop was found for the available period and conditions.",
            "gap_days": gap_days,
            "suggestion": "Consider changing the planned sowing date or consult a local agricultural expert.",
            "rejected_crops": rejected_summary,
        }

    return {
        "status": "success",
        "top_recommendations": top_3,
        "all_eligible_count": len(evaluated_crops),
        "rejected_summary": rejected_summary,
    }
