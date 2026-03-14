'use strict';

/**
 * MANAGED_FILES — anws 托管文件清单
 *
 * 此数组列出 anws 包负责管理的所有文件路径（相对于目标项目根目录）。
 */
const MANAGED_FILES = [
  'AGENTS.md',
  '.agents/skills/concept-modeler/SKILL.md',
  '.agents/skills/design-reviewer/SKILL.md',
  '.agents/skills/nexus-mapper/SKILL.md',
  '.agents/skills/report-template/references/REPORT_TEMPLATE.md',
  '.agents/skills/report-template/SKILL.md',
  '.agents/skills/runtime-inspector/SKILL.md',
  '.agents/skills/sequential-thinking/SKILL.md',
  '.agents/skills/spec-writer/references/prd_template.md',
  '.agents/skills/spec-writer/SKILL.md',
  '.agents/skills/system-architect/references/rfc_template.md',
  '.agents/skills/system-architect/SKILL.md',
  '.agents/skills/system-designer/references/system-design-detail-template.md',
  '.agents/skills/system-designer/references/system-design-template.md',
  '.agents/skills/system-designer/SKILL.md',
  '.agents/skills/task-planner/references/TASK_TEMPLATE.md',
  '.agents/skills/task-planner/SKILL.md',
  '.agents/skills/task-reviewer/SKILL.md',
  '.agents/skills/tech-evaluator/references/ADR_TEMPLATE.md',
  '.agents/skills/tech-evaluator/SKILL.md',
  '.agents/workflows/blueprint.md',
  '.agents/workflows/challenge.md',
  '.agents/workflows/change.md',
  '.agents/workflows/craft.md',
  '.agents/workflows/design-system.md',
  '.agents/workflows/explore.md',
  '.agents/workflows/forge.md',
  '.agents/workflows/genesis.md',
  '.agents/workflows/probe.md',
  '.agents/workflows/quickstart.md',
  '.agents/workflows/upgrade.md'
];

/**
 * USER_PROTECTED_FILES — 用户保护文件
 *
 * 这些文件在项目初始化后通常会包含特定于项目的配置。
 * anws update 默认会跳过这些文件。
 */
const USER_PROTECTED_FILES = [
  'AGENTS.md'
];

module.exports = {
  MANAGED_FILES,
  USER_PROTECTED_FILES
};
