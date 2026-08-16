# 01 — Software Requirements Specification (SRS)

**Project:** SmartKisan — Farmer Decision Support Platform
**Version:** 2.0
**Date:** 2026-08-04
**Status:** Approved for design

---

## 1. Introduction

### 1.1 Purpose

This document defines **what** SmartKisan must do. It does not describe *how* — that is
[02-SYSTEM-DESIGN.md](02-SYSTEM-DESIGN.md).

Every requirement below has an ID (`FR-x.y` / `NFR-x`). Later documents reference these IDs so we
can always trace a line of code back to the requirement that justifies it.

### 1.2 Scope

SmartKisan helps small and marginal Indian farmers make **five decisions**:

| # | Decision | Question the farmer is asking |
|---|---|---|
| 1 | **What to grow in the idle gap** | "My field is empty for 65 days between wheat and paddy. What should I plant?" |
| 2 | **What is wrong with my crop** | "My leaves have spots. What disease is it, and what do I spray?" |
| 3 | **When and where to sell** | "Should I sell today, or wait? Which mandi pays more?" |
| 4 | **What government money can I claim** | "Which schemes am I eligible for, and how do I apply?" |
| 5 | **Anything, in my own language** | Voice assistant that answers all of the above in Hindi/Bhojpuri/Punjabi/etc. |

**Out of scope for v1.0:** e-commerce / input selling, land-record integration, direct crop
insurance underwriting, drone/satellite imagery ingestion, farmer-to-farmer marketplace.

### 1.3 Definitions

| Term | Meaning |
|---|---|
| **Gap period / Zaid** | ~60–90 idle days between Rabi harvest (wheat, ~April) and Kharif sowing (paddy, ~July) |
| **Mandi** | Government-regulated agricultural market (APMC) |
| **Modal price** | The most frequently traded price on a given day — the number farmers actually care about |
| **Quintal (qtl)** | 100 kg. Standard Indian trading unit |
| **MSP** | Minimum Support Price — government floor price |
| **AGMARKNET** | Government portal publishing daily mandi prices |
| **KVK** | Krishi Vigyan Kendra — district-level government farm science centre |
| **SHC** | Soil Health Card — free government soil test (12 parameters) |
| **PHI** | Pre-Harvest Interval — days you must wait after spraying before harvest |
| **OOD** | Out-of-distribution — an input the ML model was not trained on and must refuse |

---

## 2. Users

### 2.1 Primary persona — Ramesh

- 42 years old, 3.5 acres in Karnal district, Haryana
- Wheat → paddy rotation, tubewell irrigation
- Class 8 education, reads Hindi slowly, **prefers listening over reading**
- ₹8,000 Android phone, 3 GB RAM, patchy 4G, ~1.5 GB data/month
- Currently leaves the field fallow April–July because he doesn't know what else to do

**Design consequences:** voice-first, offline-capable, large touch targets, minimal text,
every number spoken aloud, works on 3 GB RAM.

### 2.2 Secondary personas

| Persona | Need |
|---|---|
| **Progressive farmer** (10+ acres, smartphone-fluent) | Price forecasts, ROI comparison, export data |
| **Feature-phone farmer** | Must reach the same advice via IVR/SMS — no app |
| **KVK extension officer** | Bulk view of village-level recommendations, override bad advice |
| **Admin** | Manage crop database, review flagged recommendations, monitor model drift |

### 2.3 Assumptions and dependencies

| ID | Assumption | Risk if false |
|---|---|---|
| A-1 | `data.gov.in` AGMARKNET API remains free and daily-updated | Price module degrades to last-known values |
| A-2 | Farmer can state soil type and irrigation source accurately | Recommendations mis-ranked → add SHC lookup + photo fallback |
| A-3 | Open-Meteo remains free for non-commercial use | Fall back to IMD (paid) or NOAA GFS |
| A-4 | Farmer has ≥2G connectivity at least once per week | Offline cache TTL must be ≥7 days |
| A-5 | Bhashini free tier is adequate for pilot scale | Self-host AI4Bharat IndicWhisper/IndicTTS |

