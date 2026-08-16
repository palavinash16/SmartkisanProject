"""Auth endpoints (§2 API Design)."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Header, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings
from app.deps import DbSession
from app.errors import UnauthorizedError
from app.modules.auth import service
from app.modules.auth.schemas import (
    LogoutIn,
    LogoutOut,
    OTPRequestIn,
    OTPRequestOut,
    OTPVerifyIn,
    RefreshIn,
    TokenOut,
)
from app.schemas import Meta, ok

router = APIRouter(prefix="/auth", tags=["auth"])
_bearer = HTTPBearer(auto_error=False)


@router.post("/otp/request", status_code=status.HTTP_200_OK)
def request_otp(payload: OTPRequestIn) -> dict:
    """Send a login OTP (FR-1.1).

    Rate limited to 3 per phone per hour so a farmer cannot be SMS-bombed.
    """
    otp, ttl = service.request_otp(payload.phone)

    # TODO(Phase 6): dispatch via SMS provider. Until then, dev returns the OTP
    # so the flow is testable end to end.
    out = OTPRequestOut(
        otp_sent=True,
        expires_in=ttl,
        debug_otp=None if settings.is_production else otp,
    )
    return ok(out, source="SmartKisan auth")


@router.post("/otp/verify")
def verify_otp(payload: OTPVerifyIn, db: DbSession) -> dict:
    """Verify an OTP and issue tokens. Registers the farmer on first login."""
    pair = service.verify_otp_and_issue_tokens(db, payload.phone, payload.otp)
    return ok(
        TokenOut(
            access_token=pair.access_token,
            refresh_token=pair.refresh_token,
            expires_in=pair.expires_in,
            is_new_user=pair.is_new_user,
        ),
        source="SmartKisan auth",
    )


@router.post("/refresh")
def refresh(payload: RefreshIn, db: DbSession) -> dict:
    """Rotate tokens. The presented refresh token is revoked (NFR-4.2)."""
    pair = service.refresh_tokens(db, payload.refresh_token)
    return ok(
        TokenOut(
            access_token=pair.access_token,
            refresh_token=pair.refresh_token,
            expires_in=pair.expires_in,
            is_new_user=False,
        ),
        source="SmartKisan auth",
    )


@router.post("/logout")
def logout(
    payload: LogoutIn,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)] = None,
    _authorization: Annotated[str | None, Header()] = None,
) -> dict:
    """Revoke the current access token and, if supplied, the refresh token."""
    if credentials is None:
        raise UnauthorizedError("Authentication required")
    service.logout(credentials.credentials, payload.refresh_token)
    return ok(LogoutOut(), meta=Meta.internal(source="SmartKisan auth"))
