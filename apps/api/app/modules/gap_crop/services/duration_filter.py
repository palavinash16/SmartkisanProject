"""Crop Duration Filtering Service.

Determines if a candidate crop's growth duration fits within the available gap days.

Rules:
- A crop is eligible only when its maximum required duration (max_duration_days)
  is less than or equal to the available gap days.
- Crops requiring longer growth periods than the available gap are strictly rejected
  with an explicit rejection reason.
"""

from __future__ import annotations

from typing import Any, Dict


def evaluate_duration_eligibility(
    crop: Dict[str, Any], gap_days: int
) -> tuple[bool, str, float]:
    """Evaluate duration eligibility.

    Returns:
        (is_eligible, reason_or_status, score_0_to_40)
    """
    min_dur = crop.get("min_duration_days", 60)
    max_dur = crop.get("max_duration_days", 68)

    if max_dur > gap_days:
        rejection_reason = (
            f"Rejected: Crop maximum duration ({max_dur} days) exceeds available gap ({gap_days} days)."
        )
        return False, rejection_reason, 0.0

    # Crop fits the gap window
    # Calculate transparent Gap Fit score (0..40 pts)
    # Perfect fit: crop max_dur uses 75%-95% of available gap.
    usage_pct = max_dur / float(gap_days)
    if 0.65 <= usage_pct <= 0.98:
        score = 40.0
        status = f"Optimal fit for {gap_days}-day window ({min_dur}-{max_dur} days duration)"
    elif usage_pct < 0.65:
        # Shorter crop, leaves comfortable turnaround buffer
        score = 35.0
        status = f"Fits comfortably in {gap_days}-day window ({min_dur}-{max_dur} days duration)"
    else:  # usage_pct > 0.98 (close to gap limit)
        score = 30.0
        status = f"Fits tight in {gap_days}-day window ({min_dur}-{max_dur} days duration)"

    return True, status, score
