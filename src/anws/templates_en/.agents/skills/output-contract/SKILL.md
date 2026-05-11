---
name: output-contract
description: Load when persisting reports in this template bundle, running parallel child sessions, or aligning outputs across workflows. Holds shared on-disk spec and delegation loop; unrelated to craft-authoring (/craft scaffolds).
---

# Output contract and collaboration loop

> If another skill or workflow repeats these bullets, replace with **one line pointing here** and keep only role- or step-specific deltas.

## When to load

- Authoring architecture / review / exploration Markdown that will land in the repo.
- Parent session splits parallel children or path-sliced collaboration.
- Verifying traceability, duplicate storytelling, or single-writer rules.

## Shared spec contract

- **Precise**: Verifiable statements must cite sources or `path:line` / section anchors; no unsourced strong claims.
- **Evidence-backed**: Findings / evidence / recommendations must trace back to concrete inputs or retrieval results.
- **Non-repetitive**: State each fact once; no duplicate narrative in summary vs body.
- **No filler**: Ban vague boilerplate (“needs optimization”, “should watch”) without a clear subject.

Normative blocks (CRITICAL, severity tables, gates, upstream/downstream contracts) **must not be deleted**; tightening targets execution chatter and repetitive storytelling only.

## Delegation loop (parent ↔ child)

1. **Parent session**: `TARGET_DIR`, round, final paths, merge order, **sole write** to normalized report paths.
2. **Child session**: Bounded slice; same evidence rules as parent.
3. **Handoff**: Child returns mergeable table structure + one-line verdict; parent dedupes, checks against spec, writes `07_*` / explore reports, then runs workflow **completion** at the end.

Without delegation: single session runs the full workflow; parent still owns final persistence and consistency.

## Parallelism and paths

- At most **one active writer per managed path (or glob)** per batch; no repo-wide format passes outside authorized globs.
- Child scopes must be **disjoint** by directory or topic; parent arbitrates conflicts.
- Checklist phrasing aligned with `/genesis` lives in **`genesis.md`** “Sub-agent orchestration and handoff checklist” (same section title in EN trees).
