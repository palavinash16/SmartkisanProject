# 06 — Workflows

**Project:** SmartKisan
**Version:** 2.0
**Traces to:** [01-SRS.md](01-SRS.md) · [05-API-DESIGN.md](05-API-DESIGN.md)

This document shows **what actually happens**, step by step, for each user journey. Read this to
understand how the pieces connect.

---

## 0. The Master Journey — Ramesh's year

```mermaid
timeline
    title One farming year with SmartKisan
    section Rabi (Nov–Apr)
        Nov : Sows wheat
        Mar : Weather advisory - yellow rust risk alert
        Apr : Harvests wheat : Mandi advisory - which mandi, sell or hold
    section 🟢 GAP (Apr–Jun) - our flagship
        Apr 15 : Field now empty for 71 days
               : Opens SmartKisan → Gap Crop
               : Gets Moong recommendation, ₹38k-52k
               : Sows Moong Apr 20
        May : Disease scan - leaf spot found, organic remedy
            : Weather - do not spray today, rain coming
        Jun 25 : Harvests Moong : Sell advisory - hold 2 weeks
               : Records actual yield → feedback loop
    section Kharif (Jul–Oct)
        Jul : Sows paddy - soil now has +22kg N from Moong
        Aug : Scheme alert - PM-KISAN installment due
        Oct : Harvests paddy
```

**The point:** the gap module turns 71 idle days into ~₹46,000 *and* improves the next paddy crop.
Everything else supports that core loop.

---

## 1. Onboarding — FR-1

```mermaid
sequenceDiagram
    actor F as Farmer
    participant A as PWA
    participant API as API
    participant N as Nominatim
    participant DB as PostgreSQL

    F->>A: Opens app
    A->>F: Language picker (हिंदी / ਪੰਜਾਬੀ / मराठी…)
    Note over A: Chosen language persists everywhere

    F->>A: Enters phone
    A->>API: POST /auth/otp/request
    API->>F: SMS OTP
    F->>A: Enters OTP
    A->>API: POST /auth/otp/verify
    API-->>A: tokens + is_new_user=true

    A->>F: 🔊 "अपना गाँव बताइए" (spoken + text)
    F->>A: Village, district, state
    A->>API: POST /farms
    API->>N: geocode "Kachhwa, Karnal, Haryana"
    N-->>API: 29.7256, 76.9107 (district_centroid)
    API->>DB: INSERT farm (PostGIS POINT)
    API-->>A: geocode_confidence = district_centroid
    A->>F: 🗺️ "क्या यह आपका खेत है?" → drop precise pin
    F->>A: Adjusts pin
    A->>API: PATCH /farms/{id} (exact lat/lon)

    F->>A: "5 बीघा"
    A->>API: POST /plots {area_input_value:5, unit:"bigha"}
    API->>DB: lookup bigha factor for Haryana = 0.25
    API-->>A: area_acres=1.25, "5 बीघा (1.25 एकड़)"
    A->>F: ✅ "5 बीघा = 1.25 एकड़ — सही है?"
    Note over F,A: FR-1.5 — farmer confirms conversion<br/>before it corrupts every rupee figure

    F->>A: Soil type, irrigation, previous crop
    A->>API: PATCH /plots/{id}
    A->>API: GET /sync/bootstrap
    API-->>A: everything needed for offline
    A->>A: Cache in IndexedDB + SW
    A->>F: 🏠 Home — ready, works offline now
```

**Design notes:**
- Language **first** — before any text the farmer must read
- Every prompt is spoken as well as written (NFR-5.4)
- Geocode confidence drives a pin-correction prompt — district-centroid weather ≠ field weather
- Unit conversion is echoed and confirmed (the single highest-risk data entry point)
- `bootstrap` at the end means the app is offline-capable from minute one

---

## 2. Gap Crop Recommendation — FR-2 *(flagship flow)*

