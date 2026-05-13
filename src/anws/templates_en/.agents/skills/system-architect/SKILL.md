---
name: system-architect
description: [ALPHA] Dedicated to `/genesis` Step 4: identify independent systems, define boundaries and dependencies, produce `.anws/v{N}/02_ARCHITECTURE_OVERVIEW.md` (including source roots and physical layout); supply input for Step 5 ADR and subsequent contract-level `references/rfc_template.md`; this skill does **not** write `03_ADR/*.md`. Do **not** mix-read the same-named skill from shipped `templates/` in the same session.
---

# system-architect ([ALPHA] `/genesis` Step 4–5 handoff)

> Good architecture is mostly “splitting the problem into the right systems,” not building a perfect monolith.

<phase_context>
You are the **system architect for `/genesis` Step 4**.  
**Mission**: Inside the versioned directory `TARGET_DIR = .anws/v{N}`, produce an actionable system inventory, boundaries, dependency view, and mapping to physical repository roots.  
**Capability**: Six-dimension identification, C4 Level 1 and dependency visualization, split rationale and complexity narrative aligned with human checkpoint #2.  
**Constraints**: Strictly follow genesis step order; **do not** write or alter `03_ADR/*.md`, `01_PRD.md`, or task lists in this skill session (ADR belongs only to **Step 5**); do not weaken the CRITICAL blocks, severity table, RFC/ADR split, or Overview template structure below.  
**Relationship to subflows**: If the host workflow is the ALPHA overlay, only the skill under **`templates_alpha/`** (and mirror `templates_alpha_en/`) is authoritative; **do not** parallel-mix clauses with `templates/.agents/skills/system-architect/`.
</phase_context>

---

## CRITICAL methodological anchors

> [!IMPORTANT]
> **The goal of decomposition is boundaries that decisions and implementation can align to**, not piling up system names.
>
> - **Elicit, do not decree**: Restore PRD scope and tech-evaluator Step 3 constraints before listing systems; skips here often conflict later with ADR.  
> - **Expand, do not mono-track**: Each system row must stand on at least two independent legs among **deployment unit / tech stack / responsibility**; single-criterion splits must be logged explicitly as risk and verification debt.  
> - **Lift, then ground**: Clarify cross-system seams (contracts, failure semantics, ownership) before assigning `system-id`, directory trees, and matrices; stopping at folder metaphors or slogans is not shippable.  
> - **Rebuild, do not paraphrase**: Rebuild boundary matrices for “who promises what output under what inputs,” instead of rewriting PRD sentences.

---

## CRITICAL spec output contract (`02_ARCHITECTURE_OVERVIEW.md`)

> [!IMPORTANT]
>
> - **Precise**: Each system must include a stable **`system-id`**, `Responsibility`, `Boundary (I/O)`, `Dependencies`, `Linked REQ refs`, `Tech stack`, and `Design doc relative path placeholder` (aligned with the template); physical mapping must give **traceable** source-root paths (literal path strings).  
> - **Traceable**: Every row in matrices and dependency diagrams must have a matching section in the inventory; forbidden to show charts alone with no prose definitions.  
> - **Testable**: Decomposition rationale must answer “why not split further” and “why not merge” with at least one example each, tied to the complexity assessment.  
> - **No hollow filler**: Forbidden to use objectless “TBD,” “optimize later,” or “it depends” placeholders; unknowns must be marked **`[OPEN: specific question + owner granularity]`**.  
> - **Two diagrams required**: Must include Mermaid **system context (C4 L1)** and **system dependency graph**, consistent with matrices.

---

## CRITICAL: `/genesis` order and ADR/RFC responsibilities

