'use strict';

/**
 * MANAGED_FILES — anws 托管文件清单
 *
 * 此数组列出 anws 包负责管理的所有文件路径（相对于目标项目根目录）。
 */
const MANAGED_FILES = [
  '.agent/rules/agents.md',
  '.agent/skills/build-inspector/SKILL.md',
  '.agent/skills/complexity-guard/references/anti_patterns.md',
  '.agent/skills/complexity-guard/SKILL.md',
  '.agent/skills/concept-modeler/prompts/GLOSSARY_PROMPT.md',
  '.agent/skills/concept-modeler/references/ENTITY_EXTRACTION_PROMPT.md',
  '.agent/skills/concept-modeler/scripts/glossary_gen.py',
  '.agent/skills/concept-modeler/SKILL.md',
  '.agent/skills/design-reviewer/SKILL.md',
  '.agent/skills/git-forensics/references/ANALYSIS_METHODOLOGY.md',
  '.agent/skills/git-forensics/scripts/git_forensics.py',
  '.agent/skills/git-forensics/scripts/git_hotspots.py',
  '.agent/skills/git-forensics/SKILL.md',
  '.agent/skills/report-template/references/REPORT_TEMPLATE.md',
  '.agent/skills/report-template/SKILL.md',
  '.agent/skills/runtime-inspector/SKILL.md',
  '.agent/skills/spec-writer/references/prd_template.md',
  '.agent/skills/spec-writer/SKILL.md',
  '.agent/skills/system-architect/references/rfc_template.md',
  '.agent/skills/system-architect/SKILL.md',
  '.agent/skills/system-designer/references/system-design-detail-template.md',
  '.agent/skills/system-designer/references/system-design-template.md',
  '.agent/skills/system-designer/SKILL.md',
  '.agent/skills/task-planner/references/TASK_TEMPLATE.md',
  '.agent/skills/task-planner/SKILL.md',
  '.agent/skills/task-reviewer/SKILL.md',
  '.agent/skills/tech-evaluator/references/ADR_TEMPLATE.md',
  '.agent/skills/tech-evaluator/SKILL.md',
  '.agent/workflows/blueprint.md',
  '.agent/workflows/challenge.md',
  '.agent/workflows/change.md',
  '.agent/workflows/craft.md',
  '.agent/workflows/design-system.md',
  '.agent/workflows/explore.md',
  '.agent/workflows/forge.md',
  '.agent/workflows/genesis.md',
  '.agent/workflows/quickstart.md',
  '.agent/workflows/scout.md'
];

/**
 * USER_PROTECTED_FILES — 用户保护文件
 *
 * 这些文件在项目初始化后通常会包含特定于项目的配置。
 * anws update 默认会跳过这些文件。
 */
const USER_PROTECTED_FILES = [
  '.agent/rules/agents.md'
];

module.exports = {
  MANAGED_FILES,
  USER_PROTECTED_FILES
};
