# Phase 1 — India-Wide Gap Crop Recommendation Engine

SmartKisan recommendations module to identify and rank short-duration "gap crops" that a farmer can grow in the window between a previous harvested crop and the next planned main crop across Indian states.

---

## 1. Core Architecture Highlights

- **Multi-Tier Location Precedence**:
  1. **District Official Data** (Level 1 — Highest Resolution)
  2. **Agro-Climatic Zone Data** (Level 2 — Regional Homogeneity)
  3. **State Official Data** (Level 3 — State Administrative Level)
  4. **Data Unavailable Fallback** (Level 4 — Explicit notice, NO cross-state data borrowing)
- **Source Provenance Tiers**:
  - `TIER 1`: ICAR Institutes (ICAR-IIPR, ICAR-IARI, ICAR-CRIDA)
  - `TIER 2`: Ministry of Agriculture & Farmers Welfare (GoI)
  - `TIER 3`: State Agriculture Departments
  - `TIER 4`: State Agricultural Universities (SAUs e.g. PAU Ludhiana, TNAU Coimbatore)
- **Scientifically Cautious Framing**: All nutrient outputs are framed as *"Estimated nutrient/rotation impact based on crop profile"*, never claiming to measure un-tested soil fertility.

---

## 2. Database Entities

1. **`states`**: Master administrative state table (`id`, `code`, `name`).
2. **`agro_climatic_zones`**: Master ICAR / Planning Commission 15 zones (`id`, `zone_code`, `zone_name`, `description`).
3. **`districts`**: District master linked to state and zone (`id`, `state_id`, `agro_climatic_zone_id`, `name`).
4. **`agricultural_sources`**: Provenance tracking (`id`, `tier`, `organization`, `source_title`, `url`, `document_identifier`, `verification_status`).
5. **`crop_catalog`**: Master crop species entity (`id`, `code`, `crop_name`, `scientific_name`, `category`, `growth_habit`, `is_gap_candidate`, `active`).
6. **`crop_varieties`**: Crop variety profiles (`id`, `crop_id`, `variety_name`, `variety_code`, `duration_days_min`, `duration_days_max`, `typical_yield_qtl_acre`, `source_id`).
7. **`regional_crop_calendar`**: Crop suitability by location (`crop_id`, `variety_id`, `state_name`, `district_name`, `agro_climatic_zone`, `sowing_start_month`, `sowing_end_month`, `suitability_rating`, `source_id`).
8. **`crop_nutrient_profile`**: Estimated nutrient/rotation impact profiles.
9. **`crop_compatibility`**: Structured rotation matrix detailing previous crop vs. candidate crop compatibility.
10. **`field_observations`**: Persistent log of farmer queries and generated recommendations.

---

## 3. Recommendation Pipeline & Scoring (Max 100 Points)

```
Farmer Input (Location, Previous Crop, Dates, Irrigation, Area)
                            │
                            ▼
     Location Precedence (District -> ACZ -> State -> Fallback)
                            │
                            ▼
           Calculate Available Gap Days (Sowing - Harvest)
                            │
                            ▼
  [Hard Filter 1] Non-Gap Crop Exclusion (is_gap_candidate = True)
  [Hard Filter 2] Duration Check (max_duration_days <= gap_days)
  [Hard Filter 3] Irrigation Match (Source meets crop requirement)
                            │
                            ▼
           [Soft Scoring & Ranking] (Max 100 Points)
  - Gap Duration Fit: 0 - 40 pts
  - Previous Crop Rotation Compatibility: 0 - 20 pts
  - Regional Season Fit: 0 - 15 pts
  - Irrigation Matching: 0 - 10 pts
  - Nutrient / Rotation Impact: 0 - 15 pts
                            │
                            ▼
       Return Top 3 Ranked Crops OR `no_suitable_crop` Response
```

---

## 4. API Reference

### `POST /api/v1/gap-crop/recommend`

#### Example Request
```json
{
  "state_name": "Punjab",
  "district_name": "Ludhiana",
  "previous_crop": "Wheat",
  "harvest_date": "2026-04-20",
  "next_crop": "Paddy",
  "next_sowing_date": "2026-06-25",
  "irrigation_type": "Tube well",
  "area_acres": 3.0
}
```

#### Example Response
```json
{
  "data": {
    "status": "success",
    "calculated_gap_days": 66,
    "location_context": {
      "state_name": "Punjab",
      "district_name": "Ludhiana",
      "agro_climatic_zone": "Trans-Gangetic Plain Zone",
      "resolution_level": "District Official Data"
    },
    "input_summary": {
      "previous_crop": "Wheat",
      "harvest_date": "2026-04-20",
      "next_crop": "Paddy",
      "next_sowing_date": "2026-06-25",
      "irrigation_type": "Tube well",
      "state_name": "Punjab",
      "district_name": "Ludhiana",
      "area_acres": 3.0
    },
    "top_recommendations": [
      {
        "rank": 1,
        "crop_code": "summer_moong",
        "crop_name": "Summer Moong",
        "hindi_name": "ग्रीष्मकालीन मूंग",
        "scientific_name": "Vigna radiata",
        "category": "Pulse",
        "duration_days": "55-65 Days",
        "water_requirement": "Low",
        "suitability_status": "High",
        "rotation_benefit": "Favorable",
        "estimated_nutrient_impact": "Previous Wheat cultivation may have a relatively high nitrogen demand; this Summer Moong recommendation receives a favorable rotation benefit.",
        "expected_yield": "4.5 qtl/acre",
        "projected_profit_per_acre": "₹22,000 - ₹30,000 / Acre",
        "projected_profit_total": 90000,
        "score": 98.5,
        "score_breakdown": {
          "gap_duration_fit": 40.0,
          "crop_compatibility": 20.0,
          "regional_suitability": 13.5,
          "irrigation_suitability": 10.0,
          "nutrient_rotation_benefit": 15.0,
          "total": 98.5
        },
        "location_resolution_level": "District Official Data",
        "reasons": [
          "✓ Optimal fit for 66-day window (55-65 days duration)",
          "✓ Favorable cereal-legume rotation after Wheat",
          "✓ Favorable district sowing window (3-4 month) for Ludhiana, Punjab."
        ],
        "warnings": [],
        "source_provenance": "Punjab Agricultural University (PAU), Ludhiana Farm Advisory"
      }
    ],
    "eligible_crops_count": 4,
    "disclaimer": "Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test."
  },
  "meta": {
    "source": "SmartKisan India-Wide Decision Engine v2.0",
    "is_stale": false,
    "data_as_of": "2026-08-17T00:00:00Z",
    "model_version": "2.0.0"
  }
}
```

---

## 5. Testing & Verification

Run backend test suite:
```bash
cd apps/api
.venv\Scripts\python.exe -m pytest tests/test_gap_crop.py
```
All 16 unit & integration tests passing cleanly.
