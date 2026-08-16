"""Application configuration.

All settings come from environment variables (NFR-4.7 — no secrets in code).
See .env.example for the full list.
"""

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # ---------------------------------------------------------------- app
    env: Literal["dev", "test", "staging", "prod"] = "dev"
    debug: bool = False
    app_name: str = "SmartKisan API"
    api_prefix: str = "/api/v1"

    # ---------------------------------------------------------------- database
    database_url: str = "postgresql+psycopg://smartkisan:smartkisan@localhost:5432/smartkisan"
    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_echo: bool = False
    #: Fail fast rather than hanging on a TCP connect when Postgres is down.
    db_connect_timeout_seconds: int = 3

    # ---------------------------------------------------------------- redis
    redis_url: str = "redis://localhost:6379/0"

    # ---------------------------------------------------------------- auth (NFR-4.2)
    jwt_secret: str = "dev-only-insecure-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_ttl_minutes: int = 15
    refresh_token_ttl_days: int = 30

    otp_length: int = 6
    otp_ttl_seconds: int = 300
    otp_max_attempts: int = 5

    # ---------------------------------------------------------------- rate limits (NFR-4.5)
    rate_limit_default_per_minute: int = 120
    rate_limit_otp_per_minute: int = 10
    rate_limit_otp_per_hour_per_phone: int = 3

    # ---------------------------------------------------------------- external APIs
    # data.gov.in AGMARKNET — verified live 2026-08-04, 16,942 records/day
    datagovin_api_key: str = ""
    datagovin_base_url: str = "https://api.data.gov.in"
    agmarknet_resource_id: str = "9ef84268-d588-465a-a308-a864a43d0070"

    # Open-Meteo — no key required
    openmeteo_forecast_url: str = "https://api.open-meteo.com/v1/forecast"
    openmeteo_archive_url: str = "https://archive-api.open-meteo.com/v1/archive"

    # Nominatim — requires a descriptive User-Agent per its usage policy
    nominatim_url: str = "https://nominatim.openstreetmap.org/search"
    nominatim_user_agent: str = "SmartKisan/0.1 (agri advisory; contact@smartkisan.in)"
    nominatim_min_interval_seconds: float = 1.0

    external_timeout_seconds: float = 20.0

    # ---------------------------------------------------------------- cache TTLs
    # See §6.2 System Design for the rationale behind each window.
    cache_ttl_prices_seconds: int = 6 * 3600
    cache_ttl_weather_seconds: int = 3 * 3600
    cache_ttl_geocode_seconds: int = 90 * 24 * 3600
    cache_ttl_reference_seconds: int = 24 * 3600

    # ---------------------------------------------------------------- cors
    # `NoDecode` stops pydantic-settings from JSON-parsing the dotenv value
    # first — without it, `CORS_ORIGINS=a,b` raises before the validator below
    # ever sees the string.
    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"]
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, v: object) -> object:
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v

    @property
    def is_production(self) -> bool:
        return self.env in ("staging", "prod")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.is_production:
        if "dev-only" in settings.jwt_secret:
            raise RuntimeError("JWT_SECRET must be set to a real secret in production")
        # HS256 keys shorter than the 32-byte digest size weaken the signature (RFC 7518 §3.2).
        if len(settings.jwt_secret.encode()) < 32:
            raise RuntimeError("JWT_SECRET must be at least 32 bytes")
    return settings


settings = get_settings()
