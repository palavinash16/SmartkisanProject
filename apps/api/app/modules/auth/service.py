"""OTP + JWT authentication service (FR-1.1, NFR-4.2, NFR-4.5)."""

from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.errors import RateLimitedError, UnauthorizedError, ValidationError
from app.logging_config import get_logger
from app.modules.profile.models import Farmer
from app.shared.cache import get_redis
from app.shared.security import (
    create_token,
    decode_token,
    encrypt_phone,
    generate_otp,
    hash_otp,
    hash_phone,
    verify_otp,
)

log = get_logger(__name__)

_OTP_KEY = "otp:{phone_hash}"
_OTP_ATTEMPTS_KEY = "otp:attempts:{phone_hash}"
_OTP_RATE_KEY = "otp:rate:{phone_hash}"
_REVOKED_KEY = "token:revoked:{jti}"


@dataclass(slots=True)
class TokenPair:
    access_token: str
    refresh_token: str
    expires_in: int
    is_new_user: bool


def normalize_phone(phone: str) -> str:
    """Normalise to E.164 for India. Rejects anything that is not a valid mobile."""
    digits = "".join(c for c in phone if c.isdigit())

    if len(digits) == 10:
        digits = "91" + digits
    elif len(digits) == 12 and digits.startswith("91"):
        pass
    elif len(digits) == 11 and digits.startswith("0"):
        digits = "91" + digits[1:]
    else:
        raise ValidationError("Enter a valid 10-digit mobile number", code="INVALID_PHONE")

    # Indian mobile numbers start with 6-9.
    if digits[2] not in "6789":
        raise ValidationError("Enter a valid 10-digit mobile number", code="INVALID_PHONE")

    return "+" + digits


def request_otp(phone: str) -> tuple[str, int]:
    """Generate and store an OTP. Returns ``(otp, ttl_seconds)``.

    The OTP is returned so the caller can dispatch it via SMS. In dev it is also
    logged; in production the SMS provider is the only delivery path.
    """
    normalized = normalize_phone(phone)
    ph = hash_phone(normalized)
    redis = get_redis()

    # NFR-4.5: cap OTPs per phone per hour to prevent SMS-bombing a farmer.
    rate_key = _OTP_RATE_KEY.format(phone_hash=ph)
    count = int(redis.get(rate_key) or 0)
    if count >= settings.rate_limit_otp_per_hour_per_phone:
        raise RateLimitedError(retry_after=redis.ttl(rate_key) or 3600)

    otp = generate_otp()
    redis.setex(_OTP_KEY.format(phone_hash=ph), settings.otp_ttl_seconds, hash_otp(otp, normalized))
    redis.delete(_OTP_ATTEMPTS_KEY.format(phone_hash=ph))

    if redis.incr(rate_key) == 1:
        redis.expire(rate_key, 3600)

    if not settings.is_production:
        log.info("otp.generated_dev_only", phone=normalized, otp=otp)

    return otp, settings.otp_ttl_seconds


def verify_otp_and_issue_tokens(db: Session, phone: str, otp: str) -> TokenPair:
    """Verify an OTP, create the farmer if new, and issue a token pair."""
    normalized = normalize_phone(phone)
    ph = hash_phone(normalized)
    redis = get_redis()

    stored = redis.get(_OTP_KEY.format(phone_hash=ph))
    if not stored:
        raise UnauthorizedError("OTP expired or not requested", code="OTP_EXPIRED")

    # Bound brute-force attempts against a live OTP.
    attempts_key = _OTP_ATTEMPTS_KEY.format(phone_hash=ph)
    attempts = redis.incr(attempts_key)
    redis.expire(attempts_key, settings.otp_ttl_seconds)
    if attempts > settings.otp_max_attempts:
        redis.delete(_OTP_KEY.format(phone_hash=ph))
        raise RateLimitedError(retry_after=300)

    if not verify_otp(otp, normalized, stored):
        raise UnauthorizedError("Incorrect OTP", code="OTP_INVALID")

    redis.delete(_OTP_KEY.format(phone_hash=ph), attempts_key)

    farmer = db.execute(select(Farmer).where(Farmer.phone_hash == ph)).scalar_one_or_none()
    is_new_user = farmer is None
    if farmer is None:
        farmer = Farmer(phone_hash=ph, phone_encrypted=encrypt_phone(normalized))
        db.add(farmer)
        db.flush()
        log.info("farmer.registered", farmer_id=str(farmer.id))
    elif not farmer.is_active:
        raise UnauthorizedError("This account is inactive", code="ACCOUNT_INACTIVE")

    return _issue_pair(farmer.id, is_new_user=is_new_user)


def refresh_tokens(db: Session, refresh_token: str) -> TokenPair:
    """Rotate a refresh token.

    NFR-4.2 requires rotation: the presented token is revoked as part of issuing
    the new pair, so a stolen refresh token is usable at most once.
    """
    payload = decode_token(refresh_token, expected_type="refresh")
    jti = payload["jti"]
    redis = get_redis()

    if redis.exists(_REVOKED_KEY.format(jti=jti)):
        # Replay of an already-rotated token — treat as compromised.
        log.warning("auth.refresh_token_reuse_detected", farmer_id=payload["sub"])
        raise UnauthorizedError("Refresh token already used", code="TOKEN_REUSED")

    farmer_id = uuid.UUID(payload["sub"])
    farmer = db.get(Farmer, farmer_id)
    if farmer is None or not farmer.is_active:
        raise UnauthorizedError("Account not found or inactive")

    _revoke(jti, settings.refresh_token_ttl_days * 86400)
    return _issue_pair(farmer_id, is_new_user=False)


def logout(access_token: str, refresh_token: str | None = None) -> None:
    """Revoke the presented tokens."""
    try:
        access = decode_token(access_token, expected_type="access")
        _revoke(access["jti"], settings.access_token_ttl_minutes * 60)
    except UnauthorizedError:
        pass  # already expired or invalid — nothing to revoke

    if refresh_token:
        try:
            refresh = decode_token(refresh_token, expected_type="refresh")
            _revoke(refresh["jti"], settings.refresh_token_ttl_days * 86400)
        except UnauthorizedError:
            pass


def is_revoked(jti: str) -> bool:
    return bool(get_redis().exists(_REVOKED_KEY.format(jti=jti)))


def _revoke(jti: str, ttl_seconds: int) -> None:
    """Deny-list a token id, expiring with the token itself so the list stays bounded."""
    get_redis().setex(_REVOKED_KEY.format(jti=jti), ttl_seconds, "1")


def _issue_pair(farmer_id: uuid.UUID, *, is_new_user: bool) -> TokenPair:
    access, _, _ = create_token(farmer_id, "access")
    refresh, _, _ = create_token(farmer_id, "refresh")
    return TokenPair(
        access_token=access,
        refresh_token=refresh,
        expires_in=settings.access_token_ttl_minutes * 60,
        is_new_user=is_new_user,
    )
