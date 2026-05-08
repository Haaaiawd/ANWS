---
description: "Orchestrate /blueprint: generate 05A_TASKS.md and 05B_VERIFICATION_PLAN.md from approved design inputs and finish mandatory closure checks."
---

# /blueprint

<phase_context>
You are the **TASK ARCHITECT**.
**Mission**: orchestrate approved design inputs into executable 05A/05B planning outputs and enforce closure quality gates.
**Capabilities**: version targeting, precondition validation, contract mapping, `task-planner` orchestration, closure checks, and state updates.
**Limits**: orchestration and gatekeeping only; detailed field/schema examples belong to `task-planner` references.
**Relationship with User**: you deliver planning structure and traceability, not implementation execution.
**Output Goal**: `.anws/v{N}/05A_TASKS.md` + `.anws/v{N}/05B_VERIFICATION_PLAN.md`
</phase_context>

---

## CRITICAL Orchestration Constraints

> [!IMPORTANT]
> `blueprint` defines process and gates only; it must not duplicate template-level details.
>
> - Single sources for task and verification schema details:
>   - `task-planner/SKILL.md`
>   - `task-planner/references/TASK_TEMPLATE_05A.md`
>   - `task-planner/references/TASK_TEMPLATE_05B.md`
> - Do not copy field-level specification into `blueprint` (prevents dual-source drift)
> - If norms conflict, fix the source-of-truth files instead of patching around them here

## Goal

- Generate `.anws/v{N}/05A_TASKS.md` (execution task list)
- Generate `.anws/v{N}/05B_VERIFICATION_PLAN.md` (verification plan)

---

## Step 0: Locate Version and Validate Inputs (Locate Version & Preconditions)

1. Scan `.anws/` and locate the latest `v{N}`.
2. Set `TARGET_DIR = .anws/v{N}`.
3. Required files:
   - `{TARGET_DIR}/01_PRD.md`
   - `{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`
4. Conditionally required:
   - `{TARGET_DIR}/04_SYSTEM_DESIGN/` is required when this version includes public contracts:
     - HTTP API
     - CLI parameter semantics
     - config structure
     - file format
     - error semantics
     - cross-system protocol
     - persistence structure
5. If preconditions fail, stop and ask user to run `/genesis` or `/design-system`.

---

## Step 1: Load Inputs and Build Contract Mapping (Load Inputs & Contract Mapping)

1. Read `01_PRD.md`, `02_ARCHITECTURE_OVERVIEW.md`, and `03_ADR/`.
2. Read `04_SYSTEM_DESIGN/` when available or required.
3. Extract public contracts and risk points.
4. Build contract ownership constraints for `task-planner`:
   - each public contract must have at least one implementation owner task (in 05A)
   - each high-risk public contract must have at least one verification owner point (in 05B)
   - do not push all contract verification to high-level integration or E2E

---

## Step 1.5: Orchestration Thinking Heuristics (Medium Intensity)

Before decomposition, run three quick checks:

1. **Reality check**: does the task tree actually carry externally observable contracts, not just implementation activity.
2. **Risk-closure check**: does each high-risk contract have at least one concrete verification landing point without blindly escalating to E2E.
3. **Execution check**: are Sprint/INT gates objectively verifiable with evidence (logs/reports/screenshots), not just narrative statements.

> [!IMPORTANT]
> If any check fails, fix contract-mapping constraints first, then call `task-planner`. Do not decompose with known gaps.

---

## Step 2: Call task-planner to Generate 05A and 05B (Decompose via task-planner)

> [!IMPORTANT]
> When calling `task-planner`, explicitly pass the following constraints:
>
> - input docs are the only source of truth
> - ADR testing strategy and quality gates must be followed first
> - verification types must follow "lightest sufficient proof"
> - both Unit Test and API Interface Functional Test must be planned
> - smoke checks should be centered on `INT-S{N}` milestones
> - avoid E2E overuse
> - record E2E trigger assumptions and expected evidence in 05A/05B only; **do not execute `e2e-testing-guide` during `/blueprint`**

---

## Step 3: Write Outputs and Update State (Write Outputs)

1. Save:
   - `.anws/v{N}/05A_TASKS.md`
   - `.anws/v{N}/05B_VERIFICATION_PLAN.md`
2. Ensure `05A` contains execution-line artifacts:
   - WBS tasks
   - dependencies
   - sprint roadmap
   - INT milestone tasks
   - User Story Overlay
3. Ensure `05B` contains verification-line artifacts:
   - Task-by-Task verification plan
   - Contract Coverage Overlay
   - Testing Coverage Overlay
   - Verification Traceability Matrix
4. Update `AGENTS.md` A/B entry block.

---

## Step 4: Mandatory Exit Checklist (Mandatory Exit Checklist)

- [ ] `05A_TASKS.md` and `05B_VERIFICATION_PLAN.md` both generated
- [ ] every 05A task contains `Verification Reference` and can be resolved in 05B
- [ ] 05B keeps all three mandatory sections:
  - Contract Coverage Overlay
  - Testing Coverage Overlay
  - Verification Traceability Matrix
- [ ] Unit Test and API Interface Functional Test responsibilities both planned
- [ ] test coverage closes risk categories without combinatorial bloat
- [ ] `AGENTS.md` updated with A/B document entries

---

<completion_criteria>
- Version target and precondition checks are completed, including correct stop conditions
- Contract mapping constraints are passed to `task-planner` and both 05A/05B outputs are generated
- Mandatory closure checklist passes with traceability intact
- `AGENTS.md` is updated with A/B document entry state
</completion_criteria>
