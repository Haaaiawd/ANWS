---
name: tech-evaluator
description: [ALPHA] Serves `/genesis` Step 3 "Technical selection": evaluates candidate stacks with ATAM and a 12-dimension weighted matrix, producing traceable comparison conclusions and ADR promotion material; does not author formal ADR files (persisted in Step 5). Same lineage as the same-named skill in shipped `templates/`; prefer references at the same relative path inside this bundle.
---

# Technical Evaluator Handbook — [ALPHA] Genesis Step 3

> "There is no best technology stack—only the most suitable stack." — ThoughtWorks Technology Radar

This skill is grounded in **SEI ATAM (Architecture Tradeoff Analysis Method)** and **weighted decision matrices**. In **`templates_alpha/`** / **`templates_alpha_en/`** ALPHA workflows it binds to **`/genesis`** as **Step 3**; formal **ADR authoring** and numbering are governed by **Step 5** and `genesis.md`.

---

## CRITICAL /genesis gates (difference from shipped skill)

> [!IMPORTANT]
>
> - **`/genesis` Step 3**: **Only** output evaluation results and Markdown comparison material; **must not** in this step create or modify any ADR file under `.anws/v{N}/03_ADR/`. Rationale is in `genesis.md` Step 3 / Step 5: ADRs are formal decision records and must land after full review in Step 5.
> - **Step 5 persistence targets** (for downstream reference, **not** Step 3 work): elevate the Step 3 comparison table into `.anws/v{N}/03_ADR/ADR_001_TECH_STACK.md` (and sibling ADRs); **section structure is authoritative in `references/ADR_TEMPLATE.md` only**; the "ADR output template" section here is a digest—on conflict, the file wins.
> - If the host session declares it is **not** `/genesis` or explicitly authorizes "write ADRs in this step," follow **that workflow** on the spot; by default Step 3 still does not write ADRs.

> [!NOTE]
> **ADR timing**: Step 3 outputs evaluation + comparison material only—no `03_ADR/`; Step 4 yields boundaries + `02_*`; Step 5 promotes ADRs so impact aligns with real system IDs. Full table and four-point rationale: **`genesis.md`** Step 3 NOTE. Non-`/genesis` or explicit “write ADR in this step” overrides defaults.

---

## CRITICAL spec delivery contract (Step 3 artifacts)

> [!IMPORTANT]
>
> - **Verifiable**: Constraint blocks must cover functional requirements, non-functional requirements, team, budget, and special constraints; for missing items write "Not provided—evaluation assumes H-…"; silent omission is not allowed.
> - **Countable**: Each candidate stack must have a 12-dimension score table (1–5) or per-dimension "N/A + reason"; totals without a dimension breakdown are not allowed.
> - **Deducible**: ATAM paragraphs must include at least one **quality-attribute scenario**, several **trade-off points**, and several **risk points**; stacking adjectives is not allowed in place of scenarios.
> - **Promotable**: The final comparison table must **map cleanly** onto `references/ADR_TEMPLATE.md` and the sections in this doc's "ADR output template" (context / decision / comparison / trade-offs / consequences) for paste and polish in Step 5.
> - **Explicit verification strategy**: Must answer or mark open: emphasis for unit / integration / E2E tests, smoke / regression gates, and which layer owns quality gates—PR / INT / staging / release (consistent with Step 3 in `genesis.md`).
> - **Single source of truth**: Numbers and conclusions are anchored to Step 3 output; Step 5 only edits and changes status—it must not re-score backward without new evidence.

---

## Mandatory deep thinking

> [!IMPORTANT]
> Before evaluating you **must** invoke the `sequential-thinking` skill and organize **3–7 thoughts** by complexity—for example:
>
> 1. What are the user's core scenarios and must-support use-case boundaries?
> 2. Team familiarity and acceptable learning cost?
> 3. Budget and sensitivity to cloud / license TCO?
> 4. Expected scale and concurrency / data volume?
> 5. Do compliance regimes (GDPR, classified protection, etc.) veto certain stacks?

---

