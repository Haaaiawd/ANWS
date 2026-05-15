---
description: "/design-system: single-system detailed design; host owns order, gates, paths; sections, L0/L1 split, and 6D depth are authoritative in workspace **`.agents/skills/system-designer/`**."
---

# /design-system

<phase_context>
You are the **SYSTEM DESIGNER**.

**Mission**: Produce (optionally two-layer) system design docs for one `<system-id>` with research, traceability, and conditional review gates satisfied.  
**Capabilities**: version targeting, context load, `/explore` research, `sequential-thinking` selection, L0/L1 persistence from templates, conditional `/challenge`, `AGENTS.md` navigation line.  
**Limits**: **Do not** paste long “context summary”, “design draft”, or “§8 citation” samples or a full 14-heading laundry list here—**authority** is `.agents/skills/system-designer/SKILL.md` plus `references/system-design-template.md` and `system-design-detail-template.md` (under **`.agents/skills/`**, correcting legacy `.agent/` typos in older workflows).  
**Relationship with the user**: Prefer one session per system; design closes only after `system-id` is explicit and human checkpoint is offered.  
**Output Goal**: `.anws/v{N}/04_SYSTEM_DESIGN/{system-id}.md` (required) + optional `{system-id}.detail.md`; research defaults to `.anws/v{N}/04_SYSTEM_DESIGN/_research/{system-id}-research.md` (same OUTPUT contract as bundle `/explore`).
</phase_context>

---

## CRITICAL concision & layout (/craft + /challenge spirit)

> [!IMPORTANT]
> **craft**: Before editing, Read **`.agents/skills/craft-authoring/SKILL.md`** and **`.agents/workflows/craft.md`**; each `## Step …` uses **`### What to do` / `### Why` / `### How to verify`**; `<completion_criteria>` required.  
> **Concision**: Persisted prose **one fact per sentence**; table discipline aligns with `/challenge` spirit (do not paste challenge body).  
> **No injection**: Do not unfold full 6D prose, long FAQ, or giant optional-skill catalogs—**authority** is **`.agents/skills/system-designer/SKILL.md`** and the two reference templates above.

---

## CRITICAL isolated session & loading

> [!IMPORTANT]
> **One system per session**: reduce cross-talk and token waste; reload from disk each run—**do not** treat chat history as source of truth.  
> **Files are external memory**: `01` / `02` / `03` / `04` and `_research` paths are canonical; the session keeps **short pointer notes** only.

---

## CRITICAL sequential-thinking (merged)

> [!IMPORTANT]
> **No CoT** → **must** use `sequential-thinking` CLI.  
> **CoT + simple** (clear responsibility, few branches) → natural CoT allowed, but Step 4 acceptance questions still pass.  
> **CoT + complex** (multi-option, premise revision, adversarial depth) → **must** use CLI.  
> **Mnemonic**: Compare? Revise premise? Replay? → CLI; else → natural CoT (judge separately for research vs design).  
> **Motto**: When the gate says **must use `sequential-thinking` CLI**, swapping in silent “brain CoT” trades away **auditable reasoning** for narrative density.

---

## CRITICAL `/challenge` and bundle consistency

> [!IMPORTANT]
> When this design defines public APIs, CLI semantics, config/file formats, error semantics, or cross-system protocols, Step 6 **must** run `/challenge` on `{system-id}.md`.  
> When the host runs **`/challenge`**, read reviewer skills from the paired paths under the **same workspace** `.agents/skills/*` as that `challenge.md`.

---

## Step 0: Parameters and version

### What to do

1. If `<system-id>` is **missing**: show `/design-system <system-id>` format, list IDs from `02_ARCHITECTURE_OVERVIEW.md`, stop.  
2. Record `system_id`; scan `.anws/` for latest `v{N}`; set `TARGET_DIR = .anws/v{N}`.

### Why

No ID → no write path; no version → cross-talk with other workflows.

### How to verify

- Session states `system_id` and `TARGET_DIR`; if ID missing, **no** downstream design reads.

---

## Step 1: Context load and ADR inventory

### What to do

1. Verify `{TARGET_DIR}/01_PRD.md`, `{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`, `{TARGET_DIR}/03_ADR/` exist—else instruct `/genesis` and stop.  
2. Read `01`, `02`; in `02`, locate this `system_id` responsibility, boundary, dependencies, linked `[REQ-*]`.  
3. Scan `03_ADR/`; list ADR paths to be **cited only, not copied** in **§8 Trade-offs** (**no** long fenced example here).  
4. Optional: read existing L0 draft for same system if incrementally evolving.

