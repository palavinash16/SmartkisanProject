# Phase 1 — Gap Crop Recommendation Engine

SmartKisan recommendations module to identify and rank short-duration "gap crops" that a farmer can grow in the window between a previous harvested crop and the next planned main crop.

---

## 1. Business Problem

Farmers often leave fields fallow for 45 to 80 days between major seasonal crop rotations (such as Wheat harvest in late April and Paddy sowing in July). The Gap Crop Recommendation Engine calculates the exact available window, evaluates crop suitability based on regional, agronomic, and irrigation factors, and recommends up to 3 optimal gap crops to maximize farmer profitability and soil health.

### Example Scenario
- **Previous Crop**: Wheat
- **Harvest Date**: 25-Apr-2026
- **Next Crop**: Paddy
- **Next Sowing Date**: 02-Jul-2026
- **Calculated Gap**: **68 Days**

---

## 2. Inputs

The API expects the following parameters:
- `state_name` (e.g. `"Uttar Pradesh"`)
- `district_name` (e.g. `"Ghaziabad"`)
- `previous_crop` (e.g. `"Wheat"`)
- `harvest_date` (e.g. `"2026-04-25"`)
- `next_crop` (e.g. `"Paddy"`)
- `next_sowing_date` (e.g. `"2026-07-02"`)
- `irrigation_type` (e.g. `"Tube well"`, `"Canal"`, `"Rainfed"`)
- `area_acres` (e.g. `2.0`, must be `> 0`)

---

## 3. Database Entities

The engine is backed by the following SQLAlchemy models:

1. **`crop_catalog`**: Stores gap crops with duration ranges (`min_duration_days`, `max_duration_days`), water requirements, category, yield estimates, net profit ranges, and status (`active`).
2. **`regional_crop_calendar`**: Agricultural knowledge table mapping `state_name`, `district_name`, `crop_name`, sowing/harvest month ranges, `regional_suitability`, `confidence_weight`, and source provenance.
3. **`crop_nutrient_profile`**: Stores estimated nutrient impact profiles (`nitrogen_effect`, `phosphorus_effect`, `potassium_effect`, `organic_matter_effect`, `is_legume`, `rotation_notes`, and `source`).
4. **`crop_compatibility`**: Structured rotation matrix detailing previous crop vs. candidate crop compatibility (`Compatible`, `Caution`, `Incompatible`).
5. **`field_observations`**: Persistent log of farmer queries and generated recommendations (`farmer_id`, `state_name`, `district_name`, `previous_crop`, `harvest_date`, `next_crop`, `next_sowing_date`, `irrigation_type`, `calculated_gap_days`, `recommended_crop`, `score`).

---

## 4. Recommendation Pipeline & Scoring

Candidates pass through a 5-factor transparent scoring model (Max **100 Points**):

```
Farmer Input → Validate Dates → Calculate Gap Days → Fetch Candidates
    ↓
1. Duration Filter (0-40 pts): Rejects crops where max duration > gap days
    ↓
2. Rotation Compatibility (0-20 pts): Cereal-legume & structured rotation matrix
    ↓
3. Regional Suitability (0-15 pts): District/Month crop calendar alignment
    ↓
4. Irrigation Matching (0-10 pts): Rainfed vs. Tube well / Canal water requirement match
    ↓
5. Nutrient / Rotation Impact (0-15 pts): Leguminous N-fixation & biomass benefit
    ↓
Rank Candidates → Return Top 3 (or 'no_suitable_crop')
```

---

## 5. Data Honesty & Provenance Rules

1. **No Fake Measured Soil NPK**: All nutrient outputs are framed explicitly as *"Estimated nutrient/rotation impact"* based on crop profile models, never as actual soil test measurements.
2. **Source Provenance**: Seed records explicitly declare their data source: `"Demo/seed data — requires source verification"` or official ICAR citations.
3. **No Suitable Crop Handling**: If no candidate crop satisfies the minimum eligibility criteria (e.g., gap window < 40 days), the system returns `status: "no_suitable_crop"` with actionable advice rather than forced dummy recommendations.

---

## 6. API Reference

### `POST /api/v1/gap-crop/recommend`

#### Example Request
```json
{
  "state_name": "Uttar Pradesh",
  "district_name": "Ghaziabad",
  "previous_crop": "Wheat",
  "harvest_date": "2026-04-25",
  "next_crop": "Paddy",
  "next_sowing_date": "2026-07-02",
  "irrigation_type": "Tube well",
  "area_acres": 2.0
}
```

#### Example Response
```json
{
  "data": {
    "status": "success",
    "calculated_gap_days": 68,
    "input_summary": {
      "previous_crop": "Wheat",
      "harvest_date": "2026-04-25",
      "next_crop": "Paddy",
      "next_sowing_date": "2026-07-02",
      "irrigation_type": "Tube well",
      "state_name": "Uttar Pradesh",
      "district_name": "Ghaziabad",
      "area_acres": 2.0
    },
    "top_recommendations": [
      {
        "rank": 1,
        "crop_code": "summer_moong",
        "crop_name": "Summer Moong",
        "hindi_name": "ग्रीष्मकालीन मूंग",
        "scientific_name": "Vigna radiata",
        "category": "Pulse",
        "duration_days": "60-65 Days",
        "water_requirement": "Low",
        "suitability_status": "High",
        "rotation_benefit": "Favorable",
        "estimated_nutrient_impact": "Previous Wheat cultivation may have a relatively high nitrogen demand; this Summer Moong recommendation receives a favorable rotation benefit based on its crop profile.",
        "expected_yield": "4.5 qtl/acre",
        "projected_profit_per_acre": "₹22,000 - ₹30,000 / Acre",
        "projected_profit_total": 60000,
        "score": 98.5,
        "score_breakdown": {
          "gap_duration_fit": 40.0,
          "crop_compatibility": 20.0,
          "regional_suitability": 13.5,
          "irrigation_suitability": 10.0,
          "nutrient_rotation_benefit": 15.0,
          "total": 98.5
        },
        "reasons": [
          "✓ Optimal fit for 68-day window (60-65 days duration)",
          "✓ Favorable cereal-legume rotation after Wheat",
          "✓ Suitable: Low water requirement efficiently matches assured irrigation.",
          "✓ Favorable regional sowing window (3-5 month) for Ghaziabad, Uttar Pradesh.",
          "✓ Legume crop (Summer Moong) provides a favorable rotation benefit"
        ],
        "warnings": [],
        "source_provenance": "Demo/seed data — requires source verification"
      }
    ],
    "eligible_crops_count": 4,
    "disclaimer": "Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test."
  },
  "meta": {
    "source": "SmartKisan Gap Crop Decision Engine v1.0",
    "is_stale": false,
    "data_as_of": "2026-08-17T00:00:00Z",
    "model_version": "1.0.0"
  }
}
```

---

## 7. Testing & Verification

Run backend unit tests:
```bash
cd apps/api
.venv\Scripts\python.exe -m pytest tests/test_gap_crop.py
```
Total 21 unit & API tests verifying gap calculations, duration boundaries, leap year cases, compatibility matrices, irrigation rules, regional calendar fallbacks, scoring, and Swagger endpoints.
