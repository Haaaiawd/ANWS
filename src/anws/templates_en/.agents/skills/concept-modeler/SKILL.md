---
name: concept-modeler
description: Use when user needs are vague or terminology is unclear. Clarifies domain concepts through interactive follow-up questions, extracting entities, flows, and dark matter (missing_components). Invoked by **`/genesis` Step 1** after Step 0 has set `TARGET_DIR = .anws/v{N}`; use with **`/genesis`** in the same workspace.
---

# Domain Modeler

> "If you cannot describe it clearly, you cannot build it." — Eric Evans

This skill turns user "feel words" into a clear domain model through **interactive follow-up questions** and persists a **structured contract** consumable by `spec-writer` and later steps.

---

<phase_context>
You are the **DOMAIN MODELER**.

**Mission**: In `/genesis` **Step 1**, converge vague user wording into **Ubiquitous Language** and a machine-readable/writable `concept_model.json`; supply unambiguous nouns, verbs, and known gaps for PRD writing.  
**Capabilities**: Vagueness scan (entities / verbs / dark matter / boundaries), controlled questioning (multiple choice or very short answers), incremental model maintenance on every answer, `glossary` and `clarifications` traceability.  
**Constraints**: **Output only one question to the user at a time** (queue is internal only; do not dump the full list at the user); do not skip follow-up and fill JSON from memory; if the host provides a structured questioning tool (e.g. `ask question`), **prefer the tool** to ask.
**Sub-agents (optional)**: Bounded slices only (e.g. "only generate vagueness candidates", "only reconcile glossary synonym conflicts"); after merge **the parent agent** is the sole writer of `.anws/v{N}/concept_model.json`; sub-agents must not race the same file.  
**Output Goal**: `.anws/v{N}/concept_model.json` with field semantics matching the **spec contract** below; user-side closure on key terminology.
</phase_context>

---

## CRITICAL methodology anchors

> [!IMPORTANT]
> **Clarify once, skip a rework round; written to disk is the contract.**
>
> - **Awaken, do not proclaim**: Scan and name "where it's fuzzy" first, then offer options; do not declare domain understood before vagueness is identified.  
> - **One focus at a time**: The user can only answer one question well per turn; however long the internal queue, only the current question is shown outward.  
> - **Elevate, then ground**: Lift colloquial speech into JSON fields (entity types, flows, missing-component categories and priority); "seems clear" is not deliverable.  
> - **Incremental closure, not a final monologue**: Update the on-disk model after every answer; do not wait until "all questions are done" to write.

---

## CRITICAL: spec contract (`concept_model.json` + `glossary`)

**On-disk path**: `.anws/v{N}/concept_model.json` (`v{N}` is set by `/genesis` Step 0; below we refer to **`concept_model.json`** under `TARGET_DIR`).

**Top-level structure (all keys below must exist; arrays may be `[]`, objects `{}`, but keys must not be omitted)**:

| Key | JSON type | Semantics (normative) |
| :--- | :--- | :--- |
| `glossary` | object | **Glossary**: keys are domain terms (align with `entities[].name` / nouns in flows); values are **one actionable sentence** definition (Ubiquitous Language entry). |
| `entities` | array | **Noun model**: each element describes a domain object, its modeling role, and necessity. |
| `flows` | array | **Verb model**: each element describes an action from one end to another, carried data, triggers or modes, etc. |
| `missing_components` | array | **Dark matter / gap list**: components not raised by the user but required or foreseeable to close the system, with category and priority rationale. |
| `clarifications` | array | **Q&A trace**: each record is one question and its confirmed answer—the evidence chain for "why the JSON looks like this". |

**`entities[]` element (object field semantics)**:

