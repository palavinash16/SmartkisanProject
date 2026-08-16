"""FastAPI application entry point."""

from __future__ import annotations

import time
import uuid
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.errors import AppError, RateLimitedError, localize
from app.logging_config import configure_logging, get_logger, request_id_ctx
from app.modules.auth.router import router as auth_router
from app.modules.crop_school.router import router as crop_school_router
from app.modules.gap_crop.router import router as gap_crop_router
from app.modules.health import router as health_router
from app.modules.mandi.router import router as mandi_router
from app.modules.profile.router import router as profile_router
from app.modules.weather.router import router as weather_router

configure_logging()
log = get_logger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    log.info("app.starting", env=settings.env, version="0.1.0")
    yield
    log.info("app.stopping")


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "Farmer Decision Support Platform.\n\n"
        "Every response carries a `meta` block naming the data's source and age — "
        "the client must always be able to tell the farmer where a number came from."
    ),
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "Retry-After"],
)


@app.middleware("http")
async def request_context(
    request: Request, call_next: Callable[[Request], Awaitable]
) -> JSONResponse:
    """Attach a correlation ID and log timing for every request."""
    request_id = request.headers.get("X-Request-ID") or f"req_{uuid.uuid4().hex[:16]}"
    request_id_ctx.set(request_id)
    request.state.request_id = request_id

    started = time.perf_counter()
    response = await call_next(request)
    duration_ms = int((time.perf_counter() - started) * 1000)

    response.headers["X-Request-ID"] = request_id

    # Health checks are noisy and uninteresting unless they fail.
    if not request.url.path.startswith("/health") or response.status_code >= 400:
        log.info(
            "http.request",
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            duration_ms=duration_ms,
        )
    return response


def _language_of(request: Request) -> str:
    header = request.headers.get("accept-language", "")
    supported = {"hi", "pa", "mr", "bn", "bho", "en"}
    for part in header.split(","):
        code = part.split(";")[0].strip().split("-")[0].lower()
        if code in supported:
            return code
    return "hi"


def _error_response(
    request: Request, status_code: int, code: str, message: str, details: dict | None = None
) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    payload = {
        "error": {
            "code": code,
            "message": message,
            "message_localized": localize(code, message, _language_of(request)),
            "details": details or {},
            "request_id": request_id,
        }
    }
    headers = {"X-Request-ID": request_id} if request_id else {}
    return JSONResponse(status_code=status_code, content=payload, headers=headers)


@app.exception_handler(AppError)
async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
    if exc.status_code >= 500:
        log.error("app.error", code=exc.code, message=exc.message, exc_info=exc)
    else:
        log.info("app.client_error", code=exc.code, message=exc.message)

    response = _error_response(request, exc.status_code, exc.code, exc.message, exc.details)
    if isinstance(exc, RateLimitedError):
        response.headers["Retry-After"] = str(exc.retry_after)
    return response


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    fields = [
        {"field": ".".join(str(p) for p in err["loc"][1:]), "message": err["msg"]}
        for err in exc.errors()
    ]
    return _error_response(
        request, 400, "VALIDATION_ERROR", "Request validation failed", {"fields": fields}
    )


@app.exception_handler(StarletteHTTPException)
async def handle_http_exception(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    codes = {401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT_FOUND", 405: "METHOD_NOT_ALLOWED"}
    code = codes.get(exc.status_code, "HTTP_ERROR")
    return _error_response(request, exc.status_code, code, str(exc.detail))


@app.exception_handler(Exception)
async def handle_unexpected(request: Request, exc: Exception) -> JSONResponse:
    log.error("app.unhandled_exception", exc_info=exc)
    # Never leak internals to the client (NFR-4.x).
    return _error_response(request, 500, "INTERNAL_ERROR", "An unexpected error occurred")


app.include_router(health_router)
app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(profile_router, prefix=settings.api_prefix)
app.include_router(gap_crop_router)
app.include_router(mandi_router)
app.include_router(weather_router)
app.include_router(crop_school_router)


@app.get("/", include_in_schema=False)
def root() -> dict:
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
    }