> [!IMPORTANT]
> **`/genesis` enforced order is Step 0→6 (Step 6 includes subsections 6.1–6.4); no skipping.** This skill covers **Step 4** only.  
>
> **Sole objective path for this skill (Step 4)**: Write **`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`** (structure matches template sections below); implement Step 4–specific **source roots + ASCII physical tree** (see template and phase notes).  
> **Forbidden**: Renaming Step 3 evaluation tables into ADR files; **do not** write `{TARGET_DIR}/03_ADR/*` from this skill. ADR authoring belongs to **`/genesis` Step 5** and must build on Step 3 candidate comparison and Step 4 boundaries.  
> **RFC (technical design memo)**: For single-system depth, treat `references/rfc_template.md` from **this repo’s skill bundle** as structural authority; `/genesis` does **not** require an RFC every step—the **system design doc path** is recorded in each Overview row’s “Design doc” field; RFC may precede `04_SYSTEM_DESIGN` as a draft **and is not a mandatory artifact for this Step**.  
> **ADR write checklist (for Step 5 execution only; this Step supplies input—do not mark as done)**:
>
> | Gate | Rule |
> |------|------|
> | ADR aligns with Step 3 | Step 5 must absorb Step 3 candidate comparison into alternatives and decisions |
> | Step 2.5 backfill | If `/explore` ran, Step 5 must fold research evidence into rationale |
> | ADR status | **Accepted** |
> | “Scope of impact” section | Must exist; list systems that will reference this ADR (maintain cross-SYSTEM_DESIGN after Step 6 if needed) |
> | ADR structure | Follow `tech-evaluator` **`references/ADR_TEMPLATE.md`** in full (summary below)

**ADR_TEMPLATE sections must not be dropped (extract = launch rules; prose in Step 5)**:

| Section | Must satisfy |
|---------|---------------|
| Status | Proposed \| Accepted \| Deprecated \| Superseded … |
| Date | `YYYY-MM-DD` |
| Context | Problem, constraints, stakeholder expectations |
| Decision drivers | Numbered list |
| Alternatives | Tradeoffs across options |
| Decision | Explicit chosen option |
| Consequences | Positive / negative / follow-ups |
| References | May be empty but do not delete the heading |
| Scope of impact | Placeholder paths for systems / docs that will cite this ADR |

---

## CRITICAL: `sequential-thinking`

> [!IMPORTANT]
> **Must** invoke `sequential-thinking` **before** listing system IDs: **3–7 thoughts** (use 3 for low complexity; 7 for high coupling or many surfaces), covering split/merge options, evolution, and physical boundaries; natural chain-of-thought **cannot** substitute for this CLI obligation (if CLI unavailable, declare **`SEQUENTIAL_THINKING_BLOCKED`** at the top of output and degrade to a traceable bullet list of hypotheses—do not invent thoughts).

---

## Severity levels (Overview self-review / human checkpoint #2)

| Level | When | Required action |
|-------|------|-----------------|
| **Critical** | Overview contradicts PRD coverage; boundaries make requirements impossible; missing genesis-required physical roots / mandatory diagrams | Must fix before Step 5 |
| **High** | Dependency cycles; cross-system contracts entirely blank; granularity extreme (one-box or pulverized) without rationale | Fix before forge or close via ADR / added design |
| **Medium** | Boundary wording fuzzy but decodable; one-sided dependence heavy but refactorable | Pay down in Step or design |
| **Low** | Doc phrasing, ordering, formatting | Continuous improvement |

---

## Sub-agent orchestration

**Parent (`/genesis` host session)**: Owns `TARGET_DIR`, final write of `02_ARCHITECTURE_OVERVIEW.md`, pacing of human checkpoints, and routing to Step 5.  
**Child (if available)**: May receive slices such as “six-dimension draft only / Mermaid only / matrix consistency audit”; **must not** sole-author the same path file.  

**Handoff checklist** (child self-check before returning to parent)

- [ ] Stated **write / advisory-only-no-disk** plus one-line reason  
- [ ] All system IDs unique document-wide; matrix matches dependency diagram  
- [ ] **Did not** touch `03_ADR/`, `01_PRD.md`  
- [ ] Critical/High items escalated to parent for decision  

---

## Top-level phases: `/genesis` Step 4 (includes Step 5 input prep)

The five phases below are the Step 4 execution bundle; afterward the host advances to **Step 5 ADR authoring** (not written directly by this skill).

### Phase A: Inputs and timeline anchoring

**Do**: Confirm `TARGET_DIR`; load `01_PRD.md`, `concept_model.json` (if any), Step 3 evaluation conclusions (in memory or summary); extract `[REQ-*]`.  
**Why**: Decomposition without object produces “architecture prose.”  
**Done when**: Can list ≥3 deployment/runtime-related hard constraints from PRD + Step 3; thought indexes ran as planned.

### Phase B: Six-dimension identification (synthesize candidate list)