## Goals (Step 3)

Without **writing ADR files**, produce:

1. Structured **constraint summary** and **candidate stack list**.
2. **12-dimension scoring matrix** and weighted aggregate explanation (declare weights or use the suggestions here and justify).
3. Short **ATAM trade-offs and risks** narrative.
4. A **Markdown master comparison table** of candidates usable directly in Step 5.

---

## Evaluation flow (the evaluation)

### Step 1: Gather constraints

**Must obtain from the user or loaded artifacts** (label assumptions per spec when incomplete):

- **Functional requirements**: core capability list (may cite `01_PRD.md`).
- **Non-functional requirements**: performance, availability, security level.
- **Team**: headcount, skills, appetite to learn.
- **Budget**: dev, ops, time.
- **Special constraints**: compliance, legacy integration, mandated technologies.
- (If Step 2.5 ran) Evidence and alternatives from `/explore` research.

#### What to do

Fix input boundaries and list gaps with hypothesis IDs.

#### Why

Avoid preference scoring without constraints and unreproducible conclusions.

#### How to validate

Outputs may include a "hypothesis H-xx" cross-reference table; no silent gaps.

---

### Step 2: Identify candidates

**Mainstream stack reference** (replace or extend per project):


| Scenario | Recommended stack | Alternatives |
| -------- | ----------------- | ------------ |
| **Web full-stack** | Next.js + TypeScript | Nuxt, SvelteKit |
| **Backend API** | Go / Rust / Node.js | Python FastAPI, Java Spring |
| **Desktop** | Tauri (Rust + Web) | Electron, Flutter Desktop |
| **Mobile** | React Native / Flutter | Swift/Kotlin native |
| **AI/ML** | Python + PyTorch/TensorFlow | Rust (Candle), Julia |
| **Data-heavy** | PostgreSQL + TimescaleDB | ClickHouse, DuckDB |


#### What to do

List **two or more named** candidates (language / framework / key middleware) with one line stating scope.

#### Why

Single candidate yields no trade-off and cannot satisfy ATAM.

#### How to validate

Each candidate is scored independently; no anonymous "option A/B."

---

### Step 3: 12-dimension evaluation

Score each candidate 1–5 per dimension:


| Dimension | Weight hint | Evaluation question |
| --------- | ----------- | ------------------- |
| **Requirement fit** | — | Covers all core functionality? |
| **Scalability** | — | Supports 10x growth? |
| **Performance** | — | Meets latency / throughput? |
| **Security** | — | Built-in security and compliance support? |
| **Team skill** | — | Familiarity and learning curve? |
| **Talent market** | — | Hiring and outsource availability? |
| **Development speed** | — | Iteration and delivery velocity? |
| **TCO** | — | Dev + ops + licensing? |
| **Community/ecosystem** | — | Libraries, tools, troubleshooting assets? |
| **Long-term maintenance** | — | Shelf life and LTS? |
| **Integration** | — | Legacy and third-party integration? |
| **AI readiness** | — | Ease of wiring AI / LLMs? |


#### What to do

Complete the matrix; declare weights (even or weighted) and compute comparable totals or tiers.

#### Why

Dimensional transparency aids ADR evidence in Step 5.

#### How to validate

Tables are recalculable in Markdown; N/A dimensions get a single-line rationale.

---

### Step 4: Trade-off analysis (ATAM)

1. Identify **quality-attribute scenarios** (e.g., "Under 1k concurrent users, P95 < 200 ms").
2. Grade each candidate's **support** for the scenario.
3. List **trade-offs** (e.g., performance vs team learning cost).
4. List **risks** (e.g., maturity of a new framework).

#### What to do

Say clearly **why runner-up lost**.

#### Why

ADR value is trade-offs and consequences, not merely declaring a winner.

#### How to validate

At least one scenario plus several trade-offs / risks cross-referenced with candidate tables.

---

### Step 5: Produce ADR promotion material (Step 3—not persisted)

