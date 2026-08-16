"""Error taxonomy and the error envelope (§1.2 API Design).

Every failure returns:

    {"error": {"code", "message", "message_localized", "details", "request_id"}}

`message_localized` exists because the farmer reads the error, not the developer.
"""

from __future__ import annotations

from typing import Any

#: Localized error text, keyed by code then language.
#: English falls back to `message` when a code is missing here.
_LOCALIZED: dict[str, dict[str, str]] = {
    "VALIDATION_ERROR": {
        "hi": "दी गई जानकारी सही नहीं है",
        "pa": "ਦਿੱਤੀ ਗਈ ਜਾਣਕਾਰੀ ਸਹੀ ਨਹੀਂ ਹੈ",
        "mr": "दिलेली माहिती बरोबर नाही",
    },
    "UNAUTHORIZED": {
        "hi": "कृपया दोबारा लॉग इन करें",
        "pa": "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਲਾਗਇਨ ਕਰੋ",
        "mr": "कृपया पुन्हा लॉग इन करा",
    },
    "FORBIDDEN": {
        "hi": "आपको इसकी अनुमति नहीं है",
        "pa": "ਤੁਹਾਨੂੰ ਇਸਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਹੈ",
        "mr": "तुम्हाला याची परवानगी नाही",
    },
    "NOT_FOUND": {
        "hi": "जानकारी नहीं मिली",
        "pa": "ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ",
        "mr": "माहिती सापडली नाही",
    },
    "PLOT_NOT_FOUND": {"hi": "खेत का टुकड़ा नहीं मिला", "mr": "शेताचा तुकडा सापडला नाही"},
    "RATE_LIMITED": {
        "hi": "बहुत ज़्यादा कोशिशें — थोड़ी देर बाद कोशिश करें",
        "pa": "ਬਹੁਤ ਜ਼ਿਆਦਾ ਕੋਸ਼ਿਸ਼ਾਂ — ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
        "mr": "खूप जास्त प्रयत्न — थोड्या वेळाने प्रयत्न करा",
    },
    "OTP_INVALID": {
        "hi": "OTP गलत है — दोबारा जांचें",
        "pa": "OTP ਗਲਤ ਹੈ — ਦੁਬਾਰਾ ਜਾਂਚੋ",
        "mr": "OTP चुकीचा आहे — पुन्हा तपासा",
    },
    "INVALID_PHONE": {
        "hi": "सही 10 अंकों का मोबाइल नंबर डालें",
        "pa": "ਸਹੀ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਪਾਓ",
        "mr": "योग्य 10 अंकी मोबाईल नंबर टाका",
    },
    "TOKEN_EXPIRED": {
        "hi": "सत्र समाप्त हो गया — दोबारा लॉग इन करें",
        "pa": "ਸੈਸ਼ਨ ਖ਼ਤਮ ਹੋ ਗਿਆ — ਦੁਬਾਰਾ ਲਾਗਇਨ ਕਰੋ",
        "mr": "सत्र संपले — पुन्हा लॉग इन करा",
    },
    "TOKEN_REVOKED": {
        "hi": "सत्र समाप्त हो गया — दोबारा लॉग इन करें",
        "mr": "सत्र संपले — पुन्हा लॉग इन करा",
    },
    "TOKEN_REUSED": {
        "hi": "सुरक्षा कारणों से लॉग आउट किया गया — दोबारा लॉग इन करें",
        "mr": "सुरक्षेच्या कारणास्तव लॉग आउट — पुन्हा लॉग इन करा",
    },
    "ACCOUNT_INACTIVE": {
        "hi": "यह खाता बंद है — सहायता से संपर्क करें",
        "mr": "हे खाते बंद आहे — मदतीसाठी संपर्क करा",
    },
    "FARM_NOT_FOUND": {
        "hi": "खेत नहीं मिला",
        "pa": "ਖੇਤ ਨਹੀਂ ਮਿਲਿਆ",
        "mr": "शेत सापडले नाही",
    },
    "OTP_EXPIRED": {"hi": "OTP की समय सीमा खत्म — नया OTP मंगाएं", "mr": "OTP ची मुदत संपली"},
    "INVALID_LAND_UNIT": {
        "hi": "यह भूमि इकाई इस राज्य में उपलब्ध नहीं है",
        "mr": "हे जमीन एकक या राज्यात उपलब्ध नाही",
    },
    "GEOCODING_FAILED": {
        "hi": "गाँव का पता नहीं लगा — कृपया नक्शे पर जगह चुनें",
        "mr": "गावाचा पत्ता सापडला नाही — कृपया नकाशावर जागा निवडा",
    },
    "UPSTREAM_UNAVAILABLE": {
        "hi": "जानकारी अभी उपलब्ध नहीं है — थोड़ी देर बाद कोशिश करें",
        "mr": "माहिती सध्या उपलब्ध नाही",
    },
    "INTERNAL_ERROR": {
        "hi": "कुछ गड़बड़ हुई — कृपया दोबारा कोशिश करें",
        "pa": "ਕੁਝ ਗੜਬੜ ਹੋਈ — ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
        "mr": "काहीतरी चूक झाली — कृपया पुन्हा प्रयत्न करा",
    },
}


def localize(code: str, message: str, lang: str) -> str:
    return _LOCALIZED.get(code, {}).get(lang, message)


class AppError(Exception):
    """Base application error. Handlers render it into the error envelope."""

    status_code: int = 500
    code: str = "INTERNAL_ERROR"

    def __init__(
        self,
        message: str | None = None,
        *,
        code: str | None = None,
        status_code: int | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.code = code or self.code
        self.status_code = status_code or self.status_code
        self.message = message or self.code.replace("_", " ").title()
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(AppError):
    status_code = 400
    code = "VALIDATION_ERROR"


class UnauthorizedError(AppError):
    status_code = 401
    code = "UNAUTHORIZED"


class ForbiddenError(AppError):
    status_code = 403
    code = "FORBIDDEN"


class NotFoundError(AppError):
    status_code = 404
    code = "NOT_FOUND"


class ConflictError(AppError):
    status_code = 409
    code = "CONFLICT"


class UnprocessableError(AppError):
    """Syntactically valid but semantically impossible (e.g. gap shorter than every crop)."""

    status_code = 422
    code = "UNPROCESSABLE"


class RateLimitedError(AppError):
    status_code = 429
    code = "RATE_LIMITED"

    def __init__(self, retry_after: int = 60, **kw: Any) -> None:
        super().__init__(details={"retry_after": retry_after}, **kw)
        self.retry_after = retry_after


class UpstreamUnavailableError(AppError):
    """An external source failed AND no cached fallback existed.

    Rare by design — P4 requires serving stale data rather than failing.
    """

    status_code = 503
    code = "UPSTREAM_UNAVAILABLE"
