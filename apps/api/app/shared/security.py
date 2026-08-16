"""Cryptographic primitives for auth and PII (NFR-4.2, NFR-4.3)."""

from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any, Literal

import jwt

from app.config import settings
from app.errors import UnauthorizedError

# --------------------------------------------------------------------- phone


def hash_phone(phone: str) -> str:
    """Deterministic lookup key for a phone number.

    HMAC with the app secret, not a bare SHA-256: the phone-number space is small
    enough (10^10) that a plain digest is trivially reversible by brute force.
    """
    return hmac.new(
        settings.jwt_secret.encode(), phone.strip().encode(), hashlib.sha256
    ).hexdigest()


def _phone_key() -> bytes:
    return hashlib.sha256(f"{settings.jwt_secret}:phone-enc".encode()).digest()


def encrypt_phone(phone: str) -> str:
    """Reversibly obscure a phone number for at-rest storage.

    XOR-with-keystream + base64. This keeps plaintext numbers out of the database
    and out of dumps/backups.

    NOTE: this is obfuscation, not authenticated encryption. Before handling real
    farmer data, replace with AES-GCM via a KMS-managed key. Tracked as a Phase 6
    security-review item.
    """
    raw = phone.strip().encode()
    key = _phone_key()
    stream = (key * (len(raw) // len(key) + 1))[: len(raw)]
    return base64.urlsafe_b64encode(bytes(a ^ b for a, b in zip(raw, stream, strict=True))).decode()


def decrypt_phone(token: str) -> str:
    raw = base64.urlsafe_b64decode(token.encode())
    key = _phone_key()
    stream = (key * (len(raw) // len(key) + 1))[: len(raw)]
    return bytes(a ^ b for a, b in zip(raw, stream, strict=True)).decode()


def mask_phone(phone: str) -> str:
    """``+919876543210`` -> ``+91987****210`` for display."""
    p = phone.strip()
    return p if len(p) < 8 else f"{p[:6]}****{p[-3:]}"


# --------------------------------------------------------------------- OTP


def generate_otp(length: int | None = None) -> str:
    """Cryptographically random numeric OTP."""
    n = length or settings.otp_length
    return "".join(secrets.choice("0123456789") for _ in range(n))


def hash_otp(otp: str, phone: str) -> str:
    """Store OTPs hashed and phone-bound, so a Redis dump leaks no usable codes."""
    return hmac.new(
        settings.jwt_secret.encode(), f"{phone}:{otp}".encode(), hashlib.sha256
    ).hexdigest()


def verify_otp(otp: str, phone: str, stored_hash: str) -> bool:
    return hmac.compare_digest(hash_otp(otp, phone), stored_hash)


# --------------------------------------------------------------------- JWT

TokenType = Literal["access", "refresh"]


def create_token(
    farmer_id: uuid.UUID | str,
    token_type: TokenType,
    *,
    jti: str | None = None,
) -> tuple[str, str, datetime]:
    """Return ``(encoded_jwt, jti, expires_at)``.

    The `jti` is what makes revocation possible: logout and refresh-rotation add
    it to a Redis deny-list.
    """
    now = datetime.now(UTC)
    ttl = (
        timedelta(minutes=settings.access_token_ttl_minutes)
        if token_type == "access"
        else timedelta(days=settings.refresh_token_ttl_days)
    )
    expires_at = now + ttl
    token_id = jti or str(uuid.uuid4())

    payload: dict[str, Any] = {
        "sub": str(farmer_id),
        "type": token_type,
        "jti": token_id,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    encoded = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded, token_id, expires_at


def decode_token(token: str, expected_type: TokenType | None = None) -> dict[str, Any]:
    """Decode and validate a JWT.

    Raises:
        UnauthorizedError: expired, malformed, or of the wrong type.
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise UnauthorizedError("Token has expired", code="TOKEN_EXPIRED") from exc
    except jwt.InvalidTokenError as exc:
        raise UnauthorizedError("Invalid token") from exc

    if expected_type and payload.get("type") != expected_type:
        # Prevents a refresh token being replayed as an access token.
        raise UnauthorizedError(f"Expected a {expected_type} token")

    return payload
