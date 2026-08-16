"""Profile business logic (FR-1.2–1.6)."""

from __future__ import annotations

import uuid
from datetime import date

from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.errors import NotFoundError, ValidationError
from app.logging_config import get_logger
from app.modules.profile.models import Farm, Farmer, Plot, SoilTest
from app.modules.profile.schemas import (
    FarmCreateIn,
    FarmerUpdateIn,
    FarmOut,
    FarmUpdateIn,
    PlotCreateIn,
    PlotOut,
    PlotUpdateIn,
    SoilTestIn,
)
from app.shared.enums import (
    IRRIGATION_LABELS_HI,
    SOIL_TYPE_LABELS_HI,
    GeocodeConfidence,
)
from app.shared.external import nominatim
from app.shared.land_units import (
    LandConversionError,
    format_conversion,
    get_factor,
    to_acres,
)
from app.shared.security import decrypt_phone, mask_phone

log = get_logger(__name__)

#: Typical Kharif (paddy) sowing window start. Used to suggest the gap length.
KHARIF_SOWING_MONTH = 7
KHARIF_SOWING_DAY = 5


# --------------------------------------------------------------------- farmer


def get_farmer_out(farmer: Farmer) -> dict:
    return {
        "id": farmer.id,
        "name": farmer.name,
        "phone_masked": mask_phone(decrypt_phone(farmer.phone_encrypted)),
        "preferred_language": farmer.preferred_language,
        "gender": farmer.gender,
        "social_category": farmer.social_category,
        "date_of_birth": farmer.date_of_birth,
        "consent_given": farmer.consent_given,
        "profile_completeness": farmer.profile_completeness,
    }


def update_farmer(db: Session, farmer: Farmer, payload: FarmerUpdateIn) -> Farmer:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(farmer, field, value.value if hasattr(value, "value") else value)
    db.flush()
    return farmer


# --------------------------------------------------------------------- farm


def create_farm(db: Session, farmer: Farmer, payload: FarmCreateIn) -> Farm:
    """Create a farm, geocoding the village when coordinates are not supplied."""
    lat, lon = payload.latitude, payload.longitude
    source: str | None = None
    confidence: str | None = None

    if lat is not None and lon is not None:
        source = "user_pinned"
        confidence = GeocodeConfidence.USER_PINNED.value
    else:
        try:
            result = nominatim.geocode(payload.village, payload.district, payload.state)
        except Exception as exc:
            log.warning("farm.geocode_failed_continuing", error=str(exc))
            result = None
        if result:
            lat, lon = result.latitude, result.longitude
            source = result.source
            confidence = result.confidence.value

    farm = Farm(
        farmer_id=farmer.id,
        village=payload.village,
        district=payload.district,
        state=payload.state,
        pincode=payload.pincode,
        location=WKTElement(f"POINT({lon} {lat})", srid=4326) if lat and lon else None,
        geocode_source=source,
        geocode_confidence=confidence,
    )
    db.add(farm)
    db.flush()
    log.info("farm.created", farm_id=str(farm.id), confidence=confidence)
    return farm


def update_farm(db: Session, farm: Farm, payload: FarmUpdateIn) -> Farm:
    data = payload.model_dump(exclude_unset=True)
    lat, lon = data.pop("latitude", None), data.pop("longitude", None)

    for field, value in data.items():
        setattr(farm, field, value)

    if lat is not None and lon is not None:
        # A manual pin is the most trustworthy source we have.
        farm.location = WKTElement(f"POINT({lon} {lat})", srid=4326)
        farm.geocode_source = "user_pinned"
        farm.geocode_confidence = GeocodeConfidence.USER_PINNED.value

    db.flush()
    return farm


def list_farms(db: Session, farmer: Farmer) -> list[Farm]:
    return list(db.execute(select(Farm).where(Farm.farmer_id == farmer.id)).scalars())


def farm_to_out(farm: Farm) -> FarmOut:
    lat = lon = None
    if farm.location is not None:
        point = to_shape(farm.location)
        lat, lon = point.y, point.x

    needs_confirmation = farm.geocode_confidence in (
        GeocodeConfidence.DISTRICT_CENTROID.value,
        None,
    )

    return FarmOut(
        id=farm.id,
        village=farm.village,
        district=farm.district,
        state=farm.state,
        pincode=farm.pincode,
        latitude=lat,
        longitude=lon,
        geocode_source=farm.geocode_source,
        geocode_confidence=farm.geocode_confidence,
        total_area_acres=farm.total_area_acres,
        plot_count=len(farm.plots),
        needs_location_confirmation=needs_confirmation,
    )


# --------------------------------------------------------------------- plot


