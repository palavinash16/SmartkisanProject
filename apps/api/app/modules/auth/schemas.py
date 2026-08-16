"""Auth request/response schemas."""

from __future__ import annotations

from pydantic import BaseModel, Field


class OTPRequestIn(BaseModel):
    phone: str = Field(description="10-digit Indian mobile, with or without +91")


class OTPRequestOut(BaseModel):
    otp_sent: bool
    expires_in: int
    retry_after: int = 60
    # Dev convenience only — never populated when env is staging/prod.
    debug_otp: str | None = None


class OTPVerifyIn(BaseModel):
    phone: str
    otp: str = Field(min_length=4, max_length=8)


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    is_new_user: bool


class RefreshIn(BaseModel):
    refresh_token: str


class LogoutIn(BaseModel):
    refresh_token: str | None = None


class LogoutOut(BaseModel):
    logged_out: bool = True