```mermaid
sequenceDiagram
    actor F as Farmer
    participant A as PWA
    participant API as API
    participant R as 🛡️ Rule Engine
    participant M3 as M3 Yield
    participant M2 as M2 Price
    participant DB as DB
    participant WX as Open-Meteo

    F->>A: Taps "खाली खेत" (Empty Field)
    A->>F: "कब से कब तक खाली है?" (slider, default from previous_harvest_date)
    F->>A: Apr 15 → Jun 25 (71 days)
    A->>API: POST /recommendations/gap-crop

    API->>DB: load plot, soil_test, previous_crop
    API->>WX: district climate normals + season forecast
    API->>DB: SELECT * FROM crop (all ~20 Zaid crops)

    rect rgb(22, 101, 52)
    Note over R: STAGE 1 — HARD FILTER (no ML)
    API->>R: filter_viable(crops, plot, 71 days, climate)
    R->>R: duration ≤ 64 (71−7 safety)?
    R->>R: soil compatible?
    R->>R: water available for irrigation type?
    R->>R: temperature tolerance for district?
    R->>R: disease carryover from previous crop?
    R-->>API: viable=[moong, urad, maize, dhaincha, okra…]<br/>excluded=[(cotton,"duration"), (cucumber,"soil")…]
    end

    rect rgb(30, 64, 175)
    Note over M3,M2: STAGE 2 — ML on VIABLE ONLY
    loop each viable crop
        API->>M3: predict_yield(crop, district, plot)
        M3-->>API: {low:6.9, typical:8.1, high:9.4} qtl/acre
        API->>M2: forecast(commodity, nearest_mandi, h=crop.duration)
        M2-->>API: {pred:8420, lo80:8050, hi80:8790, beats_baseline:true}
        API->>DB: cost norm for (crop, state)
        API->>API: net_profit RANGE = yield×price − cost
        API->>API: score = w·profit − w·risk + w·rotation + w·soil…
    end
    end

    API->>API: rank by score; SHAP → explanation terms
    API->>DB: INSERT recommendation rows (run_id, model_versions) [FR-2.11 audit]
    API-->>A: ranked list + economics ranges + excluded list

    A->>F: 🥇 मूंग — ₹38,000–52,000<br/>✓ 65 दिन ✓ मिट्टी उपयुक्त ✓ नाइट्रोजन<br/>⚠ जून बारिश जोखिम
    A->>F: 🔊 speaks the whole card
    F->>A: "क्यों कपास नहीं?" → taps excluded
    A->>F: "कपास को 160 दिन चाहिए, आपके पास 71 हैं"
    A->>A: Cache recommendation → available offline
```

### The critical ordering

```mermaid
graph TB
    subgraph "✅ CORRECT — rules first"
        A1[20 crops] --> A2["🛡️ Hard filter"] --> A3["8 viable"] --> A4["🤖 ML ranks these 8"] --> A5["Safe, ranked output"]
    end
    subgraph "❌ WRONG — ML first"
        B1[20 crops] --> B2["🤖 ML scores all 20"] --> B3["Top pick: cucumber<br/>on rainfed black cotton"] --> B4["💀 Season lost"]
    end
    style A2 fill:#166534,color:#fff
    style B3 fill:#991b1b,color:#fff
```

**Cost of getting this wrong:** a mis-ranked crop loses some profit. An **invalid** crop loses the
whole season, the seed money, and the farmer's trust permanently.

### Feedback loop — FR-2.12

```mermaid
sequenceDiagram
    actor F as Farmer
    participant A as PWA
    participant API as API
    participant DB as DB

    Note over A: Apr 20 — after sowing
    A->>F: "क्या आपने मूंग लगाई?" (push/notification)
    F->>A: हाँ
    A->>API: POST /recommendations/{run_id}/feedback {action:"planted"}

    Note over A: Jun 25 — after harvest
    A->>F: "कितनी पैदावार हुई?"
    F->>A: 7.8 क्विंटल, ₹8,300/qtl
    A->>API: POST feedback {actual_yield_qtl:7.8, actual_price:8300}
    API->>DB: INSERT cropping_history (linked to run_id)

    Note over DB: predicted 8.1 vs actual 7.8 → 3.7% error<br/>THIS is the training data no competitor has
```

---

## 3. Mandi Price & Sell Decision — FR-3

### 3.1 Nightly ingestion (the foundation)

```mermaid
sequenceDiagram
    participant B as Celery Beat
    participant W as Worker
    participant GOV as data.gov.in
    participant DB as PostgreSQL
    participant R as Redis

    Note over B: 02:00 IST
    B->>W: ingest_mandi_prices(today)
    loop offset 0 → ~17,000 (step 500)
        W->>GOV: GET /resource/9ef84268…?limit=500&offset=N
        alt success
            GOV-->>W: 500 records
            W->>W: parse "04/08/2026" → DATE
            W->>W: map market name → mandi_id (create if new)
            W->>W: normalise commodity via alias table
            W->>W: quality checks: 0 < min ≤ modal ≤ max
            W->>DB: UPSERT ON CONFLICT (mandi,commodity,variety,grade,date)
        else HTTP error
            W->>W: retry ×3, exponential backoff
            W->>W: on final failure → log + alert, continue next page
        end
    end
    W->>DB: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_latest_price
    W->>R: DEL price:*
    W->>W: emit ingest_rows_total, ingest_duration_seconds

    Note over B: 03:00 IST
    B->>W: refresh_price_forecasts()
    loop top 20 commodities × top 200 mandis
        W->>DB: read 5y history
        W->>W: LightGBM quantile predict h=7,30,60,90
        W->>DB: INSERT price_forecast
    end
```