def create_plot(db: Session, farm: Farm, payload: PlotCreateIn) -> Plot:
    """Create a plot, converting the farmer's unit to acres (FR-1.5).

    Conversion failures surface as 400s naming the unit and state — never a
    silent fallback, which is the R9 failure mode.
    """
    try:
        acres = to_acres(payload.area_input_value, payload.area_input_unit, farm.state)
    except LandConversionError as exc:
        raise ValidationError(str(exc), code="INVALID_LAND_UNIT") from exc

    plot = Plot(
        farm_id=farm.id,
        name=payload.name,
        area_input_value=payload.area_input_value,
        area_input_unit=payload.area_input_unit.lower(),
        area_acres=acres,
        soil_type=payload.soil_type.value,
        irrigation_source=payload.irrigation_source.value,
        previous_crop_code=payload.previous_crop_code,
        previous_harvest_date=payload.previous_harvest_date,
    )
    db.add(plot)
    db.flush()
    log.info(
        "plot.created",
        plot_id=str(plot.id),
        input=f"{payload.area_input_value} {payload.area_input_unit}",
        acres=str(acres),
        state=farm.state,
    )
    return plot


def update_plot(db: Session, plot: Plot, payload: PlotUpdateIn) -> Plot:
    data = payload.model_dump(exclude_unset=True)

    # Recompute acres whenever either half of the area changes.
    if "area_input_value" in data or "area_input_unit" in data:
        value = data.get("area_input_value", plot.area_input_value)
        unit = data.get("area_input_unit", plot.area_input_unit)
        try:
            plot.area_acres = to_acres(value, unit, plot.farm.state)
        except LandConversionError as exc:
            raise ValidationError(str(exc), code="INVALID_LAND_UNIT") from exc

    for field, value in data.items():
        setattr(plot, field, value.value if hasattr(value, "value") else value)

    db.flush()
    return plot


def delete_plot(db: Session, plot: Plot) -> None:
    db.delete(plot)
    db.flush()


def list_plots(db: Session, farm: Farm) -> list[Plot]:
    return list(db.execute(select(Plot).where(Plot.farm_id == farm.id)).scalars())


def _suggested_gap_days(plot: Plot, today: date | None = None) -> int | None:
    """Days from last harvest to the next Kharif sowing window.

    Seeds the gap-crop screen so the farmer does not have to work out their own
    idle window (FR-2.1). Returns None when there is no usable gap.
    """
    if plot.previous_harvest_date is None:
        return None

    today = today or date.today()
    harvest = plot.previous_harvest_date
    sowing = date(harvest.year, KHARIF_SOWING_MONTH, KHARIF_SOWING_DAY)
    if sowing <= harvest:
        sowing = date(harvest.year + 1, KHARIF_SOWING_MONTH, KHARIF_SOWING_DAY)

    start = max(harvest, today)
    gap = (sowing - start).days
    return gap if gap > 0 else None


def plot_to_out(plot: Plot) -> PlotOut:
    state = plot.farm.state
    try:
        note = f"1 {plot.area_input_unit} = {get_factor(plot.area_input_unit, state)} acre"
        display = format_conversion(plot.area_input_value, plot.area_input_unit, state)
    except LandConversionError:
        # Factors can change; a stored plot must still render.
        note = ""
        display = f"{plot.area_input_value} {plot.area_input_unit}"

    return PlotOut(
        id=plot.id,
        farm_id=plot.farm_id,
        name=plot.name,
        area_input_value=plot.area_input_value,
        area_input_unit=plot.area_input_unit,
        area_acres=plot.area_acres,
        area_display=display,
        conversion_note=note,
        soil_type=plot.soil_type,
        soil_type_label=SOIL_TYPE_LABELS_HI.get(plot.soil_type, plot.soil_type),
        irrigation_source=plot.irrigation_source,
        irrigation_label=IRRIGATION_LABELS_HI.get(plot.irrigation_source, plot.irrigation_source),
        previous_crop_code=plot.previous_crop_code,
        previous_harvest_date=plot.previous_harvest_date,
        suggested_gap_days=_suggested_gap_days(plot),
    )


# --------------------------------------------------------------------- soil test


def add_soil_test(db: Session, plot: Plot, payload: SoilTestIn) -> SoilTest:
    test = SoilTest(plot_id=plot.id, **payload.model_dump())
    db.add(test)
    db.flush()
    return test


def get_plot_or_404(db: Session, plot_id: uuid.UUID) -> Plot:
    plot = db.get(Plot, plot_id)
    if plot is None:
        raise NotFoundError("Plot not found", code="PLOT_NOT_FOUND")
    return plot
