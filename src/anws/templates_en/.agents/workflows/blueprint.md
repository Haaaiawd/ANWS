---
description: "Orchestrate /blueprint: generate 05A/05B from approved design inputs; host keeps order, gates, and handoff contracts; schemas/templates authoritative in workspace **`.agents/skills/task-planner/`**."
---

# /blueprint

<phase_context>
You are the **TASK ARCHITECT**.

**Mission**: Orchestrate approved design inputs into executable `05A_TASKS.md` and `05B_VERIFICATION_PLAN.md`, then enforce closure gates.  
**Capabilities**: version targeting, precondition checks, contract mapping, `task-planner` invocation, closure checks, `AGENTS.md` A/B entry updates.  
**Limits**: Orchestration and gates only—**do not** paste field-level specs or full `TASK_TEMPLATE_*` bodies into this host; **do not** pre-read `task-planner` before Step 2 (**pre-read gate** below).  
**Relationship with the user**: You deliver verifiable planning skeletons and traceability, not implementation or E2E execution.  
**Output Goal**: `.anws/v{N}/05A_TASKS.md` + `.anws/v{N}/05B_VERIFICATION_PLAN.md`.
</phase_context>

---

## CRITICAL concision & layout (/craft + /challenge spirit)

> [!IMPORTANT]
> **craft**: Before editing, Read **`.agents/skills/craft-authoring/SKILL.md`** and **`.agents/workflows/craft.md`**; each `## Step …` uses **`### What to do` / `### Why` / `### How to verify`**; `<completion_criteria>` required.  
> **Concision**: Session and user-facing text—**one fact per sentence**; table semantics duplicated in `task-planner` stay **in SKILL/references**.  
> **No injection**: Do not paste large excerpts of `TASK_TEMPLATE_05A` / `TASK_TEMPLATE_05B` here—**single authority** under **task-planner paths** below.

---

## CRITICAL orchestration constraints (gates cannot be weakened)

> [!IMPORTANT]
> **Sole authority for `task-planner` (field / table schema)**  
> Read **`.agents/skills/task-planner/SKILL.md`** (same workspace `.agents/` tree as this workflow).
> `.agents/skills/task-planner/references/TASK_TEMPLATE_05A.md`  
> `.agents/skills/task-planner/references/TASK_TEMPLATE_05B.md`  
>
> - Input docs (`01` / `02` / `03` / conditional `04`) are the **only** source of truth for decomposition.  
> - If norms conflict, **repair SKILL/references**—do not patch around them only in `blueprint.md`.  
> - **Record** E2E triggers, scope, and expected evidence in 05A/05B only; **do not execute `e2e-testing-guide` during `/blueprint`**.  
>
> **Motto**: Calling `task-planner` with known contract gaps is installment-planning tech debt into the sprint.

---

## CRITICAL Handoff contract with `task-planner` (host → SKILL)

> [!IMPORTANT]
> **Pre-read gate**  
> **Do not** pre-read `task-planner/SKILL.md` or `TASK_TEMPLATE_*` during Steps 0–1.5 (avoids memorizing layout before inputs exist). **Only when** entering **Step 2** and about to decompose per SKILL, read **`.agents/skills/task-planner/SKILL.md`** and open **references** as needed; immediately consume Step 1’s contract mapping—no idle re-reads in unrelated steps.
>
> **Handoff bundle (must be explicit in-session when Step 2 starts)**  
> Short lists / path lists are enough (do not paste into 05A/05B here):
>
> - `TARGET_DIR`; **actual paths read** this round: `01`, `02`, `03_ADR/` (plus any `04_SYSTEM_DESIGN/` files included).  
> - Step 1 **contract table**: each row “contract type/name → intended 05A owner + intended 05B proof” (line-up with SKILL **Contract coverage rules**).  
> - If ADRs contain **test strategy / quality gates**: cite **ADR path + heading/anchor** so SKILL’s “must follow ADR testing strategy first” is actionable.  
> - **WBS Level-1 system IDs** must match the system inventory in `02_ARCHITECTURE_OVERVIEW`—**forbid** inventing system slugs not present in `02`.  
> - PRD `[REQ-*]`: task linkage rules live in SKILL + templates; host spot-checks that **critical REQs are not orphaned**.
>
> **Hard constraints the host enforces in Steps 2–4 (definitions stay in SKILL)**  
> If persisted output violates any category below, **return to Step 2** for another planner pass—**do not** “fix” with free-form tables in chat pretending closure:
>
> - **Testing standard**: project plan must include **both** **unit tests** and **API interface functional tests** (SKILL section **Testing standards (hard constraints)**).  
> - **05B shape**: **Contract Coverage Overlay**, **Testing Coverage Overlay**, and **Verification Traceability Matrix** are mandatory sections (SKILL declaration).  
> - **E2E boundary**: record triggers/scope/evidence expectations only; **do not** run `e2e-testing-guide`.  
> - **Anti-bloat**: close **risk categories**, not Cartesian product explosion (SKILL **Anti test bloat**).  
> - **Task quality**: task size **2h–2d**, dependency edges must **align inputs/outputs** (SKILL **Task quality rules**); **INT-S{N}** is the sprint closer—smoke favors INT.  
>
> **Post-write reconciliation**  
> After Step 3 writes disk, Step 4 must line-by-line reconcile SKILL’s closing **“Output quality checks”**; any miss → **Step 2** again until it passes.

---

## Step 0: Locate version and preconditions

### What to do