**Do**: Walk **user touchpoints / data stores / core logic / external integrations / deployment units / tech stack**, producing candidate **`system-id` drafts**.  
**Why**: Exhaust dimensions to reduce missed systems.  
**Done when**: Each dimension has an explicit row or one-line `N/A` rationale; draft count lands in **3–10** or a defensible rare exception.

### Phase C: Boundaries, dependencies, and requirement traceability

**Do**: For each system clarify **I/O boundaries**; build **boundary matrix + dependency diagram**; attach linked requirement IDs.  
**Why**: Seams are where ADR and downstream design bite.  
**Done when**: Matrix row count matches inventory; each edge appears once per endpoint pair in entries; no cycles unless rationale explains acceptance.

### Phase D: Physical code mapping (`/genesis` Step 4 CRITICAL)

**Do**: Per system: **source root path** (e.g. `src/packages/frontend`) **+ ASCII directory tree.**  
**Why**: Clone and IDE import depend on physical truth.  
**Done when**: No “TBD-only” trees without `[OPEN]` records; paths match mono/polyrepo assumptions.

### Phase E: Author, persist `02_*`, hand off Step 5–ready

**Do**: Fill `02_ARCHITECTURE_OVERVIEW.md` per **Output format template**; self-check severity; prepare one-page exec summary for human checkpoint #2 (optional shortlist at end).  
**Why**: ADR must anchor to stable system boundaries.  
**Done when**: Template §1–8 complete; explicit zero or escalate **`[OPEN]`** for issues ≥`High` with parent acceptance; parent knows **Step 5** is next.

### Step 5 input readiness (host executes; this skill review list)

**Do**: Hand over **full system-ID set**, **cross-system open questions**, `[OPEN]` items, pointers to Step 3 comparison.  
**Why**: ADR must cite real boundaries and alternatives provenance.  
**Done when**: `tech-evaluator` ADR_TEMPLATE can be filled without conflict; ADR “scope of impact” can pre-list system placeholders.

---

## Core principles

> [!IMPORTANT]
> **Separation of concerns**: one major concern per system; **clear boundaries**: explicit I/O and data contracts; **moderate decomposition**: avoid **>10** systems without cause; forbid **unjustified single system**.  
>
> **Anti-patterns**: one system per feature / monolith without seams / layered blame salad / “frontend+backend mashed in one row”  
> **Good patterns**: justify split or merge by stack, deployment unit, responsibility, change frequency  

---

## System identification framework: 6 dimensions (execution sweep)

### 1. User touchpoints

Web / Mobile / CLI / API Gateway… → Usually map to distinct `*-system`s. Different stacks or deployments **must not** be forced into one ID.

### 2. Data storage

DB, cache, object store, search; merge only under **same ops boundary + shared access pattern + no independent lifecycle for a split**, and record rationale.

### 3. Core business logic

API, agent, pipeline, batch; typical split lines when evolution pace and SLA differ.

### 4. External integrations

OAuth, payments, LLM; default stays inside owning system boundary unless integration complexity warrants its own system ID.

### 5. Deployment units

CDN static / container services / worker; **one-to-one mapping to system candidates** is common.

### 6. Tech stack

Stack delta is a strong decomposition signal (e.g. React + FastAPI + PG → boundary pressure on at least three system dimensions).

---

## Output format: Architecture Overview template

Use this structure to produce **`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`**:

```markdown
# Architecture Overview

**Project**: [Project Name]
**Version**: 1.0
**Date**: [YYYY-MM-DD]

---

## 1. System Context

### 1.1 C4 Level 1 - System Context Diagram

[Use Mermaid for users and external systems]

\`\`\`mermaid
graph TD
    User[User] -->|HTTP| WebApp[Web Application]
    WebApp -->|API| Backend[Backend Service]
    Backend -->|Query| DB[(Database)]
    Backend -->|Call| LLM[LLM API]
\`\`\`

### 1.2 Key Users
- **End user**: Uses the web UI
- **Admin**: Manages configuration
- ...

### 1.3 External Systems
- **LLM API**: OpenAI / Anthropic
- **Identity**: Auth0 / OAuth
- ...

---

## 2. System Inventory

### System 1: Frontend UX System
**system-id**: `frontend-system`

**Responsibility**:
- UI presentation and interaction
- API client wrapping
- Client-side state management

**Boundary**:
- **Input**: User actions (clicks, typing)
- **Output**: HTTP API requests
- **Dependencies**: backend-api-system

**Linked requirements**: [REQ-001] Sign-in, [REQ-002] Dashboard

**Tech stack**:
- Framework: React 18
- Build: Vite
- Styling: TailwindCSS
- State: Context API / Zustand

**Source root**: `src/packages/frontend`

**Repository layout (ASCII)**:
```
src/packages/frontend/
  apps/
  components/
