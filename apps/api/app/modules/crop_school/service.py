"""Service logic for Module 4: Crop School (Markdown guides parser)."""

from __future__ import annotations

from pathlib import Path

CROP_SCHOOL_DIR = Path(__file__).resolve().parent.parent.parent.parent / "crop_school"

AVAILABLE_GUIDES = [
    {
        "crop_code": "summer_moong",
        "crop_name": "Summer Moong",
        "hindi_name": "ग्रीष्मकालीन मूंग",
        "duration": "60-65 Days",
        "seed_rate": "8-10 kg/acre",
        "irrigation": "2-3 Light Irrigations",
        "harvest": "After 60 Days",
        "storage": "Moisture < 9% with Neem powder"
    },
    {
        "crop_code": "urad",
        "crop_name": "Summer Urad",
        "hindi_name": "ग्रीष्मकालीन उड़द",
        "duration": "65-70 Days",
        "seed_rate": "8-10 kg/acre",
        "irrigation": "3 Irrigations",
        "harvest": "After 65 Days",
        "storage": "Moisture < 9% in airtight bins"
    },
    {
        "crop_code": "cowpea",
        "crop_name": "Cowpea (Lobia)",
        "hindi_name": "लोबिया",
        "duration": "50-60 Days",
        "seed_rate": "8-10 kg/acre",
        "irrigation": "2 Light Irrigations",
        "harvest": "After 50 Days",
        "storage": "Moisture < 10%"
    },
    {
        "crop_code": "sesame",
        "crop_name": "Summer Sesame (Til)",
        "hindi_name": "ग्रीष्मकालीन तिल",
        "duration": "75-80 Days",
        "seed_rate": "1.5-2.0 kg/acre",
        "irrigation": "3 Irrigations",
        "harvest": "After 75 Days",
        "storage": "Moisture < 8%"
    },
    {
        "crop_code": "wheat",
        "crop_name": "Rabi Wheat",
        "hindi_name": "गेहूं",
        "duration": "120-135 Days",
        "seed_rate": "40 kg/acre",
        "irrigation": "4-5 Irrigations",
        "harvest": "April harvest",
        "storage": "Moisture < 12%"
    },
    {
        "crop_code": "mustard",
        "crop_name": "Rabi Mustard",
        "hindi_name": "सरसों",
        "duration": "100-110 Days",
        "seed_rate": "1.5-2.0 kg/acre",
        "irrigation": "2 Irrigations",
        "harvest": "March harvest",
        "storage": "Moisture < 8%"
    }
]


def list_crop_school_crops():
    return AVAILABLE_GUIDES


def get_crop_school_guide(crop_name: str):
    slug = crop_name.lower().replace(" ", "_").replace("-", "_")
    file_path = CROP_SCHOOL_DIR / f"{slug}.md"

    if not file_path.exists():
        # Fallback to summer_moong if slug not found directly
        file_path = CROP_SCHOOL_DIR / "summer_moong.md"

    content = file_path.read_text(encoding="utf-8")

    meta = next((g for g in AVAILABLE_GUIDES if g["crop_code"] == slug or slug in g["crop_name"].lower()), AVAILABLE_GUIDES[0])

    return {
        "crop_name": meta["crop_name"],
        "hindi_name": meta["hindi_name"],
        "summary_card": {
            "seed_rate": meta["seed_rate"],
            "duration": meta["duration"],
            "irrigation": meta["irrigation"],
            "harvest": meta["harvest"],
            "storage": meta["storage"]
        },
        "markdown_content": content
    }
