"""FastAPI Router for Module 4: Crop School."""

from __future__ import annotations

from fastapi import APIRouter
from app.modules.crop_school.service import (
    get_crop_school_guide,
    list_crop_school_crops,
)

router = APIRouter(tags=["Crop School"])


@router.get("/crop-school/crops", response_model=dict)
@router.get("/api/v1/crop-school/crops", response_model=dict)
def get_crops():
    crops = list_crop_school_crops()
    return {
        "data": crops,
        "meta": {
            "source": "SmartKisan ICAR Agronomy Library (Markdown Content)",
            "is_stale": False,
            "data_as_of": "2026-08-14T00:00:00Z"
        }
    }


@router.get("/crop-school/{crop_name}", response_model=dict)
@router.get("/api/v1/crop-school/{crop_name}", response_model=dict)
def get_guide(crop_name: str):
    guide = get_crop_school_guide(crop_name)
    return {
        "data": guide,
        "meta": {
            "source": f"SmartKisan Crop School Guide ({crop_name})",
            "is_stale": False,
            "data_as_of": "2026-08-14T00:00:00Z"
        }
    }
