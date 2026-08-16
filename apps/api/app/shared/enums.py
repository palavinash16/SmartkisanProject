"""Enumerations shared across modules.

These are the controlled vocabularies referenced by the crop rule engine
(FR-2.2/2.3), so they live in one place rather than as loose strings.
"""

from __future__ import annotations

from enum import StrEnum


class SoilType(StrEnum):
    ALLUVIAL = "alluvial"
    LOAMY = "loamy"
    SANDY_LOAM = "sandy_loam"
    CLAY_LOAM = "clay_loam"
    BLACK_COTTON = "black_cotton"
    RED = "red"
    LATERITE = "laterite"
    SANDY = "sandy"
    CLAY = "clay"
    SALINE = "saline"


#: Hindi labels for the profile UI. Farmers pick from these, not from codes.
SOIL_TYPE_LABELS_HI: dict[str, str] = {
    SoilType.ALLUVIAL: "जलोढ़ मिट्टी",
    SoilType.LOAMY: "दोमट मिट्टी",
    SoilType.SANDY_LOAM: "बलुई दोमट",
    SoilType.CLAY_LOAM: "चिकनी दोमट",
    SoilType.BLACK_COTTON: "काली मिट्टी",
    SoilType.RED: "लाल मिट्टी",
    SoilType.LATERITE: "लेटराइट मिट्टी",
    SoilType.SANDY: "बलुई मिट्टी",
    SoilType.CLAY: "चिकनी मिट्टी",
    SoilType.SALINE: "खारी मिट्टी",
}


class IrrigationSource(StrEnum):
    TUBEWELL = "tubewell"
    BOREWELL = "borewell"
    CANAL = "canal"
    DRIP = "drip"
    SPRINKLER = "sprinkler"
    POND = "pond"
    RAINFED = "rainfed"


IRRIGATION_LABELS_HI: dict[str, str] = {
    IrrigationSource.TUBEWELL: "ट्यूबवेल",
    IrrigationSource.BOREWELL: "बोरवेल",
    IrrigationSource.CANAL: "नहर",
    IrrigationSource.DRIP: "ड्रिप सिंचाई",
    IrrigationSource.SPRINKLER: "फव्वारा सिंचाई",
    IrrigationSource.POND: "तालाब",
    IrrigationSource.RAINFED: "बारिश पर निर्भर",
}

#: Seasonal water a source can reliably deliver, in mm.
#: Used by the hard water-availability constraint (FR-2.3) — a crop needing more
#: than this is EXCLUDED, never merely down-ranked.
IRRIGATION_WATER_CEILING_MM: dict[str, int] = {
    IrrigationSource.TUBEWELL: 900,
    IrrigationSource.BOREWELL: 900,
    IrrigationSource.DRIP: 700,
    IrrigationSource.SPRINKLER: 700,
    IrrigationSource.CANAL: 600,
    IrrigationSource.POND: 400,
    IrrigationSource.RAINFED: 250,
}


class SocialCategory(StrEnum):
    """Required for scheme eligibility rules (FR-5.1)."""

    GENERAL = "general"
    OBC = "obc"
    SC = "sc"
    ST = "st"


class Gender(StrEnum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class Language(StrEnum):
    HINDI = "hi"
    PUNJABI = "pa"
    MARATHI = "mr"
    BENGALI = "bn"
    BHOJPURI = "bho"
    ENGLISH = "en"


LANGUAGE_LABELS: dict[str, str] = {
    Language.HINDI: "हिंदी",
    Language.PUNJABI: "ਪੰਜਾਬੀ",
    Language.MARATHI: "मराठी",
    Language.BENGALI: "বাংলা",
    Language.BHOJPURI: "भोजपुरी",
    Language.ENGLISH: "English",
}


class GeocodeConfidence(StrEnum):
    """How precisely a farm's coordinates are known.

    `DISTRICT_CENTROID` must prompt the farmer to drop a precise pin — weather at
    a district centroid is not weather at their field (FR-1.3).
    """

    EXACT = "exact"
    VILLAGE = "village"
    DISTRICT_CENTROID = "district_centroid"
    USER_PINNED = "user_pinned"
