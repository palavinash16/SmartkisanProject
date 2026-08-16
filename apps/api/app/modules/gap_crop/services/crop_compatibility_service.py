"""Previous-Crop Compatibility Service.

Evaluates crop rotation compatibility between previous crop and candidate gap crop
using structured database/configuration matrix rather than hardcoded if/else rules.
"""

from __future__ import annotations

from typing import Dict, List, Optional
from app.modules.gap_crop.seed_data import SEED_COMPATIBILITY_MATRIX


def evaluate_crop_compatibility(
    previous_crop: str,
    candidate_crop_name: str,
    matrix: Optional[List[Dict]] = None
) -> tuple[str, str, float]:
    """Evaluate rotation compatibility.

    Returns:
        (compatibility_status, rotation_notes, score_0_to_20)
    """
    lookup_matrix = matrix or SEED_COMPATIBILITY_MATRIX

    norm_prev = previous_crop.strip().lower()
    norm_cand = candidate_crop_name.strip().lower()

    match = None
    for entry in lookup_matrix:
        if (
            entry["previous_crop"].strip().lower() in norm_prev or norm_prev in entry["previous_crop"].strip().lower()
        ) and (
            entry["candidate_crop"].strip().lower() in norm_cand or norm_cand in entry["candidate_crop"].strip().lower()
        ):
            match = entry
            break

    if match:
        status = match["compatibility_status"]
        notes = match["rotation_notes"]
        if status == "Compatible":
            score = 20.0
        elif status == "Caution":
            score = 10.0
        else:
            score = 0.0
        return status, notes, score

    # Fallback default evaluation if unmapped pair
    # If candidate is a legume after cereal -> Compatible assumption
    cereal_crops = {"wheat", "paddy", "maize", "barley", "bajari"}
    if norm_prev in cereal_crops and ("moong" in norm_cand or "urad" in norm_cand or "cowpea" in norm_cand or "lobia" in norm_cand):
        return (
            "Compatible",
            f"Favorable leguminous crop rotation after cereal ({previous_crop}).",
            18.0,
        )

    return (
        "Unknown / Neutral",
        f"Standard crop sequence; no specific negative crop rotation interaction noted for {previous_crop} -> {candidate_crop_name}.",
        12.0,
    )
