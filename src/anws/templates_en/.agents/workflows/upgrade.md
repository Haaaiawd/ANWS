---
description: "/upgrade: after anws update, read changelog, classify Minor/Major, produce a human-reviewable plan, route to /change or /genesis; host does not embed long checkpoint templates."
---

# /upgrade

<phase_context>
You are **UPGRADE ORCHESTRATOR**.

**Mission**: After **`anws update` has completed**, read the latest `.anws/changelog/vX.Y.Z.md`, classify **Minor vs Major**, produce a reviewable upgrade plan, and after explicit human approval **route** to `/change` or `/genesis` (those workflows own writes).  
**Capabilities**: locate changelog + current `v{N}`, classify, map framework deltas to business docs, routing recommendation, WARNING tagging for inferred sections.  
**Limits**: `/upgrade` is **orchestration + plan only**—**no** skipping changelog, **no** routing before classification, **no** writing business docs without approval; **no** full fenced “human checkpoint” template pasted in this host.  
**Relationship with the user**: show plan first; after approval, name the next workflow explicitly.  
**Output Goal**: Classification + impact list + recommended route + inference-risk notes—**not** completing business doc edits inside `/upgrade`.
</phase_context>

---

## CRITICAL concision & layout (/craft + /challenge spirit)

> [!IMPORTANT]
> **craft**: Before editing, Read **`.agents/skills/craft-authoring/SKILL.md`** and **`.agents/workflows/craft.md`**; each `## Step …` uses **`### What to do` / `### Why` / `### How to verify`**; `<completion_criteria>` required.  
> **Concision**: Plans and narration—**one fact per sentence**; ordering and classification gates must stay **as strong** as the hard constraints in this workflow file.
> **No injection**: Human checkpoint content must cover **functions** (changelog path, current `v{N}`, tier, route, impacted files + reasons, inference risks, approve/reject/adjust)—**not** a multi-screen fenced sample copied into the host.

---

## CRITICAL execution order (cannot be weakened)

> [!IMPORTANT]
> Strict **Step 0 → 4**; **forbid** skipping changelog read, **forbid** choosing route before tiering, **forbid** bypassing human approval to edit `.anws/v{N}` from memory, **forbid** writing without reading the routed workflow.

---

## Step 0: Locate upgrade inputs

### What to do

1. List `.anws/changelog/`, pick the **latest** `vX.Y.Z.md`, set `LATEST_CHANGELOG`; **actually read it** (one-line path/summary in-session—no verbal guessing).  
2. Scan `.anws/` for max `v{N}` → `CURRENT_ARCH = .anws/v{N}`.  
3. If changelog missing/unreadable: stop; instruct `anws update` or `/genesis`.

### Why

No changelog → no upgrade fact base.

### How to verify

- Session names `LATEST_CHANGELOG` and `CURRENT_ARCH`; cites at least one change class from the file.

---

## Step 1: Classify upgrade (Minor / Major)

### What to do

Apply this workflow’s **Minor / Major** tier rules only: whether a **new architecture version** is needed, directory/multi-workflow protocol shifts, structural semantics of `01`/`02`/`03`, need to keep prior version as compatibility narrative. Record yes/no + one-line rationale each.

### Why

Tier drives routing; patch-level nuance is out of scope here.

### How to verify

- Explicit `Minor` or `Major` with evidence; no “tier unknown but here is forge.”

---

## Step 2: Impact analysis and routing recommendation

### What to do

1. Read from `CURRENT_ARCH` as needed: `01`, `02`, `03`, `04`, `05A`, `05B`.  
2. Build “framework delta → business node” mapping; tag path / process / protocol migration classes.  
3. Emit **recommended route**: Minor → **`/change`**; Major → **`/genesis`**.  
4. **No business writes in this step**—plan and intended file touches only.

### Why

Keeps `/upgrade` decoupled from execution workflows.

### How to verify

- Each impact row lists file, section/intent, and whether AI inference is likely.

---

## Step 3: Human checkpoint

### What to do

Present the **functions** listed under **No injection** in CRITICAL concision. **No file writes** until explicit approval.

### Why

Human is the last gate for upgrade blast radius.

### How to verify

- User saw the full decision bundle; on reject, zero writes.

---

## Step 4: Route to target workflow

### What to do

- **Minor**: Read the mounted **`/change`** workflow (**`.agents/workflows/change.md`** in this workspace), feed Step 2 mapping; all subsequent edits obey `/change` permissions and signatures; if execution exceeds `/change`, stop and switch to `/genesis`.  
- **Major**: Read **`/genesis`**, feed Step 2 as new-version input; obey Copy & Evolve and versioning.  
- For AI-filled non-mechanical text: prefix with **`> [!WARNING] AI-generated content—inferential; human review required.`** (English default for this bundle; use Chinese phrasing only when the repo explicitly standardizes on it).  
- **Business constants** (domain terms, product goals, story intent, team constraints, custom boundaries) must **not** be overwritten by framework upgrades.

### Why

Write semantics belong to the routed workflow; `/upgrade` only hands off.

### How to verify

- Session states next workflow; after approval, that workflow’s read + gates are referenced.

---

## Step 5: Completion report

### What to do

Summarize: tier, route, planned files, whether a new `v{N}` is expected, inference risk, **which workflow file to read next**.

### Why

Auditable closure.

### How to verify

- Report includes all six items; no silent jumps.

---

<completion_criteria>
- **Concision & layout**: all Steps have three subsections; execution order and tiering gates intact.  
- Changelog actually read; `Minor`/`Major` consistent with routing.  
- Step 3 approval/reject path correct; zero business writes before approval.  
- Step 4 explicitly binds `/change` or `/genesis` and cites their rules; WARNING / business-constant rules stated.  
- Step 5 report delivered.  
</completion_criteria>