---

## 3. Functional Requirements

Priority: **P0** = must have for v1.0 · **P1** = should have · **P2** = nice to have

---

### 3.1 FR-1 — Farmer Profile & Onboarding

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | Register/login with mobile number + OTP. No password. | P0 |
| FR-1.2 | Capture: name, preferred language, state, district, village, gender, social category (Gen/OBC/SC/ST) | P0 |
| FR-1.3 | Resolve village name → lat/long via geocoding; allow manual map pin correction | P0 |
| FR-1.4 | Register one or more **plots**, each with area, soil type, irrigation source, current/previous crop | P0 |
| FR-1.5 | Accept land area in **acre, bigha, biswa, hectare, guntha, kanal** and convert internally to acres | P0 |
| FR-1.6 | Optionally attach Soil Health Card values (pH, EC, OC, N, P, K, micronutrients) | P1 |
| FR-1.7 | Store consent record for data usage; allow account + data deletion | P0 |
| FR-1.8 | Profile is the single source of truth — every module reads it, no module asks twice | P0 |

> **Note on FR-1.5:** bigha varies by state (UP ≈ 0.625 acre, Bihar ≈ 0.6172, Punjab ≈ 0.25, Rajasthan ≈ 0.625).
> Conversion **must** be state-aware. A wrong conversion silently corrupts every rupee figure downstream.

---

### 3.2 FR-2 — Gap Crop Recommendation *(flagship module)*

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | Accept: gap window (days), plot, soil type, irrigation, previous crop, sowing date | P0 |
| FR-2.2 | Apply **hard agronomic constraints** — a crop that fails any constraint is excluded, never merely down-ranked | P0 |
| FR-2.3 | Hard constraints: duration ≤ gap − 7 safety days; soil compatibility; water availability; temperature tolerance for the district | P0 |
| FR-2.4 | Rank survivors by expected net profit, adjusted for risk, rotation benefit, and soil-health gain | P0 |
| FR-2.5 | Show per crop: investment, expected yield range (low/typical/high), forecast price, net profit, ROI %, risk score | P0 |
| FR-2.6 | Show profit as a **range with confidence**, never a single fake-precise number | P0 |
| FR-2.7 | Explain **why** each crop was recommended, in the farmer's language, in plain sentences | P0 |
| FR-2.8 | Explain why *excluded* crops were excluded (transparency builds trust) | P1 |
| FR-2.9 | Support ≥20 Zaid/summer crops across pulses, vegetables, fodder, oilseeds, green manure | P0 |
| FR-2.10 | Generate a week-by-week **crop calendar** (sowing → irrigation → fertiliser → harvest) | P1 |
| FR-2.11 | Log every recommendation served (inputs, outputs, model version) for audit and future training | P0 |
| FR-2.12 | Let the farmer record what they actually planted and harvested → feedback loop | P1 |

---

### 3.3 FR-3 — Mandi Price & Sell Advisory

| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | Show today's min/max/modal price for a commodity, filterable by state/district/mandi | P0 |
| FR-3.2 | List mandis near the farmer sorted by distance, with price at each | P0 |
| FR-3.3 | Show price history chart (30 / 90 / 365 days / 5 years) | P0 |
| FR-3.4 | Show MSP alongside market price, and flag when market < MSP | P0 |
| FR-3.5 | Forecast modal price 7 / 30 / 60 / 90 days ahead with **80% confidence interval** | P1 |
| FR-3.6 | Issue a **SELL / HOLD / WAIT** advisory comparing today's price vs forecast, accounting for storage cost and spoilage risk | P1 |
| FR-3.7 | Compute **net realisation** = price − transport (₹/km × distance) − mandi fee − labour, so the nearest mandi is not assumed best | P1 |
| FR-3.8 | Price alert: notify when a chosen commodity crosses a farmer-set threshold | P2 |
| FR-3.9 | Display data freshness ("Updated: today 12:00 PM") and degrade gracefully when the source is stale | P0 |

> **Critical:** FR-3.7 is what makes this better than AGMARKNET's own website. A mandi 60 km away
> paying ₹200/qtl more is *worse* after transport for a small load. Nobody computes this for the farmer.

