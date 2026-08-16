"""Gap Days Calculation Service.

Formula: gap_days = next_sowing_date - harvest_date
Validation rules:
- harvest_date cannot be after next_sowing_date.
- gap_days must be > 0.
- Uses native Python datetime.date objects for precise calendar calculation (including leap years).
"""

from __future__ import annotations

from datetime import date
from app.errors import AppError


def calculate_gap_days(harvest_date: date, next_sowing_date: date) -> int:
    """Calculate the available gap in days between harvest_date and next_sowing_date.

    Raises AppError (400, INVALID_DATE_RANGE) if dates are invalid.
    """
    if not isinstance(harvest_date, date) or not isinstance(next_sowing_date, date):
        raise AppError(
            status_code=400,
            code="INVALID_DATE_FORMAT",
            message="Harvest date and next sowing date must be valid date objects.",
        )

    if harvest_date > next_sowing_date:
        raise AppError(
            status_code=400,
            code="INVALID_DATE_RANGE",
            message=f"Harvest date ({harvest_date}) cannot be after next sowing date ({next_sowing_date}).",
            details={"harvest_date": str(harvest_date), "next_sowing_date": str(next_sowing_date)},
        )

    gap_days = (next_sowing_date - harvest_date).days

    if gap_days <= 0:
        raise AppError(
            status_code=400,
            code="INVALID_GAP_DURATION",
            message="Available gap between harvest and next sowing must be greater than 0 days.",
            details={"gap_days": gap_days},
        )

    return gap_days
