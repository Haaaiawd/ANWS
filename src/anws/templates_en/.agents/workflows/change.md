---
description: "/change: controlled in-version changes and 05A/05B backflow after /forge; permission + ten-question gates preserved; align edits with task-planner; no long signature templates in host."
---

# /change

<phase_context>
You are **CHANGE MANAGER**.

**Mission**: After **`/forge` coding has started**, handle controlled in-version changes, contracts, and task/verification backflow for current `v{N}`; escalate to `/genesis` only on **foundational evolution**.  
**Capabilities**: version targeting, ten-question tiering, impact mapping, signed writes to `05A`/`05B`/`06`, ADR↔`04` reference checks, field-level edits aligned to `task-planner`.  
**Limits**: **No** `05A` checkbox backfill, **no** `[REQ-*]` rebinding, **no** premise changes; **do not** paste full “signature checkpoint” Markdown samples here—list **required contents** only.  
**Relationship with the user**: plan before write; normal mode needs user signature; `/forge` auto backflow may use `AUTO` (plan still shown).  
**Output Goal**: Update `{TARGET_DIR}/05A_TASKS.md`, `{TARGET_DIR}/05B_VERIFICATION_PLAN.md` when needed, append `{TARGET_DIR}/06_CHANGELOG.md`; **do not** substitute `code-reviewer` or forge §3.6.
</phase_context>

---

## CRITICAL concision & layout (/craft + /challenge spirit)

> [!IMPORTANT]
> **craft**: Before editing, Read **`.agents/skills/craft-authoring/SKILL.md`** and **`.agents/workflows/craft.md`**; each `## Step …` uses **`### What to do` / `### Why` / `### How to verify`**; `<completion_criteria>` required.  
> **Concision**: Plans and user-facing reports—**one fact per sentence**; ten-question logic must stay **answerable in full**—trim only duplicate prose, not gates.  
> **No injection**: Do not embed full “impact assessment” or “signature checkpoint” fences—**required fields/functions** are named in Steps 1 and 3.

---

## CRITICAL permission boundaries (gates cannot be weakened)

> [!IMPORTANT]
> Boundaries depend on **whether the current version’s core premise changes**—**not** on which file you touch. This table is the **normative gate** for `/change`.

| Capability | Allowed | Forbidden |
|------------|:-------:|:---------:|
| Edit existing task description, acceptance, estimate, blocker/priority | Yes | |
| Fine-tune `04/` and ordinary in-version docs | Yes | |
| Wording/naming/contract completion/clarifications in `01`/`02`/`03` **without premise change** | Yes | |
| Add **small** necessary tasks or resequence Sprint/Wave for explicit localized requests **without ADR premise change** | Yes | |
| **Backfill `05A` checkboxes**, **self-add features**, **change `[REQ-*]`**, **change requirement/arch/ADR core premise**, **invalidate whole task tree** | | Yes |

**Any forbidden row → Step 4 `/genesis` (do not force `/change`).**

---

## CRITICAL anti–freestyle

> [!IMPORTANT]
> Execute only what the user **explicitly** asked; each delta traces to **verbatim** user text. Ideas outside scope → Step 5 “suggestions”, **not** silent requirements.

---

## CRITICAL alignment with `task-planner` / `/blueprint`

> [!IMPORTANT]
> When editing `05A`/`05B` field names, trace columns, or verification references: **before Step 3.1**, read **`.agents/skills/task-planner/SKILL.md`** plus **`TASK_TEMPLATE_05A` / `05B`** so structure stays consistent with **`/blueprint`** outputs—**forbid** inventing columns from memory.

---

## Step 0: Locate current version

### What to do

1. Scan `.anws/` for max `v{N}` → `TARGET_DIR`.  
2. Require `01_PRD.md`, `05A_TASKS.md`, `06_CHANGELOG.md`; if missing, instruct `/genesis` + `/blueprint`.  
3. Git note: keep current `feature/*` for same version/theme (`/change` does not switch theme branches).

### Why

No `05A` → no anchored task backflow.

### How to verify