---

### 3.4 FR-4 — Crop Disease Detection

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | Accept a leaf photo from camera or gallery | P0 |
| FR-4.2 | Run inference **on-device** when possible; fall back to server | P0 |
| FR-4.3 | Return: disease name (local + scientific), severity, symptoms, confidence | P0 |
| FR-4.4 | **Reject out-of-distribution images** — if it is not a crop leaf, say so and do not guess | P0 |
| FR-4.5 | If confidence < threshold, return "uncertain" and route to KVK contact — never a low-confidence diagnosis | P0 |
| FR-4.6 | Show **calibrated** confidence, not raw softmax | P0 |
| FR-4.7 | Show a Grad-CAM heat map of which leaf region drove the prediction | P1 |
| FR-4.8 | Recommend organic remedy **first**, chemical second | P0 |
| FR-4.9 | Every chemical recommendation must include: dosage, water volume, PHI (pre-harvest interval), safety warning, and **a citation to an ICAR/CIB&RC source** | P0 |
| FR-4.10 | Cross-check weather — block spray advice if rain/high wind is forecast within 24 h | P0 |
| FR-4.11 | Support ≥15 diseases across paddy, wheat, tomato, potato, chilli, cotton, maize | P0 |
| FR-4.12 | Display a permanent disclaimer: advisory only, confirm with KVK before large-scale application | P0 |

> **FR-4.9 is a legal requirement, not a feature.** An LLM-invented pesticide dosage that harms a
> crop or a person is an unacceptable liability. All dosages come from a curated, cited table.

---

### 3.5 FR-5 — Government Scheme Matching

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | Determine eligibility using a **deterministic rule engine** over the stored profile | P0 |
| FR-5.2 | The LLM must **never** decide eligibility — it may only explain a decision already made by rules | P0 |
| FR-5.3 | Show: benefit amount, eligibility reason, required documents, applying authority, official link | P0 |
| FR-5.4 | Show why the farmer is **not** eligible for near-miss schemes ("your land is 2.4 ha, limit is 2 ha") | P1 |
| FR-5.5 | Cover ≥25 central + state schemes at launch | P0 |
| FR-5.6 | Use RAG over official scheme documents to answer follow-up questions, **with citations** | P1 |
| FR-5.7 | Flag application deadlines and notify before they close | P2 |
| FR-5.8 | Never ask for or store full Aadhaar number — masked last-4 only, if at all | P0 |

---

### 3.6 FR-6 — Weather Advisory

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | 7-day forecast for the farm's exact coordinates: temp, rain probability, humidity, wind, soil moisture | P0 |
| FR-6.2 | Convert raw weather into **actions**, not numbers ("Do not spray today" — not "82% humidity") | P0 |
| FR-6.3 | Rule-based advisories: spray hold, irrigation skip/schedule, heat stress, disease-risk micro-climate, harvest window | P0 |
| FR-6.4 | Advisories must be crop-stage aware (paddy nursery ≠ paddy tillering) | P1 |
| FR-6.5 | Push critical alerts (hail, heavy rain, heat wave) via notification/SMS | P1 |

---

### 3.7 FR-7 — AI Voice Assistant

| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | Accept voice input in Hindi, Punjabi, Marathi, Bengali, Bhojpuri, Awadhi + typed text | P0 |
| FR-7.2 | Reply in the same language, as **both** text and speech | P0 |
| FR-7.3 | The assistant answers by **calling the platform's own engines as tools** — it does not generate facts | P0 |
| FR-7.4 | Every rupee figure, date, dosage, and scheme name spoken must originate from a tool call | P0 |
| FR-7.5 | If no tool can answer, say "I don't know, contact your KVK" — never improvise | P0 |
| FR-7.6 | Maintain conversation context within a session (farmer profile always in context) | P0 |
| FR-7.7 | Support barge-in / stop playback | P1 |
| FR-7.8 | Log all conversations for quality review, with farmer consent | P0 |