### Why

Design must hang on PRD / architecture / ADR facts; §8 ↔ ADR is a **citation chain**.

### How to verify

- One-sentence boundary + at least one ADR↔§8 mapping; stops fired when files missing.

---

## Step 2: System understanding (compressed)

### What to do

Converge with short Q/A (in-session): success criteria, main risks, interface touchpoints with dependencies; use CLI per **CRITICAL sequential-thinking** when complex.

### Why

Prevents jumping to implementation filler without boundary clarity.

### How to verify

- One line each: “who consumes this system’s outputs?” and “what is explicitly out of scope?”

---

## Step 3: Research (`/explore`)

### What to do

1. **Must** invoke **`/explore`** (follow the bundle **`explore` workflow** for triggers and OUTPUT rules) until evidence suffices for current risks.  
2. Default path: `.anws/v{N}/04_SYSTEM_DESIGN/_research/{system-id}-research.md` (if `explore.md` mandates another path, **`explore.md` wins**).  
3. Research topics are authored from system type and risk—**this workflow does not** ship a long topic catalog.

### Why

Design needs external constraints and practices; evidence must be traceable.

### How to verify

- `_research` exists and is substantive; report satisfies `explore`’s **seven section responsibilities**.

---

## Step 4: Design reasoning

### What to do

From research + Step 2, reason through architecture, interface contracts, data, trade-offs, performance, security; **dimensions and granularity** follow `system-designer` 6D and in-SKILL prompts; choose CLI vs CoT per **CRITICAL sequential-thinking**. Keep scratch in-session until Step 5—**no** obligation to paste large draft fences here.

### Why

Separates “thinking clearly” from “filling the template”.

### How to verify

- At least two trade-offs, each tied to `_research` or ADR evidence.

---

## Step 5: Documentation (L0 / L1)

### What to do

1. **On entering this Step**, read **`.agents/skills/system-designer/SKILL.md`**, then **`references/system-design-template.md`** and, if needed, **`system-design-detail-template.md`**.  
2. Run **L1 split detection (R1–R5 per SKILL)** first; fill **L0** `{system-id}.md`; add `{system-id}.detail.md` when rules fire.  
3. L0 must include **Mermaid** architecture/dataflow (per SKILL); **§8** cites ADRs only—no duplicated decision prose; contract tables / field-declaration depth per SKILL “rules” sections.  
4. Persist:  
   - Required: `{TARGET_DIR}/04_SYSTEM_DESIGN/{system-id}.md`  
   - Optional: `{TARGET_DIR}/04_SYSTEM_DESIGN/{system-id}.detail.md`  
5. **Do not** paste the full 14-heading outline here—the template files are canonical.

### Why

Headings and L0/L1 boundaries are long-lived contracts; the host only blocks skipped steps.

### How to verify

- L0 exists; if L1 claimed, `.detail.md` exists and L0 contains navigation anchors to it.

---

## Step 6: Review (`/challenge`, conditional)

### What to do

If this system hits the **public contract types** listed in the first **CRITICAL `/challenge`** block: run **`/challenge`** on `{TARGET_DIR}/04_SYSTEM_DESIGN/{system-id}.md` per that workflow; on major findings, loop Step 4/5 then re-challenge.

### Why

Contract mistakes amplify through blueprint and forge.

### How to verify

- When condition true, challenge artifact path or report exists; when false, explicit “N/A + one-line reason”.

---

## Step 7: Human checkpoint and `AGENTS.md`

### What to do

1. Show user paths to L0 (and L1), `_research`; give **≤3** self-check prompts (boundary, §8 citations, Mermaid).  
2. Append/update **one line** in `AGENTS.md` navigation or system-boundary section pointing to L0 (**no** large fenced template).

### Why

Human sign-off plus team entry makes design externally visible.

### How to verify

- User had a chance to confirm; `AGENTS.md` contains a searchable one-line link for this system.

---

<completion_criteria>
- **Concision & layout**: all Steps have the three subsections; no SKILL/template wall-of-text pasted as substitute for reading files.  
- `system_id` + `TARGET_DIR` explicit; missing inputs caused correct stop.  
- `/explore` executed with usable `_research`; Step 5 read **`.agents/skills/system-designer/`** + templates and wrote L0 (+ conditional L1).  
- Step 6 executed when contract gate applies, or waived with valid reason.  
- Step 7 human prompts plus one-line `AGENTS.md` entry complete.  
</completion_criteria>
