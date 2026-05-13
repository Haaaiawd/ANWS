# Template bundle contract (CLI · canonical · alpha)

This document defines **install boundaries**: what the CLI copies, how canonical `templates/` relates to alpha overlays, and how we avoid **silent product-contract changes**.  
Any change to **`lib/manifest.js`** `RESOURCE_REGISTRY` is an **explicit** change to what users receive—document it in **release notes**.

---

## 1. Single source for CLI copies

| Mechanism | Role |
|-----------|------|
| **`RESOURCE_REGISTRY`** | Array in `lib/manifest.js`; **only** driver for paths written by `anws init` / `anws update` (per IDE projection). |
| **`TEMPLATE_ROOT`** | `src/anws/templates/` (see `lib/resources`). **`resolveCanonicalSource`** joins this root + each registry **`source`**. |
| **Check** | `scripts/check-canonical-templates.js`: every registry **`source`** must exist under **`templates/`** as a regular file. |

Relative paths that **do not** appear in **`RESOURCE_REGISTRY`**—even if present on disk under **`templates/`**—are **not** installed by default CLI. That is **registry gap vs shipped disk**, not the same as alpha **choosing** to omit a mirrored skill. (Example: a **`nexus-query/`** tree on disk without a registry row is **not** CLI-delivered; an alpha tree may omit the mirror entirely—use **registry + this doc**, do not conflate.)

---

## 2. Canonical (`templates/`) vs EN mirror (`templates_en/`)

- **`templates/`**: canonical tree shipped in the npm package (default zh authoring layout).
- **`templates_en/`**: English mirror for bilingual maintenance; **CLI still resolves copy sources from `templates/` only**. Keeping zh/en aligned is a **maintainer** duty, not a second install root.

---

## 3. Alpha overlay (`templates_alpha/` · `templates_alpha_en/`)

**Not** a second semver line and **not** mounted wholesale in **`RESOURCE_REGISTRY`**.

| Property | Detail |
|----------|--------|
| **Purpose** | Optional install root, remediation, experiments. |
| **Install** | No `anws init --bundle alpha` today—overlay use is **manual** or custom scripting. |
| **vs canonical** | May **omit** whole skills (e.g. no **`nexus-query`** mirror) to save volume; if you need that capability, read shipped **`templates/`** homonyms or **register** those paths in the registry before relying on CLI. |
| **Shared contracts** | Prefer **`output-contract`** and single skill references instead of duplicating long prose in the overlay. |

### Before merging overlay into canonical (checklist)

1. **Omission**: **permanent product removal** vs **overlay-only**—if the latter, canonical/registry must not pretend the feature vanished.
2. **Registry**: adding/removing entries affects **every** user on update—semver + release notes.
3. **Bulk**: **slim / extract skills / dedupe** first, then merge—avoid dumping narrative debt into default paths.

---

## 4. Split vs `/craft` and `output-contract`

| Artifact | Owns |
|----------|------|
| **`craft-authoring` SKILL** | Authoring scaffolds + scoring gate for `/craft`. |
| **`output-contract`** | Runtime persisted-report spec + delegation + single-writer rules. |
| **This `BUNDLE_POLICY`** | **What the CLI installs**, canonical vs alpha **semantics**, merge **decisions**. |

---

## 5. Slim-down roadmap (suggested order)

1. **Registry gap**: if a path under **`templates/`** should ship but is missing from **`RESOURCE_REGISTRY`**, either **register** it or **delete** unused disk clutter.
2. **Dedupe**: replace duplicated bullets in reviewers/workflows with **one-line pointers** to **`output-contract`** / this policy.
3. **Heavy skills** (e.g. **`system-architect`**): shrink embedded templates; **link** one authoritative file instead of mirroring ADR tables—then revisit alpha promotion or large merges.
