"""Redis client with an in-memory fallback.

The fallback keeps the app bootable and unit-testable without Redis running
(P4 — degrade, never fail). Production always uses real Redis; the fallback is
process-local and is not shared across workers.
"""

from __future__ import annotations

import time
from typing import Any

import redis as redis_lib

from app.config import settings
from app.logging_config import get_logger

log = get_logger(__name__)


class _InMemoryCache:
    """Minimal Redis-compatible subset for local dev and tests."""

    def __init__(self) -> None:
        self._data: dict[str, tuple[Any, float | None]] = {}

    def _expired(self, key: str) -> bool:
        entry = self._data.get(key)
        if entry is None:
            return True
        _, expires = entry
        if expires is not None and time.time() > expires:
            del self._data[key]
            return True
        return False

    def get(self, key: str) -> Any:
        return None if self._expired(key) else self._data[key][0]

    def set(self, key: str, value: Any, ex: int | None = None) -> bool:
        self._data[key] = (value, time.time() + ex if ex else None)
        return True

    def setex(self, key: str, ttl: int, value: Any) -> bool:
        return self.set(key, value, ex=ttl)

    def delete(self, *keys: str) -> int:
        return sum(bool(self._data.pop(k, None)) for k in keys)

    def exists(self, key: str) -> int:
        return int(not self._expired(key))

    def incr(self, key: str) -> int:
        current = int(self.get(key) or 0) + 1
        _, expires = self._data.get(key, (None, None))
        self._data[key] = (str(current), expires)
        return current

    def expire(self, key: str, ttl: int) -> bool:
        if self._expired(key):
            return False
        value, _ = self._data[key]
        self._data[key] = (value, time.time() + ttl)
        return True

    def ttl(self, key: str) -> int:
        if self._expired(key):
            return -2
        _, expires = self._data[key]
        return -1 if expires is None else max(0, int(expires - time.time()))

    def keys(self, pattern: str = "*") -> list[str]:
        prefix = pattern.rstrip("*")
        return [k for k in list(self._data) if k.startswith(prefix) and not self._expired(k)]

    def ping(self) -> bool:
        return True

    def flushdb(self) -> bool:
        self._data.clear()
        return True


_client: Any = None
_is_fallback = False
#: Once we know Redis is unreachable, stop re-attempting the TCP connect on every
#: call. Without this, a suite that resets the client between tests pays the full
#: connect timeout hundreds of times.
_probed = False


def get_redis() -> Any:
    global _client, _is_fallback, _probed
    if _client is not None:
        return _client

    if _probed and _is_fallback:
        _client = _InMemoryCache()
        return _client

    _probed = True
    try:
        client = redis_lib.from_url(
            settings.redis_url, decode_responses=True, socket_connect_timeout=2
        )
        client.ping()
        _client = client
        log.info("redis.connected", url=settings.redis_url.split("@")[-1])
    except Exception as exc:
        log.warning("redis.unavailable_using_memory_fallback", error=str(exc))
        _client = _InMemoryCache()
        _is_fallback = True
    return _client


def is_fallback() -> bool:
    """True when running on the in-memory cache. Surfaced by /health/deep."""
    get_redis()
    return _is_fallback


def reset_redis(*, reprobe: bool = False) -> None:
    """Drop the cached client.

    `reprobe=False` (default) keeps a previously-determined fallback decision, so
    repeated resets in a test suite do not re-pay the connection timeout.
    """
    global _client, _is_fallback, _probed
    _client = None
    if reprobe:
        _is_fallback = False
        _probed = False
