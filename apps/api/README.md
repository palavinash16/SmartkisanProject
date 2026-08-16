# SmartKisan API

FastAPI backend. See [`../../docs/`](../../docs/) for the full design.

---

## Quick start

### With Docker (recommended)

```bash
cp .env.example .env
cd ../../infra && docker compose up
```

Brings up Postgres+PostGIS, Redis, MinIO, and the API. Migrations run on boot.
API at http://localhost:8000, interactive docs at http://localhost:8000/docs.

### Without Docker

You need PostgreSQL 16 with PostGIS and pgvector. Redis is optional — the app
falls back to an in-memory cache and reports `degraded` on `/health/deep`.

```bash
python -m venv .venv
.venv/Scripts/activate          # Windows
# source .venv/bin/activate     # macOS / Linux

pip install -e ".[dev]"
cp .env.example .env            # then set DATABASE_URL

alembic upgrade head
uvicorn app.main:app --reload
```

---

## Layout

```
app/
├── main.py              # app factory, middleware, exception handlers
├── config.py            # settings from env (pydantic-settings)
├── deps.py              # auth + ownership dependencies
├── errors.py            # error taxonomy + localized messages
├── schemas.py           # response envelope with provenance
├── logging_config.py    # structlog + request correlation IDs
├── db/                  # engine, session, declarative base
├── shared/
│   ├── land_units.py    # ⚠ state-aware conversion — 100% coverage required
│   ├── security.py      # JWT, OTP hashing, phone encryption
│   ├── cache.py         # Redis with in-memory fallback
│   ├── enums.py         # soil, irrigation, language vocabularies
│   └── external/        # third-party clients (Nominatim, …)
├── modules/
│   ├── auth/            # OTP login, JWT rotation
│   ├── profile/         # farmer, farm, plot, soil test
│   └── health.py
└── migrations/          # Alembic
```

Each module keeps the same internal shape: `router` (HTTP only) → `service`
(decisions) → `repository`/`models` (data). A module may call another module's
service, never its tables.

---

## Testing

```bash
pytest                      # full suite
pytest -m "not integration" # skip anything needing Postgres
pytest --cov=app --cov-report=term-missing
```

Tests needing a database are marked and **skip automatically** when Postgres is
unreachable, so the pure-logic suite runs anywhere.

### Coverage bars

| Module | Bar | Why |
|---|---|---|
| `shared/land_units.py` | **100%** | Risk R9 — a wrong factor silently corrupts every rupee figure |
| `shared/security.py` | 90% | Auth boundary |
| Rule engines (Phase 2+) | 90% | An invalid recommendation costs a farmer their season |
| Overall | 70% | NFR-7.1 |

---

## Two things worth knowing before you edit

### 1. Land conversion has no default

`bigha` means different areas in different states — 0.25 acre in Haryana,
0.625 in UP, 0.6172 in Bihar. `get_factor()` **raises** for an unknown
`(unit, state)` pair rather than guessing, and the API echoes the conversion back
(`"5 बीघा = 1.25 एकड़"`) so the farmer can catch a mistake before it propagates.

Never add a fallback factor. That is the R9 failure mode.

### 2. Every response carries provenance

```json
{
  "data": { },
  "meta": {
    "source": "AGMARKNET via data.gov.in",
    "data_as_of": "2026-08-04T12:00:46Z",
    "is_stale": false,
    "model_version": "price-forecast-v1.3.0"
  }
}
```

Use `app.schemas.ok(data, source=...)` to build responses. `model_version` must
be set whenever a model produced any part of `data` — and its **absence is a
guarantee** that no model was involved (this is what makes scheme eligibility
verifiably deterministic, FR-5.2).

---

## Migrations

```bash
alembic upgrade head
alembic revision --autogenerate -m "add crop table"
alembic downgrade -1
alembic check                    # fails if models drifted from migrations
```

CI runs `upgrade → downgrade base → upgrade` to prove migrations are reversible;
a one-way migration cannot be rolled back after a bad deploy.

---

## Environment

See [`.env.example`](.env.example). Notable entries:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Postgres with PostGIS + pgvector |
| `REDIS_URL` | Optional in dev — falls back to in-memory |
| `JWT_SECRET` | ≥32 bytes. The app **refuses to start** in production otherwise |
| `DATAGOVIN_API_KEY` | Free from data.gov.in. Phase 1 (mandi ingestion) |
| `NOMINATIM_USER_AGENT` | Their policy requires a real contact address |

---

## Phase 0 status

| Requirement | Status |
|---|---|
| FR-1.1 OTP login + JWT rotation | ✅ |
| FR-1.2 Farmer profile | ✅ |
| FR-1.3 Geocoding + confidence | ✅ |
| FR-1.4 Farm/plot registration | ✅ |
| FR-1.5 State-aware land conversion | ✅ |
| FR-1.6 Soil Health Card values | ✅ |
| NFR-3.2 Degrade, never fail | ✅ Redis fallback, health reports degraded |
| NFR-4.2 JWT rotation + revocation | ✅ |
| NFR-4.3 PII encryption | ⚠️ Obfuscated — **swap to AES-GCM + KMS before real farmer data** |
| NFR-4.5 Rate limiting | ⚠️ OTP only; general limiter is Phase 6 |

**Next (Phase 1):** AGMARKNET ingestion, Open-Meteo client, mandi endpoints —
then `mockData.js` loses its price and weather blocks.