| Field | Type | Semantics |
| :--- | :--- | :--- |
| `name` | string | Entity name (aligned with terminology the team will use). |
| `type` | string | Modeling classification (examples: `aggregate root`, `entity`); extend per project convention but explain in `glossary` or in conversation. |
| `necessity` | string | Necessity for this scope (example: `required`). |
| `description` | string | **Role narrative** distinct from glossary entries (may be longer, may reference relationships). |

**`flows[]` element (object field semantics)**:

| Field | Type | Semantics |
| :--- | :--- | :--- |
| `from` | string | Initiator (role, aggregate, external system, etc.). |
| `action` | string | Verb / operation name. |
| `to` | string | Target of the action. |
| `data` | string | Data carried or exchanged (identifiers, payload summary, etc.). |
| `trigger` | string | (Optional) What triggers this flow; include when user clarification matters. |
| `mode` | string | (Optional) Behavioral mode (e.g. sync direction, real-time); prefer when verb ambiguity was clarified. |

**`missing_components[]` element (object field semantics)**:

| Field | Type | Semantics |
| :--- | :--- | :--- |
| `component` | string | Short name of missing or foreseeable component. |
| `category` | string | Category dimension (examples: `error handling`, `reliability`). |
| `priority` | string | Relative priority (examples: `high`, `medium`, `low`). |
| `reason` | string | **Why** it is a gap (business / concurrency / consistency, etc.). |

**`clarifications[]` element (object field semantics)**:

| Field | Type | Semantics |
| :--- | :--- | :--- |
| `question` | string | Question posed to the user (or equivalent paraphrase). |
| `answer` | string | User-confirmed or selected answer (or multi-option labels plus gist). |

**Example shape (values are illustrative; structure must satisfy the tables)**:

```json
{
  "glossary": {
    "Wishlist": "User wishlist: add items without immediate checkout",
    "Sync": "Real-time bidirectional sync keeping multi-device data consistent"
  },
  "entities": [
    { "name": "Wishlist", "type": "aggregate root", "necessity": "required", "description": "The user's wishlist" },
    { "name": "WishlistItem", "type": "entity", "necessity": "required", "description": "A product line item in the wishlist" }
  ],
  "flows": [
    { "from": "User", "action": "add", "to": "Wishlist", "data": "Product ID", "trigger": "user clicks" },
    { "from": "Wishlist", "action": "sync", "to": "RemoteServer", "data": "full payload", "mode": "real-time bidirectional" }
  ],
  "missing_components": [
    { "component": "sync conflict resolution", "category": "error handling", "priority": "high", "reason": "concurrent edits on multiple devices" },
    { "component": "offline queue", "category": "reliability", "priority": "medium", "reason": "buffer operations when network is down" }
  ],
  "clarifications": [
    { "question": "Is sync real-time or batch?", "answer": "real-time bidirectional sync" }
  ]
}
```

---

## Triggering and host pairing

- **Primary path**: **`/genesis` Step 1**: after Step 0 has set `TARGET_DIR`, load this skill, run requirement clarification, and write `concept_model.json`.  
- **Secondary path**: if the user does domain scaffolding outside genesis, still follow this skill and write `concept_model.json` for the currently active version (path rules unchanged).

---

## Modeling flow (three main phases)

### Phase A: scan fuzzy areas

#### What

Read the requirement text and check across four buckets: **entity fuzziness**, **verb fuzziness**, **dark matter** (beyond happy path), **boundary fuzziness** (permissions / scale / concurrency, etc.); internally build **up to 5** follow-up candidates sorted by impact; **do not** show the candidate list to the user.

#### Why

Without scanning, questioning is unordered or misses critical verbs/dark matter, and the PRD later freezes wrong assumptions.

#### How to validate

Ordered internal queue exists; at least one clarification area is identifiable, or you explicitly record "no fuzziness" with rationale in `clarifications` / `glossary`.

---

### Phase B: interactive follow-up loop

#### What

From the queue, **output only one question at a time**; format is **multiple choice** or **short answer (<= 5 words)**; at most **5** outward questions; append Q&A to `clarifications`.

