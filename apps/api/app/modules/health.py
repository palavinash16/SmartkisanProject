"""Health and readiness endpoints (§10 API Design, NFR-3.x)."""

from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter
from sqlalchemy import text

from app.config import settings
from app.db.session import engine
from app.schemas import ok
from app.shared.cache import get_redis, is_fallback

router = APIRouter(tags=["system"])

_STARTED_AT = datetime.now(UTC)


@router.get("/health")
def health() -> dict:
    """Liveness. Must stay dependency-free so it answers even when the DB is down."""
    return {"status": "ok", "env": settings.env}


@router.get("/health/deep")
def health_deep() -> dict:
    """Readiness — reports each dependency separately.

    Degraded (not failed) when an optional dependency is unavailable, matching P4:
    the app keeps serving what it can rather than going dark.
    """
    checks: dict[str, dict] = {}

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            postgis = conn.execute(
                text("SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis')")
            ).scalar()
        checks["database"] = {"status": "ok", "postgis": bool(postgis)}
    except Exception as exc:
        checks["database"] = {"status": "error", "error": str(exc)[:200]}

    try:
        get_redis().ping()
        checks["redis"] = {
            "status": "degraded" if is_fallback() else "ok",
            "backend": "in-memory-fallback" if is_fallback() else "redis",
        }
    except Exception as exc:
        checks["redis"] = {"status": "error", "error": str(exc)[:200]}

    # Phase 3+ will register real models here.
    checks["models"] = {"status": "ok", "loaded": []}

    statuses = {c["status"] for c in checks.values()}
    overall = "error" if "error" in statuses else ("degraded" if "degraded" in statuses else "ok")

    return ok(
        {
            "status": overall,
            "checks": checks,
            "uptime_seconds": int((datetime.now(UTC) - _STARTED_AT).total_seconds()),
            "version": "0.1.0",
        },
        source="SmartKisan system",
    )
