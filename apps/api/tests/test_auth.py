"""Auth crypto and OTP flow tests (FR-1.1, NFR-4.2).

These exercise the security primitives and the OTP lifecycle without needing a
database — only token issuance/verification and the Redis-backed OTP store.
"""

from __future__ import annotations

import time

import pytest

from app.config import settings
from app.errors import RateLimitedError, UnauthorizedError, ValidationError
from app.modules.auth import service
from app.shared.security import (
    create_token,
    decode_token,
    decrypt_phone,
    encrypt_phone,
    generate_otp,
    hash_otp,
    hash_phone,
    mask_phone,
    verify_otp,
)

# --------------------------------------------------------------------- phone normalisation


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("9876543210", "+919876543210"),
        ("+919876543210", "+919876543210"),
        ("919876543210", "+919876543210"),
        ("09876543210", "+919876543210"),
        ("98765 43210", "+919876543210"),
        ("+91 98765-43210", "+919876543210"),
        ("6123456789", "+916123456789"),
    ],
)
def test_normalize_phone(raw, expected):
    assert service.normalize_phone(raw) == expected


@pytest.mark.parametrize(
    "bad",
    [
        "12345",  # too short
        "5876543210",  # Indian mobiles start 6-9
        "1234567890",
        "98765432101234",  # too long
        "abcdefghij",
    ],
)
def test_normalize_phone_rejects_invalid(bad):
    with pytest.raises(ValidationError):
        service.normalize_phone(bad)


# --------------------------------------------------------------------- phone PII


def test_phone_encryption_round_trip(phone):
    assert decrypt_phone(encrypt_phone(phone)) == phone


def test_encrypted_phone_does_not_contain_plaintext(phone):
    """A database dump must not leak numbers (NFR-4.3)."""
    assert phone not in encrypt_phone(phone)
    assert "9876543210" not in encrypt_phone(phone)


def test_phone_hash_is_deterministic_and_opaque(phone):
    assert hash_phone(phone) == hash_phone(phone)
    assert phone not in hash_phone(phone)
    assert len(hash_phone(phone)) == 64


def test_phone_hash_differs_per_number():
    assert hash_phone("+919876543210") != hash_phone("+919876543211")


def test_mask_phone(phone):
    masked = mask_phone(phone)
    assert masked == "+91987****210"
    assert "6543" not in masked


# --------------------------------------------------------------------- OTP


def test_generate_otp_shape():
    otp = generate_otp()
    assert len(otp) == settings.otp_length
    assert otp.isdigit()


def test_generated_otps_vary():
    assert len({generate_otp() for _ in range(50)}) > 25


def test_otp_hash_is_phone_bound(phone):
    """The same OTP for a different number must not validate."""
    otp = "123456"
    assert hash_otp(otp, phone) != hash_otp(otp, "+919999999999")


def test_verify_otp(phone):
    otp = "482913"
    stored = hash_otp(otp, phone)
    assert verify_otp(otp, phone, stored)
    assert not verify_otp("000000", phone, stored)
    assert not verify_otp(otp, "+919999999999", stored)


# --------------------------------------------------------------------- OTP flow


def test_request_otp_returns_code_and_ttl(phone):
    otp, ttl = service.request_otp(phone)
    assert otp.isdigit()
    assert ttl == settings.otp_ttl_seconds


def test_request_otp_rate_limited_per_phone(phone):
    """NFR-4.5 — a farmer must not be SMS-bombed."""
    for _ in range(settings.rate_limit_otp_per_hour_per_phone):
        service.request_otp(phone)
    with pytest.raises(RateLimitedError):
        service.request_otp(phone)


def test_rate_limit_is_per_phone_not_global():
    for _ in range(settings.rate_limit_otp_per_hour_per_phone):
        service.request_otp("+919876543210")
    service.request_otp("+919876543211")  # different number, must succeed


def test_otp_normalizes_before_storing():
    """Requesting with a bare number and verifying with +91 must be the same OTP."""
    service.request_otp("9876543210")
    from app.shared.cache import get_redis

    assert get_redis().get(f"otp:{hash_phone('+919876543210')}") is not None


# --------------------------------------------------------------------- JWT


def test_access_token_round_trip():
    token, jti, _expires = create_token("11111111-1111-1111-1111-111111111111", "access")
    payload = decode_token(token, expected_type="access")
    assert payload["sub"] == "11111111-1111-1111-1111-111111111111"
    assert payload["jti"] == jti
    assert payload["type"] == "access"


def test_refresh_token_cannot_be_used_as_access_token():
    """Prevents privilege escalation by token-type confusion."""
    refresh, _, _ = create_token("11111111-1111-1111-1111-111111111111", "refresh")
    with pytest.raises(UnauthorizedError, match="Expected a access token"):
        decode_token(refresh, expected_type="access")


def test_tampered_token_rejected():
    token, _, _ = create_token("11111111-1111-1111-1111-111111111111", "access")
    with pytest.raises(UnauthorizedError):
        decode_token(token[:-4] + "AAAA", expected_type="access")


def test_token_signed_with_other_secret_rejected():
    import jwt as pyjwt

    forged = pyjwt.encode(
        {"sub": "x", "type": "access", "jti": "1", "exp": int(time.time()) + 60},
        "attacker-secret",
        algorithm="HS256",
    )
    with pytest.raises(UnauthorizedError):
        decode_token(forged, expected_type="access")


def test_expired_token_rejected(monkeypatch):
    monkeypatch.setattr(settings, "access_token_ttl_minutes", -1)
    token, _, _ = create_token("11111111-1111-1111-1111-111111111111", "access")
    with pytest.raises(UnauthorizedError, match="expired"):
        decode_token(token, expected_type="access")


def test_each_token_has_a_unique_jti():
    """The jti is what makes revocation possible."""
    jtis = {create_token("11111111-1111-1111-1111-111111111111", "access")[1] for _ in range(20)}
    assert len(jtis) == 20


# --------------------------------------------------------------------- revocation


def test_logout_revokes_access_token():
    token, jti, _ = create_token("11111111-1111-1111-1111-111111111111", "access")
    assert not service.is_revoked(jti)
    service.logout(token)
    assert service.is_revoked(jti)


def test_logout_revokes_refresh_token_too():
    access, _, _ = create_token("11111111-1111-1111-1111-111111111111", "access")
    refresh, refresh_jti, _ = create_token("11111111-1111-1111-1111-111111111111", "refresh")
    service.logout(access, refresh)
    assert service.is_revoked(refresh_jti)


def test_logout_with_garbage_token_does_not_raise():
    """Logout is best-effort — an already-expired token is not an error."""
    service.logout("not-a-jwt", "also-not-a-jwt")
