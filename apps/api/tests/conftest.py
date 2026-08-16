"""Shared test fixtures.

Tests that need PostgreSQL are marked `@pytest.mark.integration` and skip
automatically when no database is reachable, so the pure-logic suite (which
includes the safety-critical land converter and auth crypto) runs anywhere.
"""

from __future__ import annotations

import os

import pytest

os.environ.setdefault("ENV", "test")
# ≥32 bytes — HS256 keys shorter than the digest size weaken the signature.
os.environ.setdefault("JWT_SECRET", "test-secret-not-for-production-0123456789abcdef")

from fastapi.testclient import TestClient

from app.main import app
from app.shared.cache import get_redis, reset_redis


def _database_available() -> bool:
    try:
        from sqlalchemy import text

        from app.db.session import engine

        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


DATABASE_AVAILABLE = _database_available()

requires_db = pytest.mark.skipif(
    not DATABASE_AVAILABLE,
    reason="PostgreSQL not reachable — start it with `docker compose up -d postgres`",
)


@pytest.fixture(autouse=True)
def _clean_cache():
    """Isolate cache state between tests (OTPs, rate limits, revocations)."""
    reset_redis()
    redis = get_redis()
    redis.flushdb()
    yield
    redis.flushdb()
    reset_redis()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app, raise_server_exceptions=False)


@pytest.fixture
def phone() -> str:
    return "+919876543210"
