"""Tests for state-aware land conversion.

Risk R9: a wrong factor silently corrupts every rupee figure downstream.
Coverage target for this module is 100% (09-TESTING-STRATEGY §14).
"""

from decimal import Decimal

import pytest
from hypothesis import given
from hypothesis import strategies as st

from app.shared.land_units import (
    BIGHA_FACTORS,
    BISWA_PER_BIGHA,
    KATHA_PER_BIGHA,
    UNIVERSAL_FACTORS,
    LandConversionError,
    UnitNotAvailableInStateError,
    UnknownUnitError,
    available_units,
    format_conversion,
    from_acres,
    get_factor,
    to_acres,
)

# --------------------------------------------------------------------- state-aware bigha


@pytest.mark.parametrize(
    ("value", "unit", "state", "expected"),
    [
        # The headline case from the docs: 5 bigha means very different things
        (5, "bigha", "Haryana", "1.2500"),
        (5, "bigha", "Punjab", "1.2500"),
        (5, "bigha", "Uttar Pradesh", "3.1250"),
        (5, "bigha", "Rajasthan", "3.1250"),
        (5, "bigha", "Bihar", "3.0860"),
        (5, "bigha", "West Bengal", "1.6530"),
        (5, "bigha", "Madhya Pradesh", "1.3750"),
        (5, "bigha", "Gujarat", "1.9755"),
        (5, "bigha", "Himachal Pradesh", "1.0000"),
        # Biswa = 1/20 bigha in these states
        (20, "biswa", "Uttar Pradesh", "0.6250"),
        (20, "biswa", "Haryana", "0.2500"),
        (1, "biswa", "Uttar Pradesh", "0.0313"),
        # Katha
        (20, "katha", "Bihar", "0.6172"),
        (5, "katha", "Assam", "0.3306"),
        # Universal units
        (1, "acre", None, "1.0000"),
        (1, "hectare", None, "2.4711"),
        (8, "kanal", "Punjab", "1.0000"),
        (20, "marla", "Punjab", "0.1250"),
        (40, "guntha", "Maharashtra", "1.0000"),
        (100, "cent", "Tamil Nadu", "1.0000"),
        (4046.86, "sq_meter", None, "1.0000"),
        (43560, "sq_feet", None, "1.0000"),
    ],
)
def test_to_acres(value, unit, state, expected):
    assert to_acres(value, unit, state) == Decimal(expected)


def test_same_number_different_state_gives_different_acres():
    """The exact failure R9 is about."""
    haryana = to_acres(5, "bigha", "Haryana")
    up = to_acres(5, "bigha", "Uttar Pradesh")
    assert haryana != up
    assert up == haryana * Decimal("2.5")


# --------------------------------------------------------------------- fails loudly


def test_unknown_unit_raises_never_guesses():
    with pytest.raises(UnknownUnitError, match="killa"):
        to_acres(5, "killa", "Haryana")


def test_bigha_without_state_raises():
    """Silently picking a default factor here is the R9 failure mode."""
    with pytest.raises(UnitNotAvailableInStateError, match="varies by state"):
        to_acres(5, "bigha")


def test_bigha_in_state_without_factor_raises():
    with pytest.raises(UnitNotAvailableInStateError, match="Tamil Nadu"):
        to_acres(5, "bigha", "Tamil Nadu")


def test_negative_area_raises():
    with pytest.raises(LandConversionError, match="negative"):
        to_acres(-1, "acre")


def test_biswa_requires_both_factors():
    with pytest.raises(UnitNotAvailableInStateError):
        to_acres(20, "biswa", "West Bengal")  # has bigha, no biswa convention


def test_katha_in_unsupported_state_raises():
    with pytest.raises(UnitNotAvailableInStateError):
        to_acres(20, "katha", "Punjab")


# --------------------------------------------------------------------- consistency


def test_every_biswa_state_has_a_bigha_factor():
    """A biswa factor derived from a missing bigha factor would be undefined."""
    assert set(BISWA_PER_BIGHA) <= set(BIGHA_FACTORS)


def test_every_katha_state_has_a_bigha_factor():
    assert set(KATHA_PER_BIGHA) <= set(BIGHA_FACTORS)


def test_no_state_bigha_factor_is_zero_or_negative():
    assert all(f > 0 for f in BIGHA_FACTORS.values())


def test_universal_factors_are_positive():
    assert all(f > 0 for f in UNIVERSAL_FACTORS.values())


def test_bigha_and_universal_units_do_not_collide():
    """'bigha' must stay state-dependent; a universal entry would shadow it."""
    assert "bigha" not in UNIVERSAL_FACTORS
    assert "biswa" not in UNIVERSAL_FACTORS
    assert "katha" not in UNIVERSAL_FACTORS