1. Scan `.anws/` for latest `v{N}`; set `TARGET_DIR = .anws/v{N}`.  
2. **Required**: `{TARGET_DIR}/01_PRD.md`, `{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`.  
3. **Conditional**: When this version includes public contracts (HTTP APIs, CLI semantics, config/file formats, error semantics, cross-system protocols, persistence shapes, etc.), treat `{TARGET_DIR}/04_SYSTEM_DESIGN/` as **required**.  
4. If failing: stop; ask user to run `/genesis` or `/design-system`.

### Why

Without version anchor and inputs, 05A/05B decouple from real architecture.

### How to verify

- Can state `TARGET_DIR` and which missing input caused stop.  
- When conditional branch fires, you did **not** proceed without `04`.

---

## Step 1: Load inputs and contract mapping

### What to do

1. Read `01`, `02`, `03_ADR/` (and `04_SYSTEM_DESIGN/` when present/required).  
2. Extract **public contracts** and high-risk loci.  
3. Build **hard constraints** for `task-planner` (short list is fine; column names per SKILL):  
   - Every public contract has at least one **05A implementation owner** task.  
   - Every high-risk public contract has at least one **05B verification owner** point.  
   - **Do not** push all contract proof to late integration or E2E only.

### Why

The planner shapes trees; **who implements vs who proves** must be pinned in orchestration.

### How to verify

- Can cite ≥3 “contract → 05A/05B owner” mappings with no “everything is E2E” escape.

---

## Step 1.5: Orchestration heuristics (before planner)

### What to do

Three quick checks (any fail → return to Step 1, fix mapping, **then** planner):

1. **Reality**: Does the task tree carry **externally observable contracts**, not only implementation busywork?  
2. **Risk closure**: Does each high-risk contract land in 05B with a **concrete, downgradeable** proof (not blind E2E stacking)?  
3. **Verifiability**: Are Sprint/INT gates objectively checkable (logs/reports/screenshots)?

### Why

Otherwise the planner only subdivides confusion.

### How to verify

- Each check is yes/no + one-line rationale; any “no” shows explicit repair before advancing.

---

## Step 2: Invoke task-planner for 05A and 05B

### What to do

1. **At the start of this Step**, read **`.agents/skills/task-planner/SKILL.md`** (and `references/TASK_TEMPLATE_05A.md`, `TASK_TEMPLATE_05B.md` as needed), then follow SKILL protocol.  
2. Pass the full **handoff bundle** from **CRITICAL Handoff contract with `task-planner`** into the planner execution context (paths, contract table, ADR test anchors, system-ID alignment statement).  
3. Pass explicitly (intent only; wording per SKILL): inputs sole truth; ADR test strategy / quality gates **first**; verification **lightest sufficient**; plan **both** unit and **API interface functional** tests; smoke favors `INT-S{N}`; E2E = triggers + evidence expectations only—**no** e2e skill execution.  
4. Results must reconcile with SKILL **“Output quality checks”**; if this round fails, **stay in Step 2**—repair mapping or re-read inputs, then re-run planner—**do not** advance to Step 3.

### Why

Schemas live in SKILL; the host must supply a **complete handoff** and **reconcile SKILL hard constraints**, not “invoke skill with half context.”

### How to verify

- Session shows: SKILL paths read + handoff highlights + one planner pass; or an approved manual equivalent (declared) that still passes Step 4 vs SKILL output-quality checks.

---

## Step 3: Write outputs and update state

### What to do

1. Save `{TARGET_DIR}/05A_TASKS.md` and `{TARGET_DIR}/05B_VERIFICATION_PLAN.md`.  
2. Keep `05A` execution spine (WBS, deps, sprint, INT, user-story overlay—**headings/required columns** per TASK_TEMPLATE_05A).  
3. Keep `05B` verification spine (task-by-task, contract/testing/traceability overlays—per TASK_TEMPLATE_05B).  
4. Update `AGENTS.md` **A/B entry** state (**no** long fenced templates here).

### Why

Disk + entry alignment anchors `/forge` and review.

### How to verify

- Both files exist and are not hollow placeholders; `AGENTS.md` reflects A/B entries.

---

## Step 4: Mandatory exit checklist

### What to do

Before closing `/blueprint` or handing off to `/forge`, reconcile **05A / 05B / `AGENTS.md`** against **`task-planner`** output-quality rules (checklist below).

### Why

Missed checks amplify rework in forge; this step separates “generated” from “downstream-runnable.”

### How to verify

- [ ] Both 05A and 05B generated.  
- [ ] Reconciled against **`task-planner` SKILL closing “Output quality checks”** with no gaps (includes: `Verification Reference` + `Evidence output`, User Story Overlay in 05A, three mandatory overlays in 05B, INT/smoke relationship, no E2E abuse).  
- [ ] Every 05A task has a **verification reference** resolvable in 05B.  
- [ ] 05B retains contract / testing / traceability **coverage narratives** (exact headers per template).  
- [ ] Unit and API interface functional responsibilities planned.  
- [ ] Coverage closes risk without combinatorial bloat; task sizing and dependency **input/output alignment** match SKILL rules.  
- [ ] `AGENTS.md` updated for A/B entries.

---

<completion_criteria>
- **Concision & layout**: `CRITICAL concision & layout` honored; no full TASK templates pasted into the host.  
- Version/precondition stops correct; Step 1.5 passed before planner.  
- No `task-planner` pre-read before Step 2; Step 2 delivered the full **handoff bundle** and passed reconciliation vs SKILL **Output quality checks**.  
- **`e2e-testing-guide` not executed** during `/blueprint`.  
- `AGENTS.md` A/B entries updated.  
</completion_criteria>