> **FR-7.3/7.4 is the single most important architectural rule in this project.**
> The LLM is a *translator and narrator*, never a calculator or an authority.

---

### 3.8 FR-8 — Cross-cutting

| ID | Requirement | Priority |
|---|---|---|
| FR-8.1 | Full UI in ≥6 Indian languages + English | P0 |
| FR-8.2 | Offline mode: last-fetched prices, weather, recommendations, and the disease model remain usable without network | P0 |
| FR-8.3 | Queue actions taken offline and sync when connectivity returns | P1 |
| FR-8.4 | IVR/SMS channel delivering price + weather + scheme info to feature phones | P1 |
| FR-8.5 | Admin panel: manage crops/diseases/schemes, review flagged outputs, view drift dashboards | P1 |
| FR-8.6 | Audit log of every recommendation and advisory served, retained ≥3 years | P0 |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-1.1 | API response time (cached reads) | p95 < 300 ms |
| NFR-1.2 | Gap-crop recommendation (full compute) | p95 < 1.5 s |
| NFR-1.3 | Disease inference — on-device | < 2 s on 3 GB RAM Android |
| NFR-1.4 | Disease inference — server | p95 < 3 s including upload |
| NFR-1.5 | First contentful paint on 3G | < 3 s |
| NFR-1.6 | App bundle (initial) | < 500 KB gzipped |
| NFR-1.7 | On-device model size | < 8 MB (int8 quantised) |

### 4.2 Scalability

| ID | Requirement |
|---|---|
| NFR-2.1 | Support 100,000 registered farmers, 10,000 daily active, on a single mid-size instance |
| NFR-2.2 | Nightly ingestion of ~17,000 mandi records must complete in < 15 min |
| NFR-2.3 | Horizontal scaling of API and workers without code change (stateless services) |

### 4.3 Reliability

| ID | Requirement |
|---|---|
| NFR-3.1 | 99.5% uptime for read APIs |
| NFR-3.2 | **No external API failure may produce a blank screen.** Always serve cached data with a staleness label |
| NFR-3.3 | Ingestion jobs retry with exponential backoff; failures alert, never fail silently |
| NFR-3.4 | Daily automated DB backup, 30-day retention, restore tested quarterly |

### 4.4 Security & Privacy

| ID | Requirement |
|---|---|
| NFR-4.1 | TLS 1.2+ everywhere; HSTS enabled |
| NFR-4.2 | JWT access (15 min) + refresh (30 day) tokens; refresh rotation |
| NFR-4.3 | PII encrypted at rest; phone numbers hashed in analytics |
| NFR-4.4 | Never store full Aadhaar. Never store bank account numbers. |
| NFR-4.5 | Rate limiting: 60 req/min per user, 10/min for OTP and image upload |
| NFR-4.6 | Comply with DPDP Act 2023: explicit consent, purpose limitation, right to erasure |
| NFR-4.7 | Secrets in environment/secret manager — never committed |
| NFR-4.8 | Uploaded images stripped of EXIF GPS before storage |

### 4.5 Usability & Accessibility

| ID | Requirement |
|---|---|
| NFR-5.1 | Any of the 5 core answers reachable in ≤3 taps from home |
| NFR-5.2 | Minimum touch target 48×48 dp; base font ≥16 px |
| NFR-5.3 | WCAG 2.1 AA contrast (≥4.5:1) — screens are used in bright sunlight |
| NFR-5.4 | Every screen has an audio-playback button |
| NFR-5.5 | Icons + colour + text together — never colour alone (colour blindness) |
| NFR-5.6 | Usable one-handed on a 5-inch screen |

### 4.6 ML-specific

| ID | Requirement |
|---|---|
| NFR-6.1 | Every model version is registered with its training data hash, metrics, and date |
| NFR-6.2 | A model may not be promoted unless it beats the incumbent on a frozen holdout set |
| NFR-6.3 | Price forecasts must beat a **seasonal-naive baseline** on MAPE, or the feature is not shipped |
| NFR-6.4 | Classifier confidence must be calibrated (ECE < 0.05) |
| NFR-6.5 | Data + prediction drift monitored weekly; alert on significant shift |
| NFR-6.6 | Every prediction is logged with model version for reproducibility |