...
```

**Design doc**: `04_SYSTEM_DESIGN/frontend-system.md` (to be created)

---

### System 2: Backend API System
**system-id**: `backend-api-system`

**Responsibility**:
- REST API
- Business logic
- Database access

**Boundary**:
- **Input**: HTTP requests (JSON)
- **Output**: HTTP responses (JSON)
- **Dependencies**: database-system, agent-system

**Linked requirements**: [REQ-001] Sign-in, [REQ-003] Queries

**Tech stack**:
- Framework: FastAPI
- Language: Python 3.11
- ORM: SQLAlchemy
- Auth: JWT

**Source root**: `src/backend/api`

**Repository layout (ASCII)**:
```
src/backend/api/
  api/
  services/
...
```

**Design doc**: `04_SYSTEM_DESIGN/backend-api-system.md` (to be created)

---

### System 3: Database System
**system-id**: `database-system`

**Responsibility**:
- Persistence
- Queries and indexes
- Backup and recovery

**Boundary**:
- **Input**: SQL queries
- **Output**: Result sets
- **Dependencies**: none (infrastructure)

**Linked requirements**: all storage-related requirements

**Tech stack**:
- Database: PostgreSQL 15
- Cache: Redis 7
- ORM: SQLAlchemy

**Source root**: `infra/db` or `[schema/migrations path]`

**Repository layout (ASCII)**:
```
db/migrations/
...
```

**Design doc**: `04_SYSTEM_DESIGN/database-system.md` (to be created)

---

[Continue with additional systems…]

---

## 3. System Boundary Matrix

| System | Input | Output | Depends on | Depended by | Linked REQs |
|--------|-------|--------|------------|-------------|-------------|
| Frontend | User actions | HTTP requests | Backend API | — | [REQ-001], [REQ-002] |
| Backend API | HTTP requests | JSON responses | Database, Agent | Frontend | [REQ-001], [REQ-003] |
| Database | SQL | Results | — | Backend API, Agent | All |
| Agent System | Task requests | Outcomes | Database, LLM API | Backend API | [REQ-005] |

---

## 4. System Dependency Graph

\`\`\`mermaid
graph TD
    Frontend[Frontend System] -->|API Call| Backend[Backend API System]
    Backend -->|Query| DB[Database System]
    Backend -->|Invoke| Agent[Agent System]
    Agent -->|Query| DB
    Agent -->|Call| LLM[LLM API - External]
    
    style Frontend fill:#e1f5ff
    style Backend fill:#fff4e1
    style DB fill:#e1ffe1
    style Agent fill:#ffe1f5
\`\`\`

**Dependency notes**:
- Frontend depends on Backend (classic split)
- Backend is the hub coordinating Database and Agent
- Agent runs reasoning but needs Database support

---

## 5. Technology Stack Overview

| Layer | Technology | Used by |
|-------|------------|---------|
| **Frontend** | React, Vite, TailwindCSS | Frontend System |
| **Backend** | Python, FastAPI, SQLAlchemy | Backend API System |
| **Database** | PostgreSQL, Redis | Database System |
| **Agent** | LangGraph, OpenAI | Agent System |
| **Infrastructure** | Docker, Kubernetes | All Systems |

---

## 6. Decomposition Rationale

### Why these systems?

**Stack dimension**:
- Frontend (React) vs Backend (Python) → different stacks, justified split

**Deployment dimension**:
- Frontend (CDN static) vs Backend (containers) → different deployment

**Responsibility dimension**:
- Backend API (business) vs Agent (reasoning) → parallelizable ownership

**Change frequency**:
- Frontend churn vs stable schema → easier evolution when split

### Why not split further?

**Why not multiple Frontend systems?**
- Multiple pages share state and components; more systems add cost

**Why not microservices for Backend now?**
- Scale does not justify it yet; modular monolith suffices
- Separation of concerns can live in modular code

---

## 7. Complexity Assessment

**System count**: 4

**Assessment**:
- Reasonable (< 10)
- Clear boundaries
- Simple deps (acyclic)

**Risks**:
- Backend API may bottleneck (coordinates many systems)
- Possible future Backend split (e.g., when codebase > ~50k LOC)

---

## 8. Next Steps

### Detailed design per system

Run:

\`\`\`bash
/design-system frontend-system
/design-system backend-api-system
/design-system database-system
/design-system agent-system
\`\`\`

### `/genesis` Step 5 reminder (host)

- Host should write `03_ADR/ADR_001_TECH_STACK.md` and other cross-cutting decisions from Step **3 + this document**, following `ADR_TEMPLATE.md`.

### `/blueprint` prerequisite (after overall design exists)

\`\`\`bash
/blueprint
\`\`\`
```

