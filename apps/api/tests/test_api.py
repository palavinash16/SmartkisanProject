"""API surface tests.

Endpoint tests that need PostgreSQL are marked `requires_db`; the rest verify
routing, the error envelope, and validation without a database.
"""

from __future__ import annotations

import pytest

from tests.conftest import requires_db

# --------------------------------------------------------------------- basics


def test_root(client):
    body = client.get("/").json()
    assert body["name"] == "SmartKisan API"
    assert body["docs"] == "/docs"


def test_health_is_dependency_free(client):
    """Liveness must answer even when the database is down."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_openapi_schema_generates(client):
    schema = client.get("/openapi.json").json()
    assert schema["info"]["title"] == "SmartKisan API"
    paths = schema["paths"]
    for expected in (
        "/api/v1/auth/otp/request",
        "/api/v1/auth/otp/verify",
        "/api/v1/me",
        "/api/v1/farms",
        "/api/v1/reference/land-units",
    ):
        assert expected in paths, f"{expected} missing from OpenAPI"


def test_every_response_carries_a_request_id(client):
    response = client.get("/health")
    assert response.headers["X-Request-ID"].startswith("req_")


def test_supplied_request_id_is_echoed(client):
    """Lets a client correlate its own logs with ours."""
    response = client.get("/health", headers={"X-Request-ID": "req_client_123"})
    assert response.headers["X-Request-ID"] == "req_client_123"


# --------------------------------------------------------------------- error envelope


def test_404_uses_error_envelope(client):
    body = client.get("/api/v1/does-not-exist").json()
    assert body["error"]["code"] == "NOT_FOUND"
    assert body["error"]["message_localized"]
    assert body["error"]["request_id"]


def test_error_message_is_localized_per_accept_language(client):
    hindi = client.get("/api/v1/nope", headers={"Accept-Language": "hi"}).json()
    punjabi = client.get("/api/v1/nope", headers={"Accept-Language": "pa"}).json()
    assert hindi["error"]["message_localized"] == "जानकारी नहीं मिली"
    assert punjabi["error"]["message_localized"] == "ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ"


def test_validation_error_names_the_failing_fields(client):
    response = client.post("/api/v1/auth/otp/verify", json={"phone": "+919876543210"})
    assert response.status_code == 400
    error = response.json()["error"]
    assert error["code"] == "VALIDATION_ERROR"
    assert any(f["field"] == "otp" for f in error["details"]["fields"])


def test_invalid_phone_returns_400_with_code(client):
    response = client.post("/api/v1/auth/otp/request", json={"phone": "123"})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "INVALID_PHONE"


@pytest.mark.parametrize(
    ("lang", "expected"), [("hi", "मोबाइल"), ("pa", "ਮੋਬਾਈਲ"), ("mr", "मोबाईल")]
)
def test_invalid_phone_error_is_localized(client, lang, expected):
    """A farmer entering a wrong number must not be shown English (FR-8.1)."""
    response = client.post(
        "/api/v1/auth/otp/request",
        json={"phone": "123"},
        headers={"Accept-Language": lang},
    )
    assert expected in response.json()["error"]["message_localized"]


def test_farmer_facing_error_codes_are_all_translated():
    """Guards against adding an error code without its Hindi text.

    An untranslated code silently falls back to English, which our persona
    cannot read — so this is a real defect, not a cosmetic one.
    """
    from app.errors import _LOCALIZED

    # Codes a farmer can actually trigger through normal use.
    farmer_facing = {
        "VALIDATION_ERROR",
        "UNAUTHORIZED",
        "FORBIDDEN",
        "NOT_FOUND",
        "FARM_NOT_FOUND",
        "PLOT_NOT_FOUND",
        "RATE_LIMITED",
        "OTP_INVALID",
        "OTP_EXPIRED",
        "INVALID_PHONE",
        "INVALID_LAND_UNIT",
        "GEOCODING_FAILED",
        "TOKEN_EXPIRED",
        "UPSTREAM_UNAVAILABLE",
        "INTERNAL_ERROR",
    }
    missing = [code for code in farmer_facing if not _LOCALIZED.get(code, {}).get("hi")]
    assert not missing, f"Error codes with no Hindi translation: {missing}"


# --------------------------------------------------------------------- auth guard


@pytest.mark.parametrize(
    ("method", "path"),
    [
        ("get", "/api/v1/me"),
        ("patch", "/api/v1/me"),
        ("get", "/api/v1/farms"),
        ("post", "/api/v1/farms"),
    ],
)
def test_protected_endpoints_require_a_token(client, method, path):
    kwargs = {"json": {}} if method in ("post", "patch") else {}
    response = getattr(client, method)(path, **kwargs)
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"


def test_garbage_token_rejected(client):
    response = client.get("/api/v1/me", headers={"Authorization": "Bearer not-a-jwt"})
    assert response.status_code == 401


# --------------------------------------------------------------------- OTP flow


def test_otp_request_returns_debug_code_in_dev(client, phone):
    """Dev returns the OTP so the flow is testable before SMS is wired up."""
    body = client.post("/api/v1/auth/otp/request", json={"phone": phone}).json()
    assert body["data"]["otp_sent"] is True
    assert body["data"]["debug_otp"].isdigit()
    assert body["meta"]["source"]


def test_otp_rate_limit_returns_429_with_retry_after(client, phone):
    for _ in range(3):
        client.post("/api/v1/auth/otp/request", json={"phone": phone})
    response = client.post("/api/v1/auth/otp/request", json={"phone": phone})
    assert response.status_code == 429
    assert response.json()["error"]["code"] == "RATE_LIMITED"
    assert int(response.headers["Retry-After"]) > 0


def test_verify_without_requesting_fails(client, phone):
    response = client.post("/api/v1/auth/otp/verify", json={"phone": phone, "otp": "123456"})
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "OTP_EXPIRED"


# --------------------------------------------------------------------- reference data


def test_land_units_for_up_lead_with_bigha(client):
    """A farmer in UP thinks in bigha, not hectares (FR-1.5)."""
    body = client.get("/api/v1/reference/land-units?state=Uttar Pradesh").json()
    units = body["data"]
    assert units[0]["code"] == "bigha"
    assert units[0]["acres_per_unit"] == 0.625
    assert "Uttar Pradesh" in units[0]["note"]


def test_land_units_are_state_specific(client):
    """The same unit name means different areas in different states."""
    up = client.get("/api/v1/reference/land-units?state=Uttar Pradesh").json()["data"]
    hr = client.get("/api/v1/reference/land-units?state=Haryana").json()["data"]
    up_bigha = next(u for u in up if u["code"] == "bigha")["acres_per_unit"]
    hr_bigha = next(u for u in hr if u["code"] == "bigha")["acres_per_unit"]
    assert up_bigha == 0.625
    assert hr_bigha == 0.25


def test_land_units_without_state_returns_universal_only(client):
    codes = [u["code"] for u in client.get("/api/v1/reference/land-units").json()["data"]]
    assert "bigha" not in codes
    assert "acre" in codes


def test_options_endpoint_returns_localized_labels(client):
    data = client.get("/api/v1/reference/options").json()["data"]
    alluvial = next(s for s in data["soil_types"] if s["code"] == "alluvial")
    assert alluvial["label"] == "जलोढ़ मिट्टी"
    tubewell = next(i for i in data["irrigation_sources"] if i["code"] == "tubewell")
    assert tubewell["label"] == "ट्यूबवेल"


# --------------------------------------------------------------------- provenance (P5)


def test_every_success_response_carries_provenance(client):
    """§1.1 API Design — the client must always be able to say where data came from."""
    for path in ("/api/v1/reference/land-units", "/api/v1/reference/options"):
        meta = client.get(path).json()["meta"]
        assert meta["source"], f"{path} has no source"
        assert "is_stale" in meta
        assert meta["data_as_of"]


def test_reference_responses_declare_no_model_version(client):
    """Absence of model_version is the guarantee that no model was involved."""
    meta = client.get("/api/v1/reference/land-units").json()["meta"]
    assert meta["model_version"] is None


# --------------------------------------------------------------------- full journey


@requires_db
def test_full_onboarding_journey(client, phone):
    """Register -> farm -> plot, with the unit conversion echoed back (FR-1.1-1.5)."""
    requested = client.post("/api/v1/auth/otp/request", json={"phone": phone}).json()
    otp = requested["data"]["debug_otp"]

    verified = client.post("/api/v1/auth/otp/verify", json={"phone": phone, "otp": otp}).json()[
        "data"
    ]
    assert verified["is_new_user"] is True
    auth = {"Authorization": f"Bearer {verified['access_token']}"}

    me = client.get("/api/v1/me", headers=auth).json()["data"]
    assert me["phone_masked"] == "+91987****210"

    farm = client.post(
        "/api/v1/farms",
        json={"village": "Kachhwa", "district": "Karnal", "state": "Haryana"},
        headers=auth,
    ).json()["data"]
    assert farm["district"] == "Karnal"

    plot = client.post(
        f"/api/v1/farms/{farm['id']}/plots",
        json={
            "area_input_value": 5,
            "area_input_unit": "bigha",
            "soil_type": "alluvial",
            "irrigation_source": "tubewell",
        },
        headers=auth,
    ).json()["data"]

    # 5 bigha in Haryana = 1.25 acres, NOT the 3.125 it would be in UP (risk R9).
    assert float(plot["area_acres"]) == 1.25
    assert plot["area_display"] == "5 बीघा = 1.25 एकड़"
    assert plot["soil_type_label"] == "जलोढ़ मिट्टी"


@requires_db
def test_farmer_cannot_access_another_farmers_farm(client):
    """Ownership comes from the token, never from the request (NFR-4.x)."""

    def login(number: str) -> dict:
        otp = client.post("/api/v1/auth/otp/request", json={"phone": number}).json()["data"][
            "debug_otp"
        ]
        token = client.post("/api/v1/auth/otp/verify", json={"phone": number, "otp": otp}).json()[
            "data"
        ]["access_token"]
        return {"Authorization": f"Bearer {token}"}

    alice = login("+919000000001")
    bob = login("+919000000002")

    bob_farm = client.post(
        "/api/v1/farms",
        json={"village": "Rampur", "district": "Ludhiana", "state": "Punjab"},
        headers=bob,
    ).json()["data"]

    response = client.get(f"/api/v1/farms/{bob_farm['id']}", headers=alice)
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "FARM_NOT_FOUND"


@requires_db
def test_second_login_is_not_a_new_user(client, phone):
    for expected_new in (True, False):
        otp = client.post("/api/v1/auth/otp/request", json={"phone": phone}).json()["data"][
            "debug_otp"
        ]
        body = client.post("/api/v1/auth/otp/verify", json={"phone": phone, "otp": otp}).json()[
            "data"
        ]
        assert body["is_new_user"] is expected_new
