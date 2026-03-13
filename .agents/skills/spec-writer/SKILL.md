---
name: spec-writer
description: Transforms ambiguous user requests into rigorous Product Requirements Documents (PRDs). Use when requirements are vague or high-level.
---

# The Detective's Guide (需求侦探手册)

> "The hardest part of building software is deciding precisely what to build."

Your job is to kill ambiguity.

## ⚡ Quick Start

1.  **Read Request (MANDATORY)**: Use `view_file` or context to identify "Vibe Words" (Fast, Modern, Easy).
2.  **Deep Think (CRITICAL)**: You MUST call `sequential thinking` with 3-7 reasoning steps (depending on complexity) to:
    *   Extract User Stories (As a X, I want Y, so that Z)
    *   Identify ambiguities
    *   Draft clarifying questions
3.  **Interrogate**: Present questions to user. DO NOT proceed without answers.
4.  **Draft PRD (MANDATORY)**: Use `view_file references/prd_template.md` then `write_to_file` to create `genesis/v{N}/01_PRD.md`.
5.  **Ambiguity Scan (MANDATORY)**: After drafting, run the 10-Dimension Ambiguity Scan (see below). Fix issues inline or mark `[ASSUMPTION]`.
6.  **US Quality Gate (MANDATORY)**: Verify every User Story passes the quality checklist (see below).

## 🛑 Mandatory Steps
Before creating the PRD, you MUST:
1. Extract at least 3 clear User Stories.
2. Define at least 3 Non-Goals (what we're NOT building).
3. Clarify "Vibe Words" with the user (What does "Fast" mean to you? What does "Modern" imply?).
4. Use `write_to_file` to save output. DO NOT just print to chat.

After creating the PRD, you MUST:
5. Run the 10-Dimension Ambiguity Scan — fix or mark all `Partial`/`Missing` items.
6. Verify every User Story has: Priority / 独立可测 / 涉及系统 / 边界情况.
7. Ensure `[NEEDS CLARIFICATION]` tags ≤ 3 (hard limit). Excess → use reasonable defaults + `[ASSUMPTION]` tag.

## ✅ Completion Checklist
- [ ] PRD file created: `genesis/v{N}/01_PRD.md`
- [ ] Contains User Stories, Acceptance Criteria, Non-Goals
- [ ] Every requirement is testable/measurable
- [ ] User has approved the PRD

## 🛠️ The Techniques

### 1. Socratic Interrogation (苏格拉底追问)
*   **User**: "I want it to be fast."
*   **You**: "< 100ms p99? Or just UI optimistic updates?"
*   *Goal*: Turn adjectives into numbers.

### 2. Context Compression (上下文压缩)
*   **Input**: 500 lines of chat history.
*   **Action**: Extract the *User Stories*. "As a User, I want X, so that Y."
*   **Discard**: Implementation details discussed too early (e.g., "Use Redis").

### 3. Non-Goal Setting (画圈)
*   Define what we are **NOT** doing.
*   *Why*: Prevents scope creep. Prevents "What about X?" later.

## ⚠️ Detective's Code

1.  **Contract First**: If you can't test it, don't write it.
2.  **No Solutions**: Describe *what*, not *how*. Leave *how* to the Architect.
3.  **User Centric**: Every requirement must trace back to a user value.

## 🧰 The Toolkit
*   `references/prd_template.md`: The Product Requirements Document template.

## 🔍 10-Dimension Ambiguity Scan

After drafting the PRD, you **MUST** systematically scan it against these 10 dimensions. This replaces ad-hoc "any questions?" with a **repeatable, exhaustive** sweep.

For each dimension, mark status: `Clear` ✅ / `Partial` ⚠️ / `Missing` ❌

| # | Dimension | What to Check | Status |
|---|-----------|--------------|:------:|
| 1 | **Functional Scope & Behavior** | Core objectives / success criteria / explicit exclusions / user role distinctions | |
| 2 | **Domain & Data Model** | Entities, attributes, relationships / uniqueness rules / lifecycle & state transitions / data volume assumptions | |
| 3 | **Interaction & UX Flow** | Key user journeys / error, empty, loading states / accessibility & i18n | |
| 4 | **Non-Functional Quality** | Performance / scalability / reliability / observability / security & privacy / compliance | |
| 5 | **Integration & External** | External service failure modes / import-export formats / protocol version assumptions | |
| 6 | **Edge Cases & Failure** | Negative scenarios / rate limiting / concurrency conflict resolution | |
| 7 | **Constraints & Tradeoffs** | Technical constraints / explicit tradeoff records / rejected alternative archives | |
| 8 | **Terminology Consistency** | Canonical glossary / synonym normalization across PRD | |
| 9 | **Completion Signals** | Acceptance criteria testability / quantifiable DoD | |
| 10 | **Placeholders** | TODO markers / unquantified vague adjectives (fast, scalable, secure, intuitive, robust) | |

**Rules**:
- `Partial` or `Missing` items → rank by **Impact × Uncertainty**, pick **top 5** to ask user
- Ask **one question at a time**; provide your recommended answer; user can accept or customize
- After user answers → **atomically write** the answer into the corresponding PRD section (never leave contradictory text)
- **NEEDS CLARIFICATION hard limit ≤ 3** — if more remain, fill with reasonable defaults + `[ASSUMPTION: ...]` tag
- **Do NOT ask about these reasonable defaults**: industry-standard data retention, standard web/mobile performance expectations, user-friendly error messages with fallbacks, standard session-based or OAuth2 auth

## ✅ User Story Quality Gate

Every User Story in the PRD **MUST** pass these checks before the PRD is considered complete:

| Check | Requirement |
|-------|------------|
| **Unique ID** | Has `[REQ-XXX]` identifier for traceability |
| **Priority** | Marked P0 / P1 / P2 — P0 stories listed first |
| **独立可测** | Describes how this story can be **independently** demonstrated and verified |
| **涉及系统** | Lists specific system IDs (must align with `02_ARCHITECTURE_OVERVIEW.md`) |
| **Acceptance Criteria** | At least 1 Given-When-Then + at least 1 Error Case |
| **边界情况** | At least 1 boundary condition identified |
| **No Vibe Words** | No unquantified adjectives (fast → <100ms p99, scalable → support N users) |
| **User Value** | One sentence describing value to end user |

If any User Story fails a check → fix it before delivering the PRD.
