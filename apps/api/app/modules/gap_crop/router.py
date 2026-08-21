"""FastAPI Router for Gap Crop Engine module."""

from __future__ import annotations

from typing import Union
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.modules.gap_crop.schemas import (
    GapCropRecommendRequest,
    GapCropRecommendResponse,
    NoSuitableCropResponse,
)
from app.modules.gap_crop.seed_data import SEED_CROP_CATALOG
from app.modules.gap_crop.service import generate_gap_crop_recommendation

router = APIRouter(tags=["Gap Crop Engine"])


@router.post(
    "/api/v1/gap-crop/recommend",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Recommend short-duration gap crops",
)
@router.post("/gap-crop/recommend", response_model=dict, include_in_schema=False)
async def recommend_gap_crop(
    req: GapCropRecommendRequest, db: Session = Depends(get_db)
):
    recommendation = await generate_gap_crop_recommendation(req, db)
    return {
        "data": recommendation,
        "meta": {
            "source": "SmartKisan India-Wide Decision Engine v2.0",
            "is_stale": False,
            "data_as_of": "2026-08-17T00:00:00Z",
            "model_version": "2.0.0",
        },
    }


@router.get("/api/v1/gap-crop/catalog", response_model=dict, summary="Get gap crop catalog")
@router.get("/gap-crop/catalog", response_model=dict, include_in_schema=False)
def get_gap_crop_catalog():
    return {
        "data": SEED_CROP_CATALOG,
        "meta": {
            "source": "SmartKisan Crop Catalog Database — India-Wide Master",
            "is_stale": False,
            "data_as_of": "2026-08-17T00:00:00Z",
            "model_version": None,
        },
    }