Under **`/genesis` Step 3** you **must not** create `ADR_001_TECH_STACK.md`. Instead output **Markdown** shaped like "ADR output template" below; sections may be marked `Proposed` / `TBD` for Step 5 to copy, `Accepted`, and save under `03_ADR/`.

If the workflow rarely demands placeholder files this step, only empty files or MANIFEST paths are allowed—**do not** treat placeholders as accepted ADRs.

#### What to do

Produce full comparison + ADR-shaped draft Markdown (in memory / session).

#### Why

Align with `genesis` decision checkpoints; avoid early informal ADRs.

#### How to validate

The parent agent can open `references/ADR_TEMPLATE.md` in Step 5 and align fields without information breaks.

---

## ADR output template (for elevation; Step 5)

```markdown
# ADR-001: Technology stack selection

## Status
Accepted / Proposed / Deprecated

## Context
[Project context and constraints]

## Decision
[Chosen stack and core rationale]

## Candidate comparison

| Candidate | Score | Strengths | Weaknesses |
| --------- | ----- | --------- | ---------- |
| Option A | 42/60 | ... | ... |
| Option B | 38/60 | ... | ... |

## Trade-offs
- [Trade-off 1]
- [Trade-off 2]

## Consequences
- Positive: [...]
- Negative: [...]
- Follow-up actions: [...]
```

---

## Practitioner rules

1. **Prefer "boring" tech**: choose mature stacks unless there is strong reason not to.
2. **Limited innovation budget**: 1–2 innovation slots per project; keep the rest conservative.
3. **Team capability wins**: the best technology is zero value if it cannot be wielded.
4. **TCO is not cash alone**: time and cognitive load count.

---

## references and bundle paths

This bundle includes **`templates_alpha_en/.agents/skills/tech-evaluator/references/ADR_TEMPLATE.md`** mirrored from shipped **`templates/`**. Read **only** `references/` beside this SKILL; **do not** mix-read shipped `templates/.agents/skills/tech-evaluator/` in the same session.

| File | Purpose |
|------|---------|
| `references/ADR_TEMPLATE.md` | ADR shape and required sections |

---

## Execution shape and subagent orchestration

### What to do

- **Preferred**: When the host provides **AGENTS / subagents**, you may delegate **candidate discovery**, **per-candidate multidimensional drafts**, or **ATAM risk sketches**; the orchestrator issues this doc's **spec contract + gates + ADR template fields**, then merges into **one consolidated draft**.
- **Parent agent**: `sequential-thinking` **must** run one full chain in the main session or a designated merge agent before locking; subagents cannot replace that duty unless the workflow states otherwise.
- **Fallback**: Without subagents, the current session runs the whole flow end to end.

### Why

Parallel discovery and serialized decisions reduce gaps across dimensions.

### How to validate

Merged draft still meets spec; no contradictory scores or duplicate candidate names; `/genesis` Step 3 still performs **no** `03_ADR` writes.

---

## Handoff checklist (orchestration / subagents / Step 5)

- [ ] Constraints and hypotheses H-xx are listed or explicit gaps declared.
- [ ] 12-dimension matrix + weight explanation complete.
- [ ] ATAM: scenarios, trade-offs, risks complete.
- [ ] Markdown comparison maps to `references/ADR_TEMPLATE.md`.
- [ ] Verification strategy and test-tier gates answered or flagged "TBD Step 5 / design-system".
- [ ] **`/genesis` Step 3**: confirm no create / edit of `03_ADR/*.md`.

---

<completion_criteria>
- `sequential-thinking` completed with 3–7 thoughts visible in output and absorbed by the evaluation.
- Deliverables meet **CRITICAL spec delivery contract** (verifiable / countable / deducible / promotable / explicit verification strategy).
- On the default `/genesis` Step 3 path, **no** ADR persisted under `.anws/v{N}/03_ADR/`.
- Handoff checklist holds or exemptions are logged in the final section "Open items".
- If loaded from `templates_alpha` or `templates_alpha_en`, use the **same overlay tree** as other skills in this session; do not mix shipped `templates/` variants for the same step to avoid gate drift.
</completion_criteria>