**Why this shape:** AGMARKNET's `arrival_date` is a `DD/MM/YYYY` **string** — no range queries
possible (C-4). We must accumulate our own history, one day at a time. After a year that's ~6M rows
and the training set for M2.

**If the job fails entirely:** `mv_latest_price` still holds yesterday's data. The API serves it with
`is_stale: true` and the real `data_as_of` timestamp. The farmer sees "कल का भाव" — never a blank
screen (P4).

### 3.2 Sell decision — where to sell

```mermaid
sequenceDiagram
    actor F as Farmer
    participant A as PWA
    participant API as API
    participant PG as PostGIS
    participant M2 as M2 Forecast

    F->>A: "20 क्विंटल टमाटर बेचना है"
    A->>API: GET /mandi/nearby?commodity=Tomato&radius_km=60&quantity_qtl=20

    API->>PG: ST_DWithin(mandi, farm, 60km) ORDER BY distance
    PG-->>API: 8 mandis with distances
    API->>API: join mv_latest_price for each

    loop each mandi
        API->>API: gross = modal_price × 20
        API->>API: transport = ₹/km × distance × trips
        API->>API: net = gross − transport − mandi_fee − labour
    end
    API->>API: ORDER BY net_per_qtl DESC

    API-->>A: options sorted by NET, not by price
    A->>F: 🥇 करनाल ₹4,500 → शुद्ध ₹87,260 (12 किमी)<br/>2️⃣ दिल्ली ₹4,900 → शुद्ध ₹83,320 (128 किमी)<br/>💡 "दिल्ली में भाव ₹400 ज़्यादा, पर ढुलाई के बाद ₹3,940 कम"
```

> **This is the whole product in one screen.** AGMARKNET's website shows ₹4,900 for Delhi and lets
> the farmer drive 128 km to lose ₹3,940. Sorting by **net realisation** instead of headline price
> is FR-3.7, and nobody else does it.

### 3.3 Sell or hold?

```mermaid
graph TB
    S[Farmer has 20 qtl tomato] --> F["M2: forecast 30d ahead"]
    F --> G["gain = forecast.median − today"]
    G --> H["cost = storage×days + spoilage_rate×days×price"]
    H --> I{"net_gain > 0<br/>AND<br/>forecast.lower_80 > today?"}
    I -->|yes| HOLD["✅ HOLD — expected +₹X<br/>confidence: medium"]
    I -->|no| J{"forecast.upper_80 < today?"}
    J -->|yes| SELL["🔴 SELL NOW — price will fall"]
    J -->|no| NEU["⚪ NEUTRAL — no clear edge,<br/>sell if you need cash"]

    style HOLD fill:#166534,color:#fff
    style SELL fill:#991b1b,color:#fff
```

**Both conditions are required for HOLD.** A positive median with a CI that straddles today's price
is not actionable advice — it's a coin flip dressed as insight. And tomatoes spoil: `spoilage_rate`
is per-commodity, which is why "hold, price will rise" is dangerous for vegetables and reasonable
for wheat.

---

## 4. Disease Detection — FR-4

