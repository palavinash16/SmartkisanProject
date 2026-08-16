"""State-aware land unit conversion.

Implements FR-1.5. Mitigates risk R9 (08-PROJECT-PLAN §4):

    A wrong bigha factor silently corrupts EVERY rupee figure downstream.

Bigha is not a standard unit — it varies by state, and in some states by district.
There is deliberately NO default factor: an unknown (unit, state) pair raises
rather than guessing. Guessing here produces confidently wrong economics.

Factors are sourced from state revenue department conventions. Where a state
uses multiple local variants, the predominant revenue-record ("pucca") value is
used and noted in `LandUnit.note`.
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal

# --------------------------------------------------------------------------- units

#: Units whose size is identical everywhere in India.
UNIVERSAL_FACTORS: dict[str, Decimal] = {
    "acre": Decimal("1"),
    "hectare": Decimal("2.4710538147"),
    "sq_meter": Decimal("0.00024710538147"),
    "sq_feet": Decimal("0.0000229568411"),
    "guntha": Decimal("0.025"),  # 40 guntha = 1 acre
    "cent": Decimal("0.01"),  # 100 cent = 1 acre
    "kanal": Decimal("0.125"),  # 8 kanal = 1 acre
    "marla": Decimal("0.00625"),  # 20 marla = 1 kanal
    "katha_bihar": Decimal("0.0308642"),  # 20 katha = 1 bigha (Bihar)
    "ground": Decimal("0.05509642"),  # 2400 sq ft (Tamil Nadu)
}

#: Bigha differs by state. No fallback — an unlisted state raises.
BIGHA_FACTORS: dict[str, Decimal] = {
    "Uttar Pradesh": Decimal("0.625"),
    "Uttarakhand": Decimal("0.625"),
    "Rajasthan": Decimal("0.625"),  # pucca bigha
    "Madhya Pradesh": Decimal("0.275"),
    "Bihar": Decimal("0.6172"),
    "Jharkhand": Decimal("0.6172"),
    "Punjab": Decimal("0.25"),
    "Haryana": Decimal("0.25"),
    "Himachal Pradesh": Decimal("0.2"),
    "West Bengal": Decimal("0.3306"),
    "Assam": Decimal("0.3306"),
    "Tripura": Decimal("0.3306"),
    "Gujarat": Decimal("0.3951"),
}

#: Biswa is a fraction of the state's bigha (commonly 1/20).
BISWA_PER_BIGHA: dict[str, int] = {
    "Uttar Pradesh": 20,
    "Uttarakhand": 20,
    "Rajasthan": 20,
    "Punjab": 20,
    "Haryana": 20,
    "Himachal Pradesh": 20,
    "Madhya Pradesh": 20,
    "Bihar": 20,
}

#: Katha is a fraction of the state's bigha, varying by state.
KATHA_PER_BIGHA: dict[str, int] = {
    "Bihar": 20,
    "Jharkhand": 20,
    "West Bengal": 20,
    "Assam": 5,
}


@dataclass(frozen=True, slots=True)
class LandUnit:
    """A selectable unit, for the UI unit picker."""

    code: str
    label_en: str
    label_local: str
    note: str = ""


#: Units offered per state, in the order the UI should present them.
_STATE_UNIT_LABELS: dict[str, tuple[str, str]] = {
    "bigha": ("Bigha", "बीघा"),
    "biswa": ("Biswa", "बिस्वा"),
    "katha": ("Katha", "कट्ठा"),
    "kanal": ("Kanal", "ਕਨਾਲ"),
    "marla": ("Marla", "ਮਰਲਾ"),
    "guntha": ("Guntha", "गुंठा"),
    "cent": ("Cent", "செண்ட்"),
    "ground": ("Ground", "கிரவுண்ட்"),
    "acre": ("Acre", "एकड़"),
    "hectare": ("Hectare", "हेक्टेयर"),
    "sq_meter": ("Square Meter", "वर्ग मीटर"),
    "sq_feet": ("Square Feet", "वर्ग फुट"),
}


class LandConversionError(ValueError):
    """Base class for all conversion failures."""


class UnknownUnitError(LandConversionError):
    """The unit code is not recognised."""


class UnitNotAvailableInStateError(LandConversionError):
    """The unit exists, but has no defined factor for this state.

    Raised rather than falling back to a default — see module docstring.
    """


def _quantize_acres(value: Decimal) -> Decimal:
    """Round to 4 decimal places (~0.4 m² precision)."""
    return value.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)


def get_factor(unit: str, state: str | None = None) -> Decimal:
    """Return acres per 1 unit.

    Raises:
        UnknownUnitError: unrecognised unit code.
        UnitNotAvailableInStateError: state-dependent unit with no factor for `state`.
    """
    unit = unit.strip().lower()

    if unit in UNIVERSAL_FACTORS:
        return UNIVERSAL_FACTORS[unit]

    if unit in ("bigha", "biswa", "katha"):
        if not state:
            raise UnitNotAvailableInStateError(
                f"'{unit}' varies by state; a state must be supplied"
            )
        state = state.strip()

        if unit == "bigha":
            if state not in BIGHA_FACTORS:
                raise UnitNotAvailableInStateError(f"No bigha factor defined for state '{state}'")
            return BIGHA_FACTORS[state]

        if unit == "biswa":
            if state not in BIGHA_FACTORS or state not in BISWA_PER_BIGHA:
                raise UnitNotAvailableInStateError(f"No biswa factor defined for state '{state}'")
            return BIGHA_FACTORS[state] / Decimal(BISWA_PER_BIGHA[state])

        # katha
        if state not in BIGHA_FACTORS or state not in KATHA_PER_BIGHA:
            raise UnitNotAvailableInStateError(f"No katha factor defined for state '{state}'")
        return BIGHA_FACTORS[state] / Decimal(KATHA_PER_BIGHA[state])

    raise UnknownUnitError(f"Unknown land unit: '{unit}'")


def to_acres(value: float | Decimal | str, unit: str, state: str | None = None) -> Decimal:
    """Convert a land area to acres.

    >>> to_acres(5, "bigha", "Haryana")
    Decimal('1.2500')
    >>> to_acres(5, "bigha", "Uttar Pradesh")
    Decimal('3.1250')
    """
    amount = Decimal(str(value))
    if amount < 0:
        raise LandConversionError("Land area cannot be negative")
    return _quantize_acres(amount * get_factor(unit, state))


def from_acres(acres: float | Decimal | str, unit: str, state: str | None = None) -> Decimal:
    """Convert acres back into `unit`. Inverse of :func:`to_acres`."""
    amount = Decimal(str(acres))
    if amount < 0:
        raise LandConversionError("Land area cannot be negative")
    result = amount / get_factor(unit, state)
    return result.quantize(Decimal("0.001"), rounding=ROUND_HALF_UP)


def available_units(state: str | None = None) -> list[LandUnit]:
    """Units selectable for `state`, in UI display order.

    Regional units come first — a farmer in UP thinks in bigha, not hectares.
    """
    codes: list[str] = []
    if state:
        state = state.strip()
        if state in BIGHA_FACTORS:
            codes.append("bigha")
            if state in BISWA_PER_BIGHA:
                codes.append("biswa")
            if state in KATHA_PER_BIGHA:
                codes.append("katha")
        if state in ("Punjab", "Haryana", "Himachal Pradesh", "Jammu and Kashmir"):
            codes += ["kanal", "marla"]
        if state in ("Maharashtra", "Karnataka", "Gujarat", "Andhra Pradesh", "Telangana"):
            codes.append("guntha")
        if state in ("Tamil Nadu", "Kerala", "Karnataka"):
            codes.append("cent")
        if state == "Tamil Nadu":
            codes.append("ground")

    codes += ["acre", "hectare", "sq_meter", "sq_feet"]

    seen: set[str] = set()
    units: list[LandUnit] = []
    for code in codes:
        if code in seen:
            continue
        seen.add(code)
        label_en, label_local = _STATE_UNIT_LABELS[code]
        note = ""
        if code == "bigha" and state:
            note = f"1 bigha = {BIGHA_FACTORS[state]} acre in {state}"
        units.append(LandUnit(code=code, label_en=label_en, label_local=label_local, note=note))
    return units


def format_conversion(
    value: float | Decimal, unit: str, state: str | None = None, *, lang: str = "hi"
) -> str:
    """Human-readable echo of a conversion, e.g. ``"5 बीघा = 1.25 एकड़"``.

    FR-1.5 requires the UI to show this back so the farmer can catch a unit
    mistake *before* it corrupts every downstream rupee figure.
    """
    acres = to_acres(value, unit, state)
    label_en, label_local = _STATE_UNIT_LABELS[unit.strip().lower()]
    label = label_local if lang == "hi" else label_en
    acre_label = "एकड़" if lang == "hi" else "acre"
    amount = Decimal(str(value)).normalize()
    return f"{amount} {label} = {acres.normalize()} {acre_label}"
