"""Irrigation Compatibility Filtering Service.

Evaluates crop water requirements against the farmer's available irrigation facility.
"""

from __future__ import annotations

from typing import Any, Dict


def evaluate_irrigation_suitability(
    crop: Dict[str, Any], irrigation_type: str
) -> tuple[bool, str, float]:
    """Evaluate irrigation suitability.

    Returns:
        (is_suitable, reason, score_0_to_10)
    """
    water_req = crop.get("water_requirement", "Medium").strip()
    norm_irr = irrigation_type.strip().lower()

    # Rainfed rules
    if "rainfed" in norm_irr or "barani" in norm_irr:
        if water_req.lower() in ("high", "very high"):
            return (
                False,
                f"Rejected: Rainfed cultivation is unsuitable for high-water requirement crop ({crop.get('crop_name')}).",
                0.0,
            )
        elif water_req.lower() in ("medium", "medium to high"):
            return (
                True,
                "Caution: Medium water requirement under rainfed condition depends on early monsoon onset.",
                5.0,
            )
        else:  # Low / Very Low
            return (
                True,
                "Suitable: Low water requirement crop fits rainfed summer conditions.",
                10.0,
            )

    # Tube well / Borewell / Canal rules
    if any(k in norm_irr for k in ("tube", "well", "bore", "canal", "drip", "sprinkler")):
        if water_req.lower() in ("low", "very low"):
            return (
                True,
                "Suitable: Low water requirement efficiently matches assured irrigation.",
                10.0,
            )
        elif water_req.lower() in ("medium", "low to medium"):
            return (
                True,
                "Suitable: Medium water requirement well-supported by assured irrigation.",
                9.0,
            )
        else:
            return (
                True,
                "Suitable: High water requirement supported by assured irrigation source.",
                8.0,
            )

    # General fallback
    return (
        True,
        "Compatible irrigation requirement.",
        7.0,
    )
