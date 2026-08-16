"""Shared FastAPI dependencies."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import Depends, Header, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.errors import ForbiddenError, UnauthorizedError
from app.modules.auth.service import is_revoked
from app.modules.profile.models import Farm, Farmer, Plot
from app.shared.security import decode_token

_bearer = HTTPBearer(auto_error=False)

DbSession = Annotated[Session, Depends(get_db)]


def get_language(accept_language: Annotated[str | None, Header()] = None) -> str:
    """Resolve the response language from the Accept-Language header (FR-8.1)."""
    supported = {"hi", "pa", "mr", "bn", "bho", "en"}
    if accept_language:
        for part in accept_language.split(","):
            code = part.split(";")[0].strip().split("-")[0].lower()
            if code in supported:
                return code
    return "hi"


Language = Annotated[str, Depends(get_language)]


def get_current_farmer(
    request: Request,
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)] = None,
) -> Farmer:
    """Resolve the authenticated farmer, or raise 401.

    The farmer identity comes from the signed token only — never from a request
    body or query parameter.
    """
    if credentials is None:
        raise UnauthorizedError("Authentication required")

    payload = decode_token(credentials.credentials, expected_type="access")

    if is_revoked(payload["jti"]):
        raise UnauthorizedError("Token has been revoked", code="TOKEN_REVOKED")

    farmer = db.get(Farmer, uuid.UUID(payload["sub"]))
    if farmer is None or not farmer.is_active:
        raise UnauthorizedError("Account not found or inactive")

    request.state.farmer_id = str(farmer.id)
    return farmer


CurrentFarmer = Annotated[Farmer, Depends(get_current_farmer)]


def owned_farm(farm_id: uuid.UUID, db: DbSession, farmer: CurrentFarmer) -> Farm:
    """Fetch a farm, enforcing ownership.

    Returns 403 (not 404) when the farm exists but belongs to someone else, so
    the behaviour is explicit in tests. Both are equally non-disclosing here
    because farm ids are UUIDs and cannot be enumerated.
    """
    farm = db.get(Farm, farm_id)
    if farm is None:
        raise ForbiddenError("Farm not found or not owned by you", code="FARM_NOT_FOUND")
    if farm.farmer_id != farmer.id:
        raise ForbiddenError("Farm not found or not owned by you", code="FARM_NOT_FOUND")
    return farm


OwnedFarm = Annotated[Farm, Depends(owned_farm)]


def owned_plot(plot_id: uuid.UUID, db: DbSession, farmer: CurrentFarmer) -> Plot:
    """Fetch a plot, enforcing ownership through its farm."""
    plot = db.get(Plot, plot_id)
    if plot is None or plot.farm.farmer_id != farmer.id:
        raise ForbiddenError("Plot not found or not owned by you", code="PLOT_NOT_FOUND")
    return plot


OwnedPlot = Annotated[Plot, Depends(owned_plot)]