```mermaid
sequenceDiagram
    actor F as Farmer
    participant A as PWA
    participant ONNX as On-device model
    participant API as API
    participant DB as DB
    participant WX as Weather rules

    F->>A: 📷 Photographs leaf
    A->>A: Strip EXIF GPS, resize 224×224

    alt Model cached on device (offline OK)
        A->>ONNX: infer
    else First use / no model
        A->>API: GET /reference/model (~6MB, one-time)
        A->>ONNX: infer
    end

    ONNX-->>A: logits

    rect rgb(120, 53, 15)
    Note over A: SAFETY GATE 1 — OOD rejection
    A->>A: energy = −logsumexp(logits)
    alt energy > threshold
        A->>F: ❌ "यह पत्ती की तस्वीर नहीं लगती"<br/>Tips: सीधे सामने रखें, अच्छी रोशनी
        Note over A: 95%+ of hands/goats/soil rejected here
    end
    end

    rect rgb(120, 53, 15)
    Note over A: SAFETY GATE 2 — calibration
    A->>A: probs = softmax(logits / T)   [temperature-scaled]
    alt confidence < 0.70
        A->>API: log uncertain scan
        API->>DB: nearest KVK by PostGIS
        A->>F: ⚠️ "निश्चित नहीं (52%)"<br/>Top-3 possibilities<br/>📞 KVK Karnal, 18 किमी
        Note over A: Refusing to answer IS the feature
    end
    end

    Note over A: Confident path
    A->>API: POST /disease/scan (metadata + image)
    API->>DB: SELECT treatment WHERE disease_id — CITED rows only
    DB-->>API: organic[] + chemical[] with source_citation, PHI

    rect rgb(120, 53, 15)
    Note over WX: SAFETY GATE 3 — spray weather
    API->>WX: can_spray_today(farm)
    WX-->>API: NO — 75% rain in 12h, wind 18km/h
    end

    API->>API: Grad-CAM overlay
    API->>DB: INSERT disease_scan (model_version, confidence)
    API-->>A: diagnosis + organic FIRST + chemical + spray block

    A->>F: 🍅 अगेती झुलसा (87%)<br/>🌿 जैविक: ट्राइकोडर्मा 5g/L<br/>🧪 रासायनिक: मैंकोज़ेब 2.5g/L (PHI 7 दिन)<br/>🚫 आज छिड़काव न करें — बारिश आ रही है<br/>📄 स्रोत: ICAR Package of Practices 2023<br/>⚠️ KVK से पुष्टि करें
```

### Three gates, three failure modes prevented

| Gate | Prevents | Method | Target |
|---|---|---|---|
| **OOD rejection** | Confidently diagnosing a photo of a goat | Energy score | ≥95% non-leaf rejected |
| **Calibration + abstention** | "87%" meaning nothing; wrong diagnosis acted on | Temperature scaling, threshold 0.70 | ECE < 0.05 |
| **Weather gate** | Farmer wastes money spraying before rain | Rule check on forecast | Blocks when rain <24h or wind >15 km/h |

**Treatment text is never generated.** It is a SQL lookup into a table where `source_citation` is a
NOT NULL CHECK-constrained column. An LLM cannot invent a dosage because an LLM is not in this path.

---

## 5. Scheme Matching — FR-5

```mermaid
sequenceDiagram
    actor F as Farmer
    participant A as PWA
    participant API as API
    participant R as 🛡️ Rule Engine
    participant V as pgvector
    participant LLM as LLM
    participant DB as DB

    F->>A: Taps "सरकारी योजनाएं"
    A->>API: GET /schemes/eligible

    API->>DB: load farmer + farms + plots (total land, state, category, gender, age)

    rect rgb(22, 101, 52)
    Note over R: DETERMINISTIC — no ML, ever
    API->>R: evaluate(farmer, all_active_schemes)
    loop each scheme
        R->>R: land_ha ≤ 2? state in applicable? category matches? age ≥ 18?
        R->>R: record passed_rules[] and failed_rules[]
    end
    R-->>API: eligible=[PM_KISAN, PMFBY, KCC, SHC]<br/>not_eligible=[(SMAM,"land < 2ha", near_miss=true)]
    end

    API->>DB: INSERT scheme_match (audit)
    API-->>A: eligible + not_eligible WITH REASONS
    A->>F: ✅ PM-KISAN ₹6,000/वर्ष — आपकी ज़मीन 1.42 ha ≤ 2 ha<br/>❌ ट्रैक्टर सब्सिडी — 0.58 ha कम है

    F->>A: "PM-KISAN के लिए आवेदन कैसे करूं?"
    A->>API: POST /schemes/PM_KISAN/ask

    rect rgb(30, 64, 175)
    Note over V,LLM: RAG — scoped to APPROVED schemes only
    API->>V: vector search WHERE scheme_id IN (eligible_ids)
    V-->>API: top-5 chunks from official guidelines
    API->>LLM: chunks + question + "cite everything, decide nothing"
    LLM-->>API: answer + citations
    end

    API-->>A: answer + source URLs + page numbers
    A->>F: 🔊 "CSC केंद्र या pmkisan.gov.in पर आवेदन करें…"<br/>📄 स्रोत: PM-KISAN Guidelines p.4
```

### Why eligibility is never ML