---

## Decomposition guardrails

### Guardrail 1: Do not over-split

**Rule**: System count typically **< 10**. A split must buy independent deployment value, lifecycle, or stack difference.

### Guardrail 2: Do not over-bundle

**Rule**: Frontend, backend, database **usually** map to three distinct system IDs (exceptions need ADR-level argument).

### Guardrail 3: Boundaries must be crisp

**Rule**: Each entry must clarify **inputs / outputs / serialization semantics** (at least JSON/Event/SQL class).

### Guardrail 4: Use C4 + Mermaid

**Rule**: Context + dependency diagrams must match the matrix.

---

## RFC (`references/rfc_template.md`) structural contract — excerpt rules

Use only when you need **API / function signatures / DDL** fidelity; **do not delete chapter skeleton.**

| RFC required block | Rule |
|--------------------|------|
| High-level design + Mermaid | Traceable data flow and component layers |
| API contracts / interfaces | **Exact signatures**; no pretending placeholders are final |
| Data model strategy | DDL changes or equivalent statements |
| Implementation steps | Atomic, ordered |
| Security & risk | Explicit auth and validation |

Full template: shipped bundle `.agents/skills/system-architect/references/rfc_template.md` (ALPHA host: if localized, keep equivalent chapters).

---

## Toolbox

**Identification checklist**: touchpoints / storage / core logic / external / deployment / stack — tick each row.  
**Persist self-check**: **Quality checklist** + **severity table** above.

---

## Common scenarios (short)

| Scenario | Systems (typical count) |
|----------|-------------------------|
| Classic web trio | Frontend + Backend API + DB (3) |
| + Agent | + Agent (4) |
| Enterprise-ish | Web + Mobile + Backend + DB + Search + Worker (≤6–8) |

---

## Quality checklist

### Count

- Typical **3–10**; no feature-level micro-services; no unjustified single column

### Boundaries

- I/O + contract clarity; single responsibility without cross-cutting muddle

### Dependencies

- No unexplained cycles; Mermaid matches matrix; outbound deps **> 5** per system should have mitigation

### Completeness (Step 4)

- §1–8 **per template**  
- Physical root + ASCII tree **per system**  
- Decomposition rationale answers hedge questions  

---

## CRITICAL: `/genesis` integration notes (host excerpt, read-only)

Host **Step 6** refreshes **`AGENTS.md`** to match this Overview; host **must not** overwrite system boundaries here with unfinished Step 5 ADR text. **Git branch switching** still follows host `genesis.md` "Pre-Check."

---

<completion_criteria>
- Architecture Overview **template §1–8** (incl. boundary matrix + main tech tables), **four decomposition guardrails**, **severity table**, **RFC excerpt rules + ADR/RFC responsibilities + ADR_TEMPLATE section table** remain in normative shape with no emoji.  
- **CRITICAL** blocks present: **methodological anchors**, **spec output contract**, **genesis order + ADR/RFC split**, **sequential-thinking**.  
- **Sub-agent orchestration** and handoff checklist present; top-level **five Step 4 phases** + **Step 5 input readiness** each include **Do / Why / Done when**.  
- **phase_context** applied; wording reflects **[ALPHA]** and same-session prohibition on mixing canonical `templates/` skill with same name.  
- Output path still **`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`**.  
</completion_criteria>
