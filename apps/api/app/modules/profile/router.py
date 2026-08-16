"""Profile endpoints (§3 API Design)."""

from __future__ import annotations

from fastapi import APIRouter, status

from app.deps import CurrentFarmer, DbSession, Language, OwnedFarm, OwnedPlot
from app.modules.profile import service
from app.modules.profile.schemas import (
    FarmCreateIn,
    FarmerUpdateIn,
    FarmUpdateIn,
    LandUnitOut,
    PlotCreateIn,
    PlotUpdateIn,
    ReferenceOut,
    SoilTestIn,
    SoilTestOut,
)
from app.schemas import ok
from app.shared.enums import (
    IRRIGATION_LABELS_HI,
    LANGUAGE_LABELS,
    SOIL_TYPE_LABELS_HI,
    IrrigationSource,
    SoilType,
)
from app.shared.land_units import available_units, get_factor

router = APIRouter(tags=["profile"])


# --------------------------------------------------------------------- me


@router.get("/me")
def get_me(farmer: CurrentFarmer) -> dict:
    """The authenticated farmer's profile (FR-1.2)."""
    return ok(service.get_farmer_out(farmer), source="SmartKisan profile")


@router.patch("/me")
def update_me(payload: FarmerUpdateIn, farmer: CurrentFarmer, db: DbSession) -> dict:
    updated = service.update_farmer(db, farmer, payload)
    return ok(service.get_farmer_out(updated), source="SmartKisan profile")


# --------------------------------------------------------------------- farms


@router.post("/farms", status_code=status.HTTP_201_CREATED)
def create_farm(payload: FarmCreateIn, farmer: CurrentFarmer, db: DbSession) -> dict:
    """Register a farm. Geocodes the village when coordinates are omitted (FR-1.3).

    When `geocode_confidence` is `district_centroid`, the client must prompt the
    farmer to drop a precise pin — weather at a district centroid is not weather
    at their field.
    """
    farm = service.create_farm(db, farmer, payload)
    out = service.farm_to_out(farm)
    source = (
        "Nominatim / OpenStreetMap" if farm.geocode_source == "nominatim" else "SmartKisan profile"
    )
    return ok(out, source=source)


@router.get("/farms")
def list_farms(farmer: CurrentFarmer, db: DbSession) -> dict:
    farms = service.list_farms(db, farmer)
    return ok([service.farm_to_out(f) for f in farms], source="SmartKisan profile")


@router.get("/farms/{farm_id}")
def get_farm(farm: OwnedFarm) -> dict:
    return ok(service.farm_to_out(farm), source="SmartKisan profile")


@router.patch("/farms/{farm_id}")
def update_farm(payload: FarmUpdateIn, farm: OwnedFarm, db: DbSession) -> dict:
    updated = service.update_farm(db, farm, payload)
    return ok(service.farm_to_out(updated), source="SmartKisan profile")


# --------------------------------------------------------------------- plots


@router.post("/farms/{farm_id}/plots", status_code=status.HTTP_201_CREATED)
def create_plot(payload: PlotCreateIn, farm: OwnedFarm, db: DbSession) -> dict:
    """Register a plot.

    The response echoes the unit conversion (`area_display`, `conversion_note`)
    so the farmer can confirm "5 बीघा = 1.25 एकड़" before it silently corrupts
    every downstream rupee figure (FR-1.5, risk R9).
    """
    plot = service.create_plot(db, farm, payload)
    return ok(service.plot_to_out(plot), source="SmartKisan profile")


@router.get("/farms/{farm_id}/plots")
def list_plots(farm: OwnedFarm, db: DbSession) -> dict:
    plots = service.list_plots(db, farm)
    return ok([service.plot_to_out(p) for p in plots], source="SmartKisan profile")


@router.get("/plots/{plot_id}")
def get_plot(plot: OwnedPlot) -> dict:
    return ok(service.plot_to_out(plot), source="SmartKisan profile")


@router.patch("/plots/{plot_id}")
def update_plot(payload: PlotUpdateIn, plot: OwnedPlot, db: DbSession) -> dict:
    updated = service.update_plot(db, plot, payload)
    return ok(service.plot_to_out(updated), source="SmartKisan profile")


@router.delete("/plots/{plot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plot(plot: OwnedPlot, db: DbSession) -> None:
    service.delete_plot(db, plot)


@router.post("/plots/{plot_id}/soil-test", status_code=status.HTTP_201_CREATED)
def add_soil_test(payload: SoilTestIn, plot: OwnedPlot, db: DbSession) -> dict:
    """Attach Soil Health Card values (FR-1.6)."""
    test = service.add_soil_test(db, plot, payload)
    return ok(SoilTestOut.model_validate(test), source="Soil Health Card")


# --------------------------------------------------------------------- reference


@router.get("/reference/land-units")
def get_land_units(state: str | None = None) -> dict:
    """Units selectable for a state, regional units first (FR-1.5).

    A farmer in UP thinks in bigha, not hectares — and 1 bigha there is 2.5× a
    bigha in Haryana, which is why this is state-scoped.
    """
    units = [
        LandUnitOut(
            code=u.code,
            label_en=u.label_en,
            label_local=u.label_local,
            note=u.note,
            acres_per_unit=float(get_factor(u.code, state)),
        )
        for u in available_units(state)
    ]
    return ok(units, source="SmartKisan reference")


@router.get("/reference/options")
def get_options(lang: Language) -> dict:
    """Enumerations for the profile form, with localized labels."""
    return ok(
        ReferenceOut(
            land_units=[],
            soil_types=[
                {"code": s.value, "label": SOIL_TYPE_LABELS_HI[s], "label_en": s.value}
                for s in SoilType
            ],
            irrigation_sources=[
                {"code": i.value, "label": IRRIGATION_LABELS_HI[i], "label_en": i.value}
                for i in IrrigationSource
            ],
            languages=[{"code": c, "label": lbl} for c, lbl in LANGUAGE_LABELS.items()],
        ),
        source="SmartKisan reference",
    )
