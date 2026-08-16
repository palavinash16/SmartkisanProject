"""Nominatim geocoding client (FR-1.3).

Verified live 2026-08-04: ``Karnal, Haryana → 29.7256, 76.9107``.

Nominatim's usage policy requires a descriptive User-Agent and at most 1 request
per second. We honour both, and cache aggressively — village coordinates do not
change, so a 90-day TTL is generous rather than risky.
"""

from __future__ import annotations

import json
import threading
import time
from dataclasses import dataclass

import httpx

from app.config import settings
from app.errors import UpstreamUnavailableError
from app.logging_config import get_logger
from app.shared.cache import get_redis
from app.shared.enums import GeocodeConfidence

log = get_logger(__name__)

_CACHE_KEY = "geocode:{query}"

#: India bounding box — rejects results that land outside the country (§6 Data Design).
INDIA_BBOX = (68.0, 6.0, 98.0, 38.0)  # min_lon, min_lat, max_lon, max_lat

_rate_lock = threading.Lock()
_last_request_at = 0.0


@dataclass(frozen=True, slots=True)
class GeocodeResult:
    latitude: float
    longitude: float
    display_name: str
    confidence: GeocodeConfidence
    source: str = "nominatim"


def _within_india(lat: float, lon: float) -> bool:
    min_lon, min_lat, max_lon, max_lat = INDIA_BBOX
    return min_lat <= lat <= max_lat and min_lon <= lon <= max_lon


def _throttle() -> None:
    """Enforce Nominatim's 1 req/sec policy across threads."""
    global _last_request_at
    with _rate_lock:
        elapsed = time.monotonic() - _last_request_at
        if elapsed < settings.nominatim_min_interval_seconds:
            time.sleep(settings.nominatim_min_interval_seconds - elapsed)
        _last_request_at = time.monotonic()


def _classify(osm_type: str, addresstype: str) -> GeocodeConfidence:
    """Map Nominatim's result type to how much we should trust the coordinates.

    This drives the UI prompt: a district centroid is not the farmer's field, so
    we ask them to drop a pin (FR-1.3).
    """
    if addresstype in ("village", "hamlet", "town", "suburb"):
        return GeocodeConfidence.VILLAGE
    if addresstype in ("state_district", "county", "district"):
        return GeocodeConfidence.DISTRICT_CENTROID
    if osm_type == "node":
        return GeocodeConfidence.EXACT
    return GeocodeConfidence.DISTRICT_CENTROID


def geocode(
    village: str, district: str, state: str, *, country: str = "India"
) -> GeocodeResult | None:
    """Resolve a place to coordinates.

    Tries the full village query first, then falls back to district level so a
    farmer in an unmapped hamlet still gets usable (if coarse) coordinates.

    Returns None when nothing matches; raises only when the service itself is
    unreachable and no cache exists.
    """
    attempts = [
        (f"{village}, {district}, {state}, {country}", False),
        (f"{district}, {state}, {country}", True),
    ]

    for query, is_fallback in attempts:
        result = _geocode_query(query)
        if result is None:
            continue
        if is_fallback:
            # Coarse by construction — force the pin-correction prompt.
            result = GeocodeResult(
                latitude=result.latitude,
                longitude=result.longitude,
                display_name=result.display_name,
                confidence=GeocodeConfidence.DISTRICT_CENTROID,
            )
        return result

    return None


def _geocode_query(query: str) -> GeocodeResult | None:
    redis = get_redis()
    cache_key = _CACHE_KEY.format(query=query.lower().replace(" ", "_"))

    if cached := redis.get(cache_key):
        data = json.loads(cached)
        if data.get("_miss"):
            return None
        return GeocodeResult(
            latitude=data["latitude"],
            longitude=data["longitude"],
            display_name=data["display_name"],
            confidence=GeocodeConfidence(data["confidence"]),
        )

    _throttle()

    try:
        response = httpx.get(
            settings.nominatim_url,
            params={"q": query, "format": "json", "limit": 1, "countrycodes": "in"},
            headers={"User-Agent": settings.nominatim_user_agent},
            timeout=settings.external_timeout_seconds,
        )
        response.raise_for_status()
        results = response.json()
    except Exception as exc:
        log.warning("geocode.failed", query=query, error=str(exc))
        raise UpstreamUnavailableError(
            "Geocoding service unavailable", code="GEOCODING_FAILED"
        ) from exc

    if not results:
        # Cache misses too, briefly — repeated lookups of a bad village name
        # should not repeatedly hit a rate-limited public service.
        redis.setex(cache_key, 3600, json.dumps({"_miss": True}))
        return None

    top = results[0]
    lat, lon = float(top["lat"]), float(top["lon"])

    if not _within_india(lat, lon):
        log.warning("geocode.outside_india", query=query, lat=lat, lon=lon)
        return None

    result = GeocodeResult(
        latitude=lat,
        longitude=lon,
        display_name=top.get("display_name", query),
        confidence=_classify(top.get("osm_type", ""), top.get("addresstype", "")),
    )

    redis.setex(
        cache_key,
        settings.cache_ttl_geocode_seconds,
        json.dumps(
            {
                "latitude": result.latitude,
                "longitude": result.longitude,
                "display_name": result.display_name,
                "confidence": result.confidence.value,
            }
        ),
    )
    return result