```mermaid
graph LR
    subgraph "❌ WRONG"
        W1[Profile] --> W2["LLM: 'are they eligible?'"] --> W3["Maybe hallucinated yes"] --> W4["💀 Farmer travels to<br/>block office. Rejected.<br/>Day + bus fare lost.<br/>Trust gone."]
    end
    subgraph "✅ RIGHT"
        C1[Profile] --> C2["SQL rules"] --> C3["Deterministic verdict<br/>+ which rule decided"] --> C4["LLM explains<br/>the verdict it was given"]
    end
    style W3 fill:#991b1b,color:#fff
    style C2 fill:#166534,color:#fff
```

The `/schemes/eligible` response deliberately carries **no `model_version` field** — its absence is
the machine-readable proof that no model was involved (FR-5.2).

---

## 6. Weather Advisory — FR-6

```mermaid
sequenceDiagram
    participant B as Celery Beat
    participant W as Worker
    participant OM as Open-Meteo
    participant R as 🛡️ Advisory Rules
    participant DB as DB
    actor F as Farmer

    Note over B: 05:00 IST daily
    B->>W: generate_advisories()
    loop each active farm
        W->>OM: GET /forecast?lat&lon&hourly=…&daily=…
        OM-->>W: 7-day: temp, rain prob, humidity, wind, soil moisture

        rect rgb(22, 101, 52)
        Note over R: Convert NUMBERS → ACTIONS
        W->>R: evaluate(forecast, current_crop, crop_stage)
        R->>R: rain>50% OR wind>15 in 24h → SPRAY_HOLD (high)
        R->>R: soil_moisture>70% AND rain tonight → SKIP_IRRIGATION
        R->>R: tmax>38 AND crop flowering → HEAT_STRESS
        R->>R: humidity>85% AND 20<tmin<25 AND paddy → BLAST_RISK
        R->>R: 3 dry days AND harvest window → HARVEST_NOW
        R-->>W: advisories[]
        end

        W->>DB: INSERT weather_advisory
        alt severity = high
            W->>F: 📲 Push + SMS
        end
    end
```

**The design rule (FR-6.2):** never show the farmer "82% humidity". Show them
**"आज दवा न छिड़कें"** — the number is the input, the action is the output.

| Raw data | ❌ What we don't say | ✅ What we say |
|---|---|---|
| rain 82%, wind 18 km/h | "82% वर्षा संभावना" | "आज कीटनाशक न छिड़कें — दवा बह जाएगी" |
| soil moisture 76% | "मिट्टी नमी 76%" | "आज सिंचाई न करें — डीज़ल बचाएं" |
| tmax 38°C, flowering | "अधिकतम तापमान 38°C" | "दोपहर में हल्की सिंचाई करें — फूल झड़ सकते हैं" |

---

## 7. Voice Assistant — FR-7

```mermaid
sequenceDiagram
    actor F as Farmer
    participant A as PWA
    participant ASR as Bhashini ASR
    participant LLM as LLM (tool-calling)
    participant T as Platform Tools
    participant TTS as Bhashini TTS
    participant DB as DB

    F->>A: 🎤 "गेहूं काटने के बाद क्या लगाऊं और कितना कमाऊंगा?"
    A->>ASR: audio, lang=hi
    ASR-->>A: transcript

    A->>LLM: transcript + farmer_profile + TOOL_SCHEMAS + system prompt
    Note over LLM: System prompt: "You may NEVER state a number<br/>that did not come from a tool result"

    LLM->>T: get_gap_crop_recommendation(plot_id="pl_…", gap_days=71)
    activate T
    T->>T: 🛡️ rules → 🤖 M3 yield → 🤖 M2 price → score
    T->>DB: log run_id
    T-->>LLM: {crop:"Moong", profit_low:38400, profit_typical:46900,<br/>profit_high:54500, duration:65, price_as_of:"2026-08-04"}
    deactivate T

    LLM->>LLM: phrase ONLY these numbers, in Hindi
    LLM-->>A: text + tool_calls[] + numbers_used[]

    Note over A: Every numeric token is matched against<br/>tool results. Unmatched → build failure.

    A->>TTS: text, lang=hi
    TTS-->>A: audio
    A-->>F: 🔊 "समर मूंग लगाइए। 65 दिन में तैयार।<br/>3.5 एकड़ पर ₹38,400 से ₹54,500 तक शुद्ध लाभ।"<br/>📄 स्रोत: मंडी भाव 4 अगस्त 2026
```

### When no tool can answer