### 4.7 Maintainability

| ID | Requirement |
|---|---|
| NFR-7.1 | Backend test coverage ≥70%; scoring/eligibility logic ≥90% |
| NFR-7.2 | All API endpoints documented via OpenAPI, auto-generated |
| NFR-7.3 | DB schema changes only via Alembic migrations |
| NFR-7.4 | Agronomic constants live in the database or config — **never hardcoded in application code** |

---

## 5. Constraints

| ID | Constraint | Consequence |
|---|---|---|
| C-1 | **Zero paid APIs.** All data must be free/government/open | IMD ruled out (paid, IP-whitelist); Open-Meteo used instead |
| C-2 | Single developer, part-time, ~14 weeks | Modular monolith, not microservices. No Kubernetes in v1. |
| C-3 | No farm-level historical yield data exists publicly | Yield model gives a **district prior**, adjusted transparently — and this must be stated in the UI |
| C-4 | `arrival_date` in AGMARKNET is a `DD/MM/YYYY` **string** — no range queries | Must ingest day-by-day into our own DB and build our own history |
| C-5 | Bhashini free tier is PoC-only | Pilot on free tier; plan self-hosted AI4Bharat models for production |
| C-6 | Target device: 3 GB RAM Android, intermittent 2G/3G | Offline-first PWA, quantised on-device model, aggressive caching |

---

## 6. Acceptance Criteria (v1.0 ships when…)

| # | Criterion |
|---|---|
| 1 | **Zero mock data.** `mockData.js` is deleted. Every number traces to a real source or a logged model prediction. |
| 2 | Mandi prices refresh nightly from AGMARKNET; ≥1 year of history accumulated or backfilled. |
| 3 | Gap-crop engine covers ≥20 crops, applies hard constraints, and explains every recommendation in Hindi. |
| 4 | Price forecast beats seasonal-naive baseline on MAPE for the top 10 commodities; CIs displayed. |
| 5 | Disease model reports **field-data accuracy** (PlantDoc), rejects OOD inputs, and cites every chemical dosage. |
| 6 | Scheme eligibility is 100% rule-driven and verified against official guidelines for all listed schemes. |
| 7 | Voice assistant cannot state a number that did not come from a tool call (verified by adversarial test suite). |
| 8 | Core flows work offline after first load. |
| 9 | 10 real farmers complete an unassisted session and can state what the app told them to do. |
| 10 | README accurately describes what is built vs. planned. |

---

## 7. Traceability

| Requirement group | Design doc | Workflow |
|---|---|---|
| FR-1 Profile | [03-DATA-DESIGN](03-DATA-DESIGN.md) §Farmer | [06-WORKFLOWS](06-WORKFLOWS.md) §1 |
| FR-2 Gap Crop | [04-ML-DESIGN](04-ML-DESIGN.md) §M1 | [06-WORKFLOWS](06-WORKFLOWS.md) §2 |
| FR-3 Mandi | [04-ML-DESIGN](04-ML-DESIGN.md) §M2 | [06-WORKFLOWS](06-WORKFLOWS.md) §3 |
| FR-4 Disease | [04-ML-DESIGN](04-ML-DESIGN.md) §M4 | [06-WORKFLOWS](06-WORKFLOWS.md) §4 |
| FR-5 Schemes | [04-ML-DESIGN](04-ML-DESIGN.md) §M5 | [06-WORKFLOWS](06-WORKFLOWS.md) §5 |
| FR-6 Weather | [02-SYSTEM-DESIGN](02-SYSTEM-DESIGN.md) §Rules | [06-WORKFLOWS](06-WORKFLOWS.md) §6 |
| FR-7 Voice | [04-ML-DESIGN](04-ML-DESIGN.md) §M6 | [06-WORKFLOWS](06-WORKFLOWS.md) §7 |
| All NFRs | [02-SYSTEM-DESIGN](02-SYSTEM-DESIGN.md) | [09-TESTING-STRATEGY](09-TESTING-STRATEGY.md) |
