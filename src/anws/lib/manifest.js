'use strict';

/**
 * MANAGED_FILES — anws 托管文件清单
 *
 * 此数组列出 anws 包负责管理的所有文件路径（相对于目标项目根目录）。
 *
 * 冲突检测规则：
 * - 仅当目标项目中存在此清单内的文件时，才触发覆盖确认
 * - 清单之外的用户文件，在任何情况下均不会被触碰
 *
 * 维护规则（重要）：
 * - 每次向 templates/.agent/ 新增文件时，必须同步更新此数组
 * - 文件路径格式：'.agent/relative/path'（Unix 风格斜杠）
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
  '.agent/skills/system-designer/references/system-design-template.md',
  '.agent/skills/system-designer/SKILL.md',
  '.agent/skills/task-planner/references/TASK_TEMPLATE.md',
  '.agent/skills/task-planner/SKILL.md',
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
  '.agent/workflows/scout.md',
];

module.exports = { MANAGED_FILES };
