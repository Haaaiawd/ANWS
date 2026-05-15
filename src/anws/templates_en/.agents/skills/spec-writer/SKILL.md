---
name: spec-writer
description: "genesis Step 2: turn fuzzy or high-level needs into strict product requirement documents (PRDs); includes craft scaffolding, PRD spec contract, optional sub-agent shard orchestration, and Step completion signals. Use when requirements are vague, scope is too large, or expression stays conceptual."
---

# Requirements Detective Handbook

> "The hardest part of building software isn't how to implement it—it's precisely defining what to implement."

Your job is to **eliminate ambiguity**.

## genesis Step 2 (scope and handoff)

Compared with `templates/.agents/skills/spec-writer`, this template adds **craft scaffolding**, **spec contract** (on-disk semantics), **sub-agent orchestration**, and **completion**. The normative force of **Execution checklist / Methodology / 10-dimension ambiguity scan / User Story quality gate** sections is **unchanged**—rules such as Socratic probing, **one question at a time**, the hard cap on `[NEEDS CLARIFICATION]`, Non-Goals, and the User Story gate **apply verbatim**.

### Craft scaffolding (artifact skeleton)

Before **Execution checklist** step 4 (writing `01_PRD.md`), the skeleton **must first** be in place; when filling content, **do not remove normative sections** from the template. Where there is no information, write **`[NOT APPLICABLE | reason]`** or **`[ASSUMPTION]`**—never leave blanks that pretend completeness.

| Artifact | Path | Requirement |
|----------|------|---------------|
| Version directory | `.anws/v{N}/` | `v{N}` must match host genesis / session convention; create on first round or explicitly reuse existing `v{N}`; silent fork forbidden. |
| PRD | `.anws/v{N}/01_PRD.md` | **Single source of truth** for Step 2 output; content driven by `references/prd_template.md`; **forbidden** to replace on-disk artifact with long chat-only prose only. |
| Template | `references/prd_template.md` | Read in full **before** drafting PRD; heading levels and mandatory sections follow the template; extra appendices allowed but cannot replace mandatory template sections. |

**Readiness check (internal; may summarize for user):** `v{N}` chosen; this SKILL + `prd_template.md` read; enumerate at least 3 User Story drafts and ≥3 Non-Goals before expanding written PRD sections.

### Spec contract (PRD on-disk semantics)

> [!IMPORTANT]
> When folded into the genesis pipeline, PRD sections are treated as **assertable draft contracts** for downstream work (architecture, task breakdown, challenge) and must satisfy:
>
> - **Verifiable:** Any statement of "must / must not / SLA / user counts / compatibility" needs Given-When-Then, metrics, or enumerated options; otherwise it cannot be marked as implemented—only `[ASSUMPTION]` or move to Non-Goals.  
> - **Traceable:** Every User Story carries `[REQ-XXX]`; terms and systems must be **internally consistent** with "Affected systems" below (when aligning to `02_ARCHITECTURE_OVERVIEW.md` downstream, no arbitrary renames).  
> - **Ambiguity-bounded:** `[NEEDS CLARIFICATION]` **≤ 3** (hard limit); if exceeded, use defaults + `[ASSUMPTION: …]`; **forbidden** to re-ask generic defaults stated in this document's 10-dimension scan to pad counts.  
> - **Value-traceable:** Every requirement aligns to user value in one sentence; Non-Goals and Goals are **mutually exclusive** with no empty "maybe won't do".  
> - **Consistent:** The same fact is **not stated twice contradictorily** in summary vs detail; fixes use **atomic paragraph replacement**, not side-by-side conflicting wording.

Challenge / downstream alignment: If excerpts from the PRD appear in reports or attachments, excerpts must carry **subsection anchors** or **stable headings from `01_PRD.md`**; do not cite only "see PRD".

### Sub-agent orchestration (optional)

When the host supports parallel sub-sessions:

| Role | Responsibility |
|------|----------------|
| **Parent agent** | Choose `v{N}`, load user intent and context, merge structured blocks returned by sub-agents, **dedupe and pick best among same-topic answers**, maintain **single writer** for `.anws/v{N}/01_PRD.md`, run mandatory "10-dimension ambiguity scan" and User Story quality gate, then deliver for user confirmation. |
| **Sub-agent** | Consumes bounded slices only—e.g. "generate clarification question batches only (with suggested answers)", "extract / rewrite User Stories only (still drafts)", "annotate dimension k of the 10-dimension table with Clear/Partial/Missing + patch suggestions", "rewrite feeling words into candidate metric lists only"; return **Markdown structured blocks + anchor suggestions**; do not assume access to parent-only context. |

**Single writer:** Only **one** writer for `01_PRD.md` per genesis Step 2 round; sub-agents must not write that path without parent authorization.

#### Handoff checklist (sub → parent)

- [ ] State deliverable type (question list / Story draft / scan vector / feeling-word metric table) and **N/A dimensions** (one-line reason each).
- [ ] Every item maps to a **subsection title or `[REQ-XXX]` placeholder** the PRD will use; if no anchor, mark "pending parent mount".
- [ ] Do not introduce requirements conflicting with parent-declared Non-Goals; if conflict is possible, list "requires parent ruling".
- [ ] Sub-agent stops at structured handoff; subsequent edits merged by parent.

### Completion (genesis Step 2 done signal)

Step 2 **must not be claimed complete** unless all of:

