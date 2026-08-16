"""Nominatim geocoding tests (FR-1.3), with mocked HTTP.

Verified against the real service on 2026-08-04:
``Karnal, Haryana -> 29.7255766, 76.9106924``.
"""

from __future__ import annotations

import httpx
import pytest
import respx

from app.config import settings
from app.errors import UpstreamUnavailableError
from app.shared.enums import GeocodeConfidence
from app.shared.external import nominatim


@pytest.fixture(autouse=True)
def _no_throttle(monkeypatch):
    """Skip the 1 req/sec politeness delay so tests stay fast."""
    monkeypatch.setattr(settings, "nominatim_min_interval_seconds", 0.0)


def _payload(**overrides) -> list[dict]:
    base = {
        "lat": "29.7255766",
        "lon": "76.9106924",
        "display_name": "Karnal, Haryana, India",
        "osm_type": "relation",
        "addresstype": "state_district",
    }
    base.update(overrides)
    return [base]


@respx.mock
def test_geocodes_a_village():
    respx.get(settings.nominatim_url).mock(
        return_value=httpx.Response(200, json=_payload(addresstype="village"))
    )
    result = nominatim.geocode("Kachhwa", "Karnal", "Haryana")
    assert result is not None
    assert result.latitude == pytest.approx(29.7256, abs=0.001)
    assert result.longitude == pytest.approx(76.9107, abs=0.001)
    assert result.confidence == GeocodeConfidence.VILLAGE


@respx.mock
def test_district_result_is_marked_low_confidence():
    """Weather at a district centroid is not weather at the farmer's field."""
    respx.get(settings.nominatim_url).mock(
        return_value=httpx.Response(200, json=_payload(addresstype="state_district"))
    )
    result = nominatim.geocode("Kachhwa", "Karnal", "Haryana")
    assert result.confidence == GeocodeConfidence.DISTRICT_CENTROID


@respx.mock
def test_falls_back_to_district_when_village_is_unmapped():
    """An unmapped hamlet must still yield usable, clearly-coarse coordinates."""
    route = respx.get(settings.nominatim_url)
    route.side_effect = [
        httpx.Response(200, json=[]),  # village query: no match
        httpx.Response(200, json=_payload()),  # district query: match
    ]
    result = nominatim.geocode("NonexistentVillage", "Karnal", "Haryana")
    assert result is not None
    assert result.confidence == GeocodeConfidence.DISTRICT_CENTROID
    assert route.call_count == 2


@respx.mock
def test_returns_none_when_nothing_matches():
    respx.get(settings.nominatim_url).mock(return_value=httpx.Response(200, json=[]))
    assert nominatim.geocode("Nowhere", "Nowhere", "Nowhere") is None


@respx.mock
def test_rejects_coordinates_outside_india():
    """A result in the wrong country is worse than no result (§6 Data Design)."""
    respx.get(settings.nominatim_url).mock(
        return_value=httpx.Response(200, json=_payload(lat="51.5074", lon="-0.1278"))
    )
    assert nominatim.geocode("London", "London", "England") is None


@respx.mock
def test_upstream_failure_raises_typed_error():
    respx.get(settings.nominatim_url).mock(return_value=httpx.Response(500))
    with pytest.raises(UpstreamUnavailableError) as exc:
        nominatim.geocode("Kachhwa", "Karnal", "Haryana")
    assert exc.value.code == "GEOCODING_FAILED"


@respx.mock
def test_timeout_raises_typed_error():
    respx.get(settings.nominatim_url).mock(side_effect=httpx.ConnectTimeout("timed out"))
    with pytest.raises(UpstreamUnavailableError):
        nominatim.geocode("Kachhwa", "Karnal", "Haryana")


@respx.mock
def test_result_is_cached_so_repeat_lookups_do_not_hit_the_service():
    """Village coordinates do not change; the public service is rate-limited."""
    route = respx.get(settings.nominatim_url).mock(
        return_value=httpx.Response(200, json=_payload(addresstype="village"))
    )
    first = nominatim.geocode("Kachhwa", "Karnal", "Haryana")
    second = nominatim.geocode("Kachhwa", "Karnal", "Haryana")
    assert route.call_count == 1
    assert first == second


@respx.mock
def test_misses_are_cached_too():
    """Repeated lookups of a bad village name must not hammer a rate-limited API."""
    route = respx.get(settings.nominatim_url).mock(return_value=httpx.Response(200, json=[]))
    nominatim.geocode("Nowhere", "Nowhere", "Nowhere")
    calls_after_first = route.call_count
    nominatim.geocode("Nowhere", "Nowhere", "Nowhere")
    assert route.call_count == calls_after_first


@respx.mock
def test_sends_required_user_agent_and_country_filter():
    """Nominatim's usage policy requires a descriptive User-Agent."""
    route = respx.get(settings.nominatim_url).mock(
        return_value=httpx.Response(200, json=_payload())
    )
    nominatim.geocode("Kachhwa", "Karnal", "Haryana")
    request = route.calls[0].request
    assert "SmartKisan" in request.headers["user-agent"]
    assert "countrycodes=in" in str(request.url)


@pytest.mark.parametrize(
    ("lat", "lon", "inside"),
    [
        (28.6, 77.2, True),  # Delhi
        (8.5, 76.9, True),  # Kerala
        (34.0, 74.8, True),  # Srinagar
        (51.5, -0.1, False),  # London
        (40.7, -74.0, False),  # New York
        (0.0, 0.0, False),  # Null Island
    ],
)
def test_india_bounding_box(lat, lon, inside):
    assert nominatim._within_india(lat, lon) is inside


@pytest.mark.parametrize(
    ("osm_type", "addresstype", "expected"),
    [
        ("node", "village", GeocodeConfidence.VILLAGE),
        ("relation", "hamlet", GeocodeConfidence.VILLAGE),
        ("relation", "state_district", GeocodeConfidence.DISTRICT_CENTROID),
        ("node", "building", GeocodeConfidence.EXACT),
        ("way", "unknown", GeocodeConfidence.DISTRICT_CENTROID),
    ],
)
def test_confidence_classification(osm_type, addresstype, expected):
    assert nominatim._classify(osm_type, addresstype) is expected
