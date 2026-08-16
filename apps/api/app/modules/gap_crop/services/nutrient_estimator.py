"""Nutrient & Rotation Estimation Service.

Evaluates estimated nutrient/rotation impact based on crop classification and previous crop history.

CRITICAL REQUIREMENT (Phase 1 §11 & §24):
- This is NOT a soil test. Never present values as measured soil NPK.
- Use scientifically cautious terminology: "Estimated nutrient/rotation impact", NOT "Actual soil fertility".
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from app.modules.gap_crop.seed_data import SEED_NUTRIENT_PROFILES


def evaluate_nutrient_rotation_impact(
    previous_crop: str, candidate_crop: Dict[str, Any], profiles: Optional[List[Dict]] = None
) -> tuple[str, str, float]:
    """Evaluate nutrient/rotation impact.

    Returns:
        (benefit_rating, cautious_explanation, score_0_to_15)
    """
    is_legume = candidate_crop.get("is_legume", False)
    crop_name = candidate_crop.get("crop_name", "")

    prof_list = profiles or SEED_NUTRIENT_PROFILES
    norm_prev = previous_crop.strip().lower()

    prev_profile = None
    for p in prof_list:
        if p["crop_name"].strip().lower() in norm_prev:
            prev_profile = p
            break

    if is_legume:
        score = 15.0
        benefit_rating = "Favorable"
        if prev_profile:
            explanation = (
                f"Previous {previous_crop} cultivation may have a relatively high nitrogen demand; "
                f"this {crop_name} recommendation receives a favorable rotation/nutrient benefit based on its nitrogen-fixing crop profile."
            )
        else:
            explanation = (
                f"Legume crop ({crop_name}) provides a favorable rotation benefit, adding atmospheric nitrogen to the soil system."
            )
    else:
        # Non-legume candidate
        score = 8.0
        benefit_rating = "Standard"
        explanation = (
            f"Non-leguminous gap crop ({crop_name}); provides organic biomass return with standard nutrient uptake after {previous_crop}."
        )

    return benefit_rating, explanation, score