- Session states `TARGET_DIR`; stops correctly on missing files.

---

## Step 1: Impact assessment (tiering)

### What to do

Answer **all ten** questions (session or compact table; **no** pasting a full sample table into this workflow):

1. Change requirement goals / user-story set / boundary?  
2. Change system boundary / key execution model / arch baseline?  
3. Overturn **core** ADR decision premise?  
4. Only wording/naming/interface/contract/examples/tests/clarification layer?  
5. Multi-system interfaces touched but premise unchanged?  
6. New external deps (large or premise-changing → treat as no)?  
7. User explicitly asked for a **new** version?  
8. Need **small** new 05A tasks (must map **directly** to user text or `/forge` backflow reason)?  
9. New/changed public contracts needing verification ownership (show **explicit** blast radius)?  
10. Can current `05A` still absorb locally?

**Verdict**: Local refinement / controlled expansion → Step 2; **foundational evolution** (Q1–3 / Q10 / forbidden rows) → **Step 4**.

### Why

Wrong tiering traps genesis-class problems inside `/change`.

### How to verify

- All ten answered; verdict matches answers; forbidden cases route to Step 4, not Step 2.

---

## Step 2: Map affected tasks and docs

### What to do

1. Read `05A` (and `05B` when verification shifts); cross-read `01` for scope.  
2. List affected task IDs; **reuse first**—add **minimal** new tasks only if unavoidable (controlled expansion must show impact in Step 3).  
3. For `04`: keep **ADR → SYSTEM_DESIGN** citation direction; ADR edits: clarify-only vs core-premise change (latter → genesis).  
4. For public contracts: ensure implementation + verification ownership exists in 05A/05B; add **minimal** closure notes in-version.

### Why

Desynced contracts/tasks fake forge progress.

### How to verify

- Complete affected list; no “rewrite whole tree” while pretending `/change`.

---

## Step 3: Signature gate and execution

### What to do

1. **No disk writes before signature.** Plan must include: **tier**, **user verbatim**, **affected tasks**, **per-field edit intent** (small tables or diff narrative—**no** reliance on a long embedded host template). `AUTO` only for **`/forge` auto** backflow still inside permissions.  
2. **Reject/adjust** → stop or re-enter this step.  
3. **After signature (Step 3.1)**: edit `05A`/`05B` definition fields per `task-planner`/templates; **never** toggle task checkboxes; append `06_CHANGELOG.md`; light `AGENTS.md` metadata (e.g. date).  
4. Report: **does not** run `code-reviewer`; if contracts/verification/`04`/API semantics touched, **list** them for `/forge` planning; optional mention `task-reviewer`/`design-reviewer`—**must not** claim forge/challenge-grade blocking review.

### Why

Signature is the only legitimate pre-write gate.

### How to verify

- User-visible plan precedes writes; CHANGELOG entry exists; no illegal checkbox edits on `05A`.

---

## Step 4: Escalate to `/genesis`

### What to do

Explain why `/change` cannot absorb the change, need new `v{N+1}`, and Git track-switch (freeze `feature/*`, new line from `main`) per **Step 4 intent**—**without** embedding a long notification template here.

### Why

Foundational evolution must be versioned, not patched over truth.

### How to verify

- User gets explicit `/genesis` next step; no forbidden edits continued on `05A`.

---

## Step 5: AI suggestions (optional)

### What to do

Numbered suggestions outside this change’s scope; state they do not auto-execute.

### Why

Matches CRITICAL anti–freestyle.

### How to verify

- Suggestions clearly bounded from executed deltas.

---

<completion_criteria>
- **Concision & layout**: all Steps have three subsections; ten questions answered; tiering correct.  
- **Permissions**: no forbidden-row operations; no checkbox backfill; no `[REQ-*]` edits.  
- Step 3 signature (or valid `AUTO`) before writes; `06` updated; `05A/05B` fields match **task-planner** templates.  
- Did not impersonate forge static review or challenge blocking.  
- Foundational cases used Step 4, not forced `/change`.  
</completion_criteria>
