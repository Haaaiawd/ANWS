# Template bundle contract (CLI · package templates)

This document defines **install boundaries**: what the CLI copies. The product ships **one** `RESOURCE_REGISTRY`. **`zh` / `en`** only selects which on-disk tree supplies text for the **same relative paths**—not two competing product authorities.  
Any change to **`lib/manifest.js`** `RESOURCE_REGISTRY` is an **explicit** change to what users receive—document it in **release notes**.

---

## 1. Single source for CLI copies

| Mechanism | Role |
|-----------|------|
| **`RESOURCE_REGISTRY`** | Array in `lib/manifest.js`; **only** driver for paths written by `anws init` / `anws update` (per IDE projection). |
| **`TEMPLATE_ROOT`** / **`TEMPLATE_ROOT_EN`** | `src/anws/templates/` and `src/anws/templates_en/` (see `lib/resources`). **`resolveCanonicalPath(rel, templateLocale)`** reads **`templates/`** for **`zh`**; for **`en`** it prefers the same **relative path** under **`templates_en/`**, falling back to **`templates/`** when missing. |
| **Check** | `scripts/check-canonical-templates.js`: every registry **`source`** must exist under **`templates/`** as a regular file. |

Relative paths that **do not** appear in **`RESOURCE_REGISTRY`**—even if present on disk under **`templates/`**—are **not** installed by default CLI. Example: a **`nexus-query/`** tree maintained in-repo but **not** registered is **not** CLI-delivered—use **registry + this doc** as authority.

---

## 2. `templateLocale`: `templates/` and `templates_en/`

- **`templates/`**: default zh copy tree in the npm package; also the **registry existence check root**.
- **`templates_en/`**: English mirror; when **`install-lock`** has **`templateLocale: en`**, init/update reads the same **relative paths** from **`templates_en/`**, with fallback to **`templates/`** for missing files.
- Maintainer duty: keep **the same `source` relative paths** semantically aligned across zh/en—avoid EN-only drift.

---

## 3. Split vs `/craft` and `output-contract`

| Artifact | Owns |
|----------|------|
| **`craft-authoring` SKILL** | Authoring scaffolds + scoring gate for `/craft`. |
| **`output-contract`** | Runtime persisted-report spec + delegation + single-writer rules. |
| **This `BUNDLE_POLICY`** | **What the CLI installs**, locale root selection, registry **decisions**. |

---

## 4. Slim-down roadmap (suggested order)

1. **Registry gap**: if a path under **`templates/`** should ship but is missing from **`RESOURCE_REGISTRY`**, either **register** it or **delete** unused disk clutter.
2. **Dedupe**: replace duplicated bullets in reviewers/workflows with **one-line pointers** to **`output-contract`** / this policy.
3. **Heavy skills** (e.g. **`system-architect`**): shrink embedded templates; **link** one authoritative file instead of mirroring ADR tables—then revisit large merges.