```mermaid
sequenceDiagram
    actor F as Farmer
    participant LLM as LLM
    participant T as Tools

    F->>LLM: "अगले साल सोना का भाव क्या होगा?"
    LLM->>LLM: No tool covers gold prices
    LLM-->>F: ❌ NOT: "सोना ₹75,000 तक जाएगा" (hallucination)
    LLM-->>F: ✅ "यह जानकारी मेरे पास नहीं है। मैं खेती के बारे में मदद कर सकता हूं।"
```

### The enforcement test (blocks the build)

```mermaid
graph LR
    A[Assistant response] --> B["Regex-extract every<br/>number token"]
    B --> C["Match each against<br/>tool_result JSON for that turn"]
    C --> D{"All matched?"}
    D -->|yes| E["✅ Pass"]
    D -->|no| F["❌ BUILD FAILS<br/>hallucinated number"]
    style F fill:#991b1b,color:#fff
```

---

## 8. Offline Workflow — FR-8.2

```mermaid
stateDiagram-v2
    [*] --> Online
    Online --> Offline: network lost
    Offline --> Online: reconnect

    state Online {
        [*] --> Fresh
        Fresh --> Fresh: fetch + cache + update IndexedDB
    }

    state Offline {
        [*] --> Cached
        Cached --> Cached: serve from cache + show staleness label
        Cached --> Queued: farmer performs a write action
        Queued --> Queued: store in IndexedDB write-queue
    }

    Offline --> Syncing: Background Sync fires
    Syncing --> Online: flush queue, refresh cache
```

| Capability | Offline? | Notes |
|---|---|---|
| View profile, farms, plots | ✅ | IndexedDB |
| View last gap-crop recommendation | ✅ | Cached with its `data_as_of` shown |
| **Scan leaf for disease** | ✅ | On-device ONNX — full diagnosis + treatment |
| Browse crop / disease / scheme library | ✅ | Reference data, 7-day SWR |
| View last-fetched prices & weather | ⚠️ | Served with a visible "कल का भाव" staleness label |
| Fresh prices, forecast, sell advice | ❌ | Needs network |
| Voice assistant | ❌ | Needs ASR/LLM/TTS |
| Record feedback / harvest data | ✅ queued | Flushed on reconnect |

---

## 9. Error & Degradation Paths — P4

```mermaid
graph TB
    R[Request] --> E{External source OK?}
    E -->|yes| FRESH["✅ Serve fresh<br/>is_stale: false"]
    E -->|no| C{Cache exists?}
    C -->|yes| STALE["⚠️ Serve cached<br/>is_stale: true<br/>+ real data_as_of<br/>UI: 'कल का भाव'"]
    C -->|no| D{DB has older data?}
    D -->|yes| OLD["⚠️ Serve last-known<br/>+ age warning"]
    D -->|no| MSG["ℹ️ Explain honestly:<br/>'भाव अभी उपलब्ध नहीं'<br/>+ retry button<br/>+ KVK phone number"]

    style FRESH fill:#166534,color:#fff
    style MSG fill:#78350f,color:#fff
```

**A blank screen or a raw error code is a bug**, not an acceptable outcome.

| Failure | Behaviour |
|---|---|
| data.gov.in down | Serve `mv_latest_price` with `is_stale: true` |
| Open-Meteo down | Last forecast + "मौसम अपडेट नहीं हुआ" |
| M2 model unloaded | Show current price only; hide forecast section entirely |
| M4 model missing | Offer server inference; if that fails, route to KVK |
| Bhashini down | Text chat still works; TTS falls back to browser `speechSynthesis` |
| LLM down | Direct module UI remains fully usable — assistant is a convenience layer, never the only path |
| DB down | 503 + status page. This is the one real outage. |

---

## 10. Development Workflow

```mermaid
graph LR
    A[Read SRS req ID] --> B[Write failing test]
    B --> C[Implement]
    C --> D[Test passes]
    D --> E{Touches rules or<br/>eligibility?}
    E -->|yes| F["≥90% coverage<br/>+ property tests"]
    E -->|no| G["≥70% coverage"]
    F --> H[PR: cite FR-x.y]
    G --> H
    H --> I["CI: lint → test → ML eval gate"]
    I --> J[Merge]
```

**PR rule:** every PR description names the `FR-x.y` / `NFR-x` it implements. A change that satisfies
no requirement is either scope creep or a missing requirement — both need a conversation before merge.

---

**Next:** [07-UI-UX-DESIGN.md](07-UI-UX-DESIGN.md) — screens and interaction design.