| Gate | Condition |
|------|-----------|
| On-disk | `.anws/v{N}/01_PRD.md` exists and opens standalone; structure aligns with **mandatory sections** of `prd_template.md`. |
| Content | Contains User Stories (pass quality gate), acceptance criteria, **≥3** Non-Goals; every requirement is testable, measurable, or explicitly assumed. |
| Ambiguity | "10-dimension ambiguity scan" executed; every `Partial` / `Missing` fixed, `[ASSUMPTION]`-ized, or closed under hard-limit rules. |
| Tags | `[NEEDS CLARIFICATION]` **≤ 3**; no Story has untracked feeling words unless rewritten or assumed away. |
| Human | **User confirmed PRD** (or explicitly waived in writing logged as `[ASSUMPTION: stakeholder sign-off deferred]`); do not fake confirmation. |
| Handoff | Parent delivered **short summary table** to user (goals / key REQ count / open clarifications / Non-Goals count / recommended reading order for next Step). |

Failing any **hard** row above → Step 2 is **blocked / in_progress**; do not silently advance the pipeline into architecture drafting.

---

## Execution checklist (single source of order)

Aligned with **craft scaffolding** and the **completion** table above; release is gated by **completion hard rows**—this section only sequences work (merges former Quick start / Mandatory steps / Completion checklist to avoid duplicate reading).

1. **Read the request**: identify feeling words and hidden boundaries (mandatory).
2. **Think deeply**: 3–7 rounds of structured reasoning (by complexity); produce User Story drafts, ambiguity, clarification questions (mandatory).
3. **Probe for answers**: do not advance the main line until answers arrive (mandatory).
4. **Before disk**: ≥3 User Stories, ≥3 Non-Goals, clarify feeling words; read `references/prd_template.md`, create `.anws/v{N}/01_PRD.md`—**do not** substitute chat for disk (mandatory).
5. **After disk**: run the **10-dimension ambiguity scan** and close `Partial` / `Missing`; User Story quality gate; `[NEEDS CLARIFICATION]` ≤ 3 (mandatory).
6. **Close**: satisfy **completion** hard rows + user sign-off on PRD (or logged waiver).

## Methods and tools

### 1. Socratic probing
*   **User:** "I want it to be fast."
*   **You:** "Does that mean p99 under 100ms? Or optimistic UI updates only?"
*   *Goal:* Turn adjectives into numbers and verifiable criteria.

### 2. Context compression
*   **Input:** 500-line chat log.
*   **Action:** Extract *User Stories*—"As a User, I want X, so that Y."
*   **Drop:** Premature implementation details (e.g. "use Redis").

### 3. Non-Goals (draw the circle)
*   Explicitly define what we **do not do**.
*   *Why:* Prevent scope creep and endless "what about X?" follow-ups.

## Detective rules

1.  **Contract first:** If it cannot be verified, do not put it in the PRD.
2.  **Don't steal design work:** Describe *what* to do, not prematurely *how*. Implementation belongs in architecture.
3.  **User value first:** Every requirement must trace to clear user value.

## Toolbox
*   `references/prd_template.md`: Product requirements template.

## 10-dimension ambiguity scan

After drafting the PRD, you **must** scan the full text across these 10 dimensions. This replaces ad-hoc "anything else?" with a **repeatable, exhaustive** pass.

For each dimension, mark status: `Clear` / `Partial` / `Missing`

| # | Dimension | What to check | Status |
|---|-----------|---------------|:------:|
| 1 | **Functional scope and behavior** | Core goals / success criteria / explicit exclusions / user role distinction | |
| 2 | **Domain and data model** | Entities, attributes, relationships / uniqueness rules / lifecycle and state transitions / data volume assumptions | |
| 3 | **Interaction and UX flows** | Key user paths / error, empty, loading states / a11y and i18n | |
| 4 | **Non-functional quality** | Performance / scalability / reliability / observability / security and privacy / compliance | |
| 5 | **Integrations and externals** | External failure modes / import-export formats / protocol version assumptions | |
| 6 | **Edge cases and failures** | Negative paths / rate limits / concurrent conflict handling | |
| 7 | **Constraints and tradeoffs** | Technical constraints / explicit tradeoffs / rejected architecture options | |
| 8 | **Terminology consistency** | Glossary / synonym unification across the doc | |
| 9 | **Done signals** | Acceptance testable? / DoD quantifiable? | |
| 10 | **Placeholders and vague words** | TODOs / unquantified adjectives (fast, scalable, secure, intuitive, robust) | |

**Rules:**
- For `Partial` or `Missing`, sort by **impact × uncertainty**, ask user about top **5**
- **One question at a time**; offer a suggested answer; user may accept or customize
- After answers, **atomically write** the matching PRD section; no mutually contradictory text
- `[NEEDS CLARIFICATION]` **hard cap ≤ 3**; if still over, use reasonable defaults + `[ASSUMPTION: ...]`
- **Do not ask users to clarify these reasonable defaults:** industry-standard data retention, typical web/mobile performance expectations, friendly errors with fallbacks, standard Session or OAuth2 authentication

## User Story quality gate

Every User Story in the PRD **must** pass before the PRD is considered done:

| Check | Requirement |
|-------|---------------|
| **Unique ID** | Must include `[REQ-XXX]` for traceability |
| **Priority** | P0 / P1 / P2, P0 first |
| **Independently testable** | How the story is **independently** demoed and verified |
| **Affected systems** | Concrete system IDs (must align with `02_ARCHITECTURE_OVERVIEW.md`) |
| **Acceptance criteria** | At least one Given-When-Then + at least one error path |
| **Edge cases** | At least one boundary condition |
| **No vague feeling words** | No unquantified adjectives (e.g. fast → <100ms p99; scalable → supports N users) |
| **User value** | One-sentence end-user value |

If any User Story fails, **fix before delivering the PRD**.
