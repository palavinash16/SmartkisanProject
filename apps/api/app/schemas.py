"""Response envelope with mandatory provenance (§1.1 API Design).

Every response carries `meta` so the client can always tell the farmer where a
number came from and how old it is. This is design principle P5 made structural:
provenance is not optional, it is part of the type.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class Meta(BaseModel):
    """Provenance for the accompanying `data`."""

    source: str = Field(description="Human-readable origin, shown in the UI")
    data_as_of: datetime | None = Field(
        default=None, description="When the underlying data was produced (not when we served it)"
    )
    is_stale: bool = Field(
        default=False, description="True when serving cache beyond its freshness window (P4)"
    )
    model_version: str | None = Field(
        default=None, description="Set whenever an ML model produced any part of `data`"
    )
    computed_in_ms: int | None = None
    request_id: str | None = None

    @classmethod
    def internal(cls, source: str = "SmartKisan", **kw: Any) -> Meta:
        """Provenance for data computed entirely in-house from stored records."""
        return cls(source=source, data_as_of=datetime.now(UTC), **kw)


class Envelope(BaseModel, Generic[T]):
    """Standard success response: `{"data": ..., "meta": ...}`."""

    data: T
    meta: Meta


class ErrorDetail(BaseModel):
    code: str
    message: str
    message_localized: str
    details: dict[str, Any] = Field(default_factory=dict)
    request_id: str | None = None


class ErrorEnvelope(BaseModel):
    error: ErrorDetail


def ok(data: T, meta: Meta | None = None, **meta_kw: Any) -> dict[str, Any]:
    """Build a success envelope.

    >>> ok({"x": 1}, source="AGMARKNET via data.gov.in")
    """
    if meta is None:
        meta = Meta.internal(**meta_kw) if meta_kw else Meta.internal()
    return {"data": data, "meta": meta}
