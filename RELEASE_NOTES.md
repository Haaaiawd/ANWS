# Release Notes

## v2.4.1

This release includes the unreleased v2.4.0 work and the final template-quality fixes needed before publishing.

### Highlights

- Added multi-target projection support for modern AI coding environments, including workflows, commands, prompts, and skills layouts.
- Added `templates_en/` as the English template bundle and wired locale-aware install/update behavior.
- Added the `anws-system` projection path for skills-only targets, including generated workflow references for Codex and Trae style bundles.
- Added install-lock based update semantics so `anws update` can refresh managed files without reinstalling the project layout.
- Added controlled changelog generation for update runs under `.anws/changelog/`.
- Added `output-contract` as the shared report contract for precision, evidence, non-repetition, and closure rules.

### Workflow And Skill Refresh

- Refreshed the main workflow set: `quickstart`, `probe`, `explore`, `challenge`, `blueprint`, `design-system`, `genesis`, `forge`, `change`, `upgrade`, and `craft`.
- Split task planning into `05A_TASKS.md` and `05B_VERIFICATION_PLAN.md` contracts.
- Strengthened `/forge` with explicit review, validation, and evidence gates.
- Reworked `system-designer` and `runtime-inspector` into the current ALPHA orchestration style.
- Removed the standalone `report-template` skill; `/probe` is now the source of truth for probe reports.
- Cleaned stale tool names, stale `.agent/skills` paths, emoji status markers, and old persona-style wording from published templates.

### CLI And Packaging

- `anws init` now skips a target when its installed version already matches the current CLI version; use `anws update` to refresh templates.
- `anws update` preserves the locale recorded in the install lock.
- `npm pack --dry-run` publishes only the active package files: CLI/lib code plus `templates/`, `templates_en/`, and README.
- `templates_alpha*` and removed template drafts are not part of the npm package.

### Quality Gates

- Extended canonical template checks to scan both Chinese and English template trees.
- Added forbidden-pattern checks for stale paths, removed report-template references, obsolete tool names, and legacy style markers.
- Current verification: `pnpm test` passes all 72 tests, and `npm pack --dry-run` succeeds for `@haaaiawd/anws@2.4.1`.
