# Anws v2.0.0 Release Draft

## Title

Anws v2.0.0 — Unified `.anws/` protocol, controlled `AGENTS.md` upgrades, and multi-target AI IDE projections

## Summary

`v2.0.0` is a major release for Anws.

This release upgrades the project protocol itself:

- unify architecture and upgrade state under `.anws/`
- treat `AGENTS.md` as a controlled managed file instead of an always-skipped file
- formalize multi-target projection across Windsurf, Antigravity, Claude Code, GitHub Copilot, Cursor, Codex Preview, and OpenCode
- strengthen `anws update` with install-lock awareness, fallback scanning, drift detection, and per-target reporting
- align the CLI brand layer with a more polished update experience

## Highlights

### 1. Unified `.anws/` root

Anws now standardizes project state under a single root:

- `.anws/v{N}/`
- `.anws/changelog/`
- `.anws/install-lock.json`

This replaces older split mental models such as `genesis/` plus `anws/changelog/`.

### 2. Controlled `AGENTS.md` upgrades

`AGENTS.md` is no longer treated as a file that must always be skipped.

New behavior:

- marker-based `AGENTS.md` files are merged safely
- recognized legacy `AGENTS.md` files are migrated into the new structure
- unrecognized legacy `AGENTS.md` files are warned and preserved

This makes updates safer without destroying project-specific context.

### 3. Multi-target projection model

Anws now treats AI coding tools as first-class targets.

Supported targets:

- Windsurf
- Antigravity
- Claude Code
- GitHub Copilot
- Cursor
- Codex (Preview)
- OpenCode

One canonical source is projected into each target's native directory layout.

### 4. Codex aggregation + OpenCode support

Codex changed upstream behavior, so Anws now adapts accordingly:

- Codex is now explicitly marked as **Preview**
- because Codex prompts are no longer available, Anws packages workflow guidance into `.codex/skills/anws-system/`
- `/quickstart` is exposed as `SKILL.md`
- other workflow materials are exposed under `references/*.md`

This release also adds native OpenCode support:

- `.opencode/commands/`
- `.opencode/skills/`

### 5. Stronger `anws update`

`anws update` now supports:

- install-lock based target detection
- directory scan fallback when lock state is missing or invalid
- drift detection between expected and on-disk state
- grouped per-target reporting
- generated upgrade records under `.anws/changelog/`

### 6. Workflow ecosystem alignment

This release also consolidates workflow semantics:

- `nexus-skills` integration is now part of the main story
- `nexus-mapper` becomes the structural analysis backbone for `/probe`
- legacy `/scout` naming is fully retired in favor of `/probe`

## Breaking Changes

### Directory protocol

If you still describe your project in terms of:

- `genesis/v{N}/`
- `anws/changelog/`

update those references to:

- `.anws/v{N}/`
- `.anws/changelog/`

### `AGENTS.md` semantics

If you assumed `AGENTS.md` would always be skipped during updates, that assumption is no longer true.

Behavior is now:

- merge
- migrate
- preserve

based on the file structure and markers present.

### Workflow naming

If you still reference `/scout`, migrate those references to `/probe`.

### Codex target expectations

If you use Codex, note that workflow delivery is no longer prompt-based.
In `v2.0.0`, Codex support is intentionally marked as **Preview** while the aggregated skill strategy is validated in real projects.

## Migration Notes

### For legacy projects

If a project still contains legacy `.agent/` state:

- Anws can guide migration to `.agents/`
- after successful migration, interactive mode can ask whether to delete the old directory

### For legacy `AGENTS.md`

If the file is recognizable, Anws migrates it automatically.
If it is not recognizable, Anws preserves it and warns the user.

### For docs and prompts

Search and update old references to:

- `genesis/`
- `anws/changelog/`
- `/scout`
- old Codex prompt assumptions

## Recommended Upgrade Path

1. Update the CLI to `v2.0.0`
2. Run `anws update --check`
3. Review the target detection and drift report
4. Run `anws update`
5. Run `/upgrade` in your AI IDE to route follow-up architecture changes
6. Normalize any legacy doc references still pointing to old paths
7. If you use Codex, validate the generated `.codex/skills/anws-system/` layout in your real environment

## Assets for Release

Recommended assets to attach or reference:

- `assets/logo-cli.svg`
- `assets/logo-cli.png`
- updated README / README_CN

## npm Release Checklist

### Package metadata

- [x] `src/anws/package.json` version bumped to `2.0.0`
- [ ] confirm package description still matches `v2.0.0` scope
- [ ] confirm keywords still reflect target IDE strategy

### README sync

- [x] root `README.md` refreshed
- [x] root `README_CN.md` refreshed
- [x] run `npm run sync`
- [x] verify `src/anws/README.md` and `src/anws/README_CN.md` are updated from root

### Image / asset delivery

- [x] `assets/logo-cli.svg` generated
- [x] `assets/logo-cli.png` generated
- [x] keep the existing README image strategy consistent with prior releases
- [x] replace the top logo with `assets/logo-cli.png`
- [x] run sync and verify the packaged README keeps the logo path behavior users already rely on

### Validation

- [x] run package tests
- [x] run `npm run sync`
- [x] inspect generated package contents with `npm pack --dry-run`
- [ ] verify README image rendering strategy for npm
- [ ] verify `anws --help`
- [ ] verify `anws update --check`
- [ ] verify `anws update`

### Publish

- [ ] `npm version 2.0.0` equivalent is already reflected manually; avoid accidental double bump
- [ ] publish package
- [ ] create GitHub Release with this draft
- [ ] attach or reference logo assets

## Residual Cleanup Before Publish

Likely remaining cleanup buckets:

- architecture docs still containing historical `v1.4.0` examples
- prompts or workflow docs still referencing older path semantics where user-facing language should now prefer `.anws/`
- npm page rendering should be spot-checked against the prior relative-path behavior after publish
- Codex Preview should continue to be validated against the evolving upstream product behavior