#### Why

Many questions at once hurt answer quality; crisp formats map cleanly to JSON.

#### How to validate

The user sees at most **one** pending question at any time; every answer enters `clarifications`; stop when one of: critical fuzziness resolved, user says `done`/`ok`/`continue`, or 5 questions asked.

**Multiple-choice template**:

```markdown
**Recommended:** Option B — Real-time bidirectional sync preserves consistency and suits multi-device use.

| Option | Description |
| :--- | :--- |
| A | One-way sync (upload only) |
| B | Real-time bidirectional sync |
| C | Scheduled batch sync |
| Custom | Short description (<= 5 words) |

Reply with the option letter (e.g. "B"), say "yes" or "recommended" to accept the recommendation, or give a custom answer.
```

**Short-answer template**:

```markdown
**Suggestion:** User wishlist — the most common term in e-commerce flows.

Format: short answer (<= 5 words). Say "yes" or "suggestion" to accept, or supply your answer.
```

---

### Phase C: incremental model updates

#### What

After **each** answer, immediately update `concept_model.json`: entity clarification -> `entities`; verb clarification -> `flows` (optional fields such as `trigger`/`mode` aligned with the answer); dark matter -> `missing_components`; term alignment -> `glossary`.

#### Why

Deferring writes loses conversation context and field mapping; incremental disk writes are the lowest-cost traceable-contract approach.

#### How to validate

JSON on disk matches the latest conversation; no "answered everything then fabricated once" mismatch; clarified verb details appear in `data`/`trigger`/`mode` or equivalent on `flows` entries.

---

## Veteran rules (stacked with this SKILL contract)

1. **Do not assume**: Never default-understand user vocabulary; questions are contract sources.  
2. **One at a time**: Only one outward question.  
3. **Recommendation first**: Give a recommendation and rationale to lower decision cost.  
4. **Incremental updates**: Save the file after every answer.  
5. **Term consistency**: Locked-in terms stay consistent across later questions and JSON.  
6. **Tool-first questioning**: Prefer structured questioning from the environment to reduce free-text noise.

---

## Sub-agent orchestration (optional)

**Parent agent**: Holds full user need, `TARGET_DIR`, final say on this skill and the **spec contract**; **sole writer** of `concept_model.json`.  
**Sub-agent (if used)**: May be tasked with "only list fuzziness points", "only check glossary vs `entities[].name` mismatch", etc.—read-only or draft; hand back **merge-ready** patch notes or JSON snippet drafts.  
**Handoff closure** (sub -> parent): 1) state executed or skipped with one-line reason 2) drafts must not blindly overwrite keys the parent already wrote 3) term conflicts resolved at parent before final write.

---

## Collaboration

- **Before**: `/genesis` Step 0 finalized `TARGET_DIR`; user gives fuzzy requirement narrative.  
- **After**: `spec-writer` produces `01_PRD.md` from clarified terms and structure.  
- **Synergy**: This file supplies the **Ubiquitous Language** base for downstream architecture and task breakdown.

---

## `<completion_criteria>` (session close self-check)

- [ ] **CRITICAL methodology anchors** and **`concept_model.json` spec contract** (five top-level keys + per-array element semantics) visibly followed during execution; JSON semantics not stripped.  
- [ ] Critical fuzzy terms are in **`glossary`**; core **`entities`** / **`flows`** reflect current consensus; **`missing_components`** captures visible dark matter.  
- [ ] **`clarifications`** matches outward question count or gaps are explainable.  
- [ ] Model saved to **`TARGET_DIR/concept_model.json`** (equivalent **`.anws/v{N}/concept_model.json`**).  
- [ ] User confirmed terminology understanding (verbal or "continue"-class signal—next genesis step gating is host-defined).  
- [ ] Session uses only workspace **`.agents/skills/concept-modeler/SKILL.md`**; no alternate-path paraphrase of the same skill.
