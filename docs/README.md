# SmartKisan — Documentation

Complete SDLC design set. **Read in order** — each document builds on the previous one.

---

## Reading Paths

**🆕 New to the project?**
→ [README](../README.md) → [06 Workflows](06-WORKFLOWS.md) → [01 SRS](01-SRS.md)

The workflow diagrams make the system click faster than any prose.

**👨‍💻 About to write code?**
→ [01 SRS](01-SRS.md) → [02 System Design](02-SYSTEM-DESIGN.md) → [03 Data](03-DATA-DESIGN.md) → [05 API](05-API-DESIGN.md) → [09 Testing](09-TESTING-STRATEGY.md)

**🧠 Interested in the ML?**
→ [04 ML Design](04-ML-DESIGN.md) → [03 Data §1](03-DATA-DESIGN.md) → [09 Testing §6-7](09-TESTING-STRATEGY.md)

**🎨 Working on UI?**
→ [07 UI/UX](07-UI-UX-DESIGN.md) → [06 Workflows](06-WORKFLOWS.md) → [05 API](05-API-DESIGN.md)

**📅 Planning or reviewing?**
→ [08 Project Plan](08-PROJECT-PLAN.md) → [01 SRS §6 Acceptance](01-SRS.md)

---

## Documents

| # | Document | What it answers |
|---|---|---|
| 01 | [SRS](01-SRS.md) | **What** must it do? Requirements, personas, constraints, acceptance criteria |
| 02 | [System Design](02-SYSTEM-DESIGN.md) | **How** is it structured? Architecture, tech choices, ADRs, security |
| 03 | [Data Design](03-DATA-DESIGN.md) | **What data**, from where? Verified sources, ERD, schema, quality, privacy |
| 04 | [ML Design](04-ML-DESIGN.md) | **What models**, trained how? Datasets, baselines, metrics, safety, MLOps |
| 05 | [API Design](05-API-DESIGN.md) | **What contracts?** Endpoints with real request/response examples |
| 06 | [Workflows](06-WORKFLOWS.md) | **What happens**, step by step? Sequence diagrams per journey |
| 07 | [UI/UX Design](07-UI-UX-DESIGN.md) | **What does the farmer see?** Screens, design system, accessibility |
| 08 | [Project Plan](08-PROJECT-PLAN.md) | **When**, and what could go wrong? Phases, milestones, risks |
| 09 | [Testing Strategy](09-TESTING-STRATEGY.md) | **How do we know it works?** Test pyramid, gates, CI |

---

## The Three Rules Everything Traces Back To

Every design decision in these documents follows from these.

### 1. Rules bound ML, never the reverse
ML **ranks**. Rules **permit**. A model may reorder valid options; it may never introduce one that
violates an agronomic, legal, or safety constraint.
→ [02 §1 P1](02-SYSTEM-DESIGN.md), [04 §0](04-ML-DESIGN.md), [09 §4](09-TESTING-STRATEGY.md)

### 2. The LLM narrates; it never computes
Every rupee, dosage, date, and verdict comes from deterministic code or a registered model.
→ [02 §1 P2](02-SYSTEM-DESIGN.md), [04 §7](04-ML-DESIGN.md), [09 §7](09-TESTING-STRATEGY.md)

### 3. Uncertainty is displayed, not hidden
Ranges over point estimates. Calibrated confidence. "I don't know" as a first-class answer.
→ [02 §1 P3](02-SYSTEM-DESIGN.md), [04 §5.3](04-ML-DESIGN.md), [07 §1](07-UI-UX-DESIGN.md)

---

## Requirement Traceability

| Requirement | Design | Workflow | Tests |
|---|---|---|---|
| FR-1 Profile | [03 §4.2](03-DATA-DESIGN.md) | [06 §1](06-WORKFLOWS.md) | [09 §3.2](09-TESTING-STRATEGY.md) |
| FR-2 Gap Crop | [04 §2](04-ML-DESIGN.md) | [06 §2](06-WORKFLOWS.md) | [09 §3.1, §4](09-TESTING-STRATEGY.md) |
| FR-3 Mandi | [04 §3](04-ML-DESIGN.md) | [06 §3](06-WORKFLOWS.md) | [09 §5, §6](09-TESTING-STRATEGY.md) |
| FR-4 Disease | [04 §5](04-ML-DESIGN.md) | [06 §4](06-WORKFLOWS.md) | [09 §6](09-TESTING-STRATEGY.md) |
| FR-5 Schemes | [04 §6](04-ML-DESIGN.md) | [06 §5](06-WORKFLOWS.md) | [09 §3.4](09-TESTING-STRATEGY.md) |
| FR-6 Weather | [02 §5.1](02-SYSTEM-DESIGN.md) | [06 §6](06-WORKFLOWS.md) | [09 §5](09-TESTING-STRATEGY.md) |
| FR-7 Voice | [04 §7](04-ML-DESIGN.md) | [06 §7](06-WORKFLOWS.md) | [09 §7](09-TESTING-STRATEGY.md) |
| FR-8 Offline/i18n | [02 §7](02-SYSTEM-DESIGN.md) | [06 §8](06-WORKFLOWS.md) | [09 §8](09-TESTING-STRATEGY.md) |

---

## Document Conventions

- **`FR-x.y`** — functional requirement, defined in [01 SRS §3](01-SRS.md)
- **`NFR-x.y`** — non-functional requirement, [01 SRS §4](01-SRS.md)
- **`ADR-x`** — architecture decision record, [02 §11](02-SYSTEM-DESIGN.md)
- **`C-x`** — constraint, [01 SRS §5](01-SRS.md)
- **`R-x`** — risk, [08 §4](08-PROJECT-PLAN.md)
- **`M1`–`M6`** — ML models, [04 §1](04-ML-DESIGN.md)
- **`P1`–`P5`** — design principles, [02 §1](02-SYSTEM-DESIGN.md)

**PR rule:** every pull request cites the `FR-x.y` / `NFR-x` it implements. A change satisfying no
requirement is either scope creep or a missing requirement — both need a conversation first.

---

**Version:** 2.0 · **Last updated:** 2026-08-04