@pytest.mark.parametrize("state", sorted(BIGHA_FACTORS))
def test_every_bigha_state_resolves(state):
    assert get_factor("bigha", state) > 0


# --------------------------------------------------------------------- round trip


@pytest.mark.parametrize(
    ("unit", "state"),
    [
        ("bigha", "Haryana"),
        ("bigha", "Uttar Pradesh"),
        ("biswa", "Uttar Pradesh"),
        ("katha", "Bihar"),
        ("acre", None),
        ("hectare", None),
        ("kanal", "Punjab"),
        ("guntha", "Maharashtra"),
    ],
)
def test_round_trip(unit, state):
    original = Decimal("7.5")
    acres = to_acres(original, unit, state)
    back = from_acres(acres, unit, state)
    assert abs(back - original) < Decimal("0.01")


def test_from_acres_rejects_negative():
    with pytest.raises(LandConversionError):
        from_acres(-1, "acre")


# --------------------------------------------------------------------- properties


@given(
    value=st.decimals(min_value=Decimal("0.01"), max_value=Decimal("10000"), places=2),
    state=st.sampled_from(sorted(BIGHA_FACTORS)),
)
def test_INVARIANT_conversion_is_positive_and_linear(value, state):
    """Doubling the input must double the output (within rounding)."""
    single = to_acres(value, "bigha", state)
    double = to_acres(value * 2, "bigha", state)
    assert single > 0
    assert abs(double - single * 2) <= Decimal("0.0002")


@given(
    value=st.decimals(min_value=Decimal("0.01"), max_value=Decimal("10000"), places=2),
    unit=st.sampled_from(sorted(UNIVERSAL_FACTORS)),
)
def test_INVARIANT_universal_units_never_need_a_state(value, unit):
    assert to_acres(value, unit) == to_acres(value, unit, "Haryana")


@given(
    a=st.decimals(min_value=Decimal("0.01"), max_value=Decimal("1000"), places=2),
    b=st.decimals(min_value=Decimal("0.01"), max_value=Decimal("1000"), places=2),
    state=st.sampled_from(sorted(BIGHA_FACTORS)),
)
def test_INVARIANT_conversion_preserves_ordering(a, b, state):
    """More bigha must never convert to fewer acres."""
    if a < b:
        assert to_acres(a, "bigha", state) <= to_acres(b, "bigha", state)


@given(state=st.sampled_from(sorted(BIGHA_FACTORS)))
def test_INVARIANT_conversion_is_deterministic(state):
    assert to_acres(5, "bigha", state) == to_acres(5, "bigha", state)


# --------------------------------------------------------------------- unit picker


def test_available_units_puts_regional_units_first():
    """A farmer in UP thinks in bigha, not hectares."""
    units = available_units("Uttar Pradesh")
    codes = [u.code for u in units]
    assert codes[0] == "bigha"
    assert "biswa" in codes
    assert codes.index("bigha") < codes.index("acre")


def test_available_units_for_punjab_includes_kanal():
    codes = [u.code for u in available_units("Punjab")]
    assert "kanal" in codes and "marla" in codes


def test_available_units_for_maharashtra_includes_guntha():
    codes = [u.code for u in available_units("Maharashtra")]
    assert "guntha" in codes
    assert "bigha" not in codes  # no bigha convention in Maharashtra


def test_available_units_without_state_returns_universal_only():
    codes = [u.code for u in available_units()]
    assert codes == ["acre", "hectare", "sq_meter", "sq_feet"]


def test_available_units_have_no_duplicates():
    for state in [*BIGHA_FACTORS, "Maharashtra", "Tamil Nadu", None]:
        codes = [u.code for u in available_units(state)]
        assert len(codes) == len(set(codes)), f"duplicate unit for {state}"


def test_bigha_unit_carries_an_explanatory_note():
    bigha = next(u for u in available_units("Bihar") if u.code == "bigha")
    assert "Bihar" in bigha.note and "0.6172" in bigha.note


# --------------------------------------------------------------------- UI echo (FR-1.5)


def test_format_conversion_hindi():
    assert format_conversion(5, "bigha", "Haryana") == "5 बीघा = 1.25 एकड़"


def test_format_conversion_english():
    assert format_conversion(5, "bigha", "Uttar Pradesh", lang="en") == "5 Bigha = 3.125 acre"


def test_format_conversion_reveals_the_state_difference():
    """The echo is what lets a farmer catch a wrong unit before it costs them."""
    assert format_conversion(5, "bigha", "Haryana") != format_conversion(
        5, "bigha", "Uttar Pradesh"
    )
