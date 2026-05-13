"use strict";

const path = require("node:path");
const fs = require("node:fs/promises");
const { buildProjectionPlan } = require("./manifest");
const { getTarget, listTargets } = require("./adapters");
const {
  planAgentsUpdate,
  resolveAgentsInstall,
  printLegacyMigrationWarning,
  pathExists,
} = require("./agents");
const { ensureChangelogDir } = require("./changelog");
const { resolveCanonicalPath, resolveRootAgentsPath } = require("./resources");
const { writeTargetFiles } = require("./copy");
const {
  createInstallLock,
  dedupeTargets,
  detectInstallState,
  summarizeTargetState,
  writeInstallLock,
} = require("./install-state");
const { selectMultiple, selectRadio, confirm } = require("./prompt");
const {
  success,
  warn,
  info,
  fileLine,
  skippedLine,
  blank,
  logo,
  section,
} = require("./output");

async function init() {
  const cwd = process.cwd();
  logo();
  const installState = await detectInstallState(cwd);
  const retainedTargetIds = await resolveRetainedTargetIds(cwd, installState);
  const targets = await selectTargets(installState, retainedTargetIds);
  const templateLocale = await resolveTemplateLocaleForInit(installState);
  const targetIds = Array.from(new Set(targets.map((item) => item.id)));
  const targetPlans = buildProjectionPlan(targetIds);
  const srcAgents = resolveRootAgentsPath(templateLocale);
  const resolveCanonicalSource = (relPath) =>
    resolveCanonicalPath(relPath, templateLocale);
  const cliVersion = require(
    path.join(__dirname, "..", "package.json"),
  ).version;

  info("Initializing Anws...");
  info(`Target IDEs: ${targets.map((item) => item.label).join(", ")}`);
  info(
    `Template locale: ${templateLocale} (${templateLocale === "en" ? "templates_en/" : "templates/"})`,
  );
  if (installState.needsFallback) {
    info(
      "Install lock missing or unreadable. Falling back to scanned target state.",
    );
  }
  if (installState.drift.hasDrift) {
    warn(
      `Detected install-state drift. Missing on disk: ${installState.drift.missingOnDisk.join(", ") || "none"}; untracked on disk: ${installState.drift.untrackedOnDisk.join(", ") || "none"}.`,
    );
  }
  blank();

  const written = [];
  const skipped = [];
  const successfulTargets = [];
  const failedTargets = [];
  const sessionWrittenFiles = new Set();

  for (const targetPlan of targetPlans) {
    const target = getTarget(targetPlan.targetId);
    const targetAlreadyInstalled = retainedTargetIds.includes(target.id);

    // Skip re-init of the same target at the same CLI version
    const existingTarget = installState.lockResult.lock?.targets?.find(
      (t) => t.targetId === target.id,
    );
    if (
      targetAlreadyInstalled &&
      existingTarget?.installedVersion === cliVersion
    ) {
      info(
        `${target.label} already installed at v${cliVersion}. Skipping — run \`anws update\` to refresh templates.`,
      );
      continue;
    }

    const rootAgentsExists = await pathExists(path.join(cwd, "AGENTS.md"));
    const agentsDecision =
      target.id === "antigravity"
        ? await resolveAgentsInstall({
            cwd,
            askMigrate,
            forceYes: !!global.__ANWS_FORCE_YES,
          })
        : {
            shouldWriteRootAgents: true,
            shouldWarnMigration: false,
            rootExists: rootAgentsExists,
          };

    let agentsUpdatePlan = null;
    if (agentsDecision.shouldWriteRootAgents && agentsDecision.rootExists) {
      const templateContent = await fs.readFile(srcAgents, "utf8");
      const existingContent = await fs.readFile(
        path.join(cwd, "AGENTS.md"),
        "utf8",
      );
      agentsUpdatePlan = planAgentsUpdate({ templateContent, existingContent });
    }

    const conflicting = await findConflicts(
      cwd,
      targetAlreadyInstalled
        ? []
        : targetPlan.managedFiles.filter((rel) => rel !== "AGENTS.md"),
      sessionWrittenFiles,
    );
    if (conflicting.length > 0) {
      const confirmed = await askOverwrite(conflicting.length, target.label);
      if (!confirmed) {
        skipped.push(...targetPlan.managedFiles);
        failedTargets.push({
          targetId: target.id,
          targetLabel: target.label,
          reason: `Skipped ${conflicting.length} conflicting managed file(s)`,
        });
        continue;
      }
    }

    const result = await writeTargetFiles(cwd, {
      targetPlan,
      protectedFiles: targetPlan.userProtectedFiles,
      srcAgents,
      shouldWriteRootAgents: agentsDecision.shouldWriteRootAgents,
      agentsUpdatePlan,
      resolveCanonicalSource,
    });

    written.push(...result.written);
    for (const rel of result.written) {
      sessionWrittenFiles.add(rel);
    }
    skipped.push(...result.skipped);
    successfulTargets.push(summarizeTargetState(targetPlan, cliVersion));

    if (agentsDecision.shouldWarnMigration) {
      printLegacyMigrationWarning();
    }
  }

  await ensureChangelogDir(cwd);
  const existingTargets = installState.lockResult.lock?.targets || [];
  const mergedTargets = dedupeTargets([
    ...existingTargets,
    ...successfulTargets,
  ]);
  const priorTemplateLocale = installState.lockResult.lock?.templateLocale;
  const effectiveTemplateLocale =
    written.length === 0 && priorTemplateLocale
      ? priorTemplateLocale
      : templateLocale;
  const generatedAt = new Date().toISOString();

  if (mergedTargets.length > 0) {
    await writeInstallLock(
      cwd,
      createInstallLock({
        cliVersion,
        generatedAt,
        templateLocale: effectiveTemplateLocale,
        targets: mergedTargets,
        lastUpdateSummary: {
          successfulTargets: successfulTargets.map((item) => item.targetId),
          failedTargets: failedTargets.map((item) => item.targetId),
          updatedAt: generatedAt,
        },
      }),
    );
  } else {
    warn(
      "Install-lock was not written: no targets were installed and no prior lock targets to retain.",
    );
  }

  printTargetSummary(successfulTargets, failedTargets);

  for (const rel of written) {
    fileLine(rel.replace(/\\/g, "/"));
  }

  if (skipped.length > 0) {
    blank();
    info("Skipped (project-specific, preserved):");
    for (const rel of skipped) {
      skippedLine(rel.replace(/\\/g, "/"));
    }
  }

  blank();
  success(
    `Done! ${written.length} files written for ${successfulTargets.map((item) => item.targetLabel).join(", ") || "selected targets"}.`,
  );
  printNextSteps(targets);
}

// ─── 辅助函数 ──────────────────────────────────────────────────────────────────

/**
 * 找出 cwd 中已存在的托管文件列表。
 * @returns {Promise<string[]>} 已存在的托管文件相对路径数组
 */
async function findConflicts(
  cwd,
  managedFiles,
  sessionWrittenFiles = new Set(),
) {
  const conflicts = [];
  for (const rel of managedFiles) {
    if (sessionWrittenFiles.has(rel)) {
      continue;
    }
    const abs = path.join(cwd, rel);
    const exists = await pathExists(abs);
    if (exists) conflicts.push(rel);
  }
  return conflicts;
}

/**
 * 交互式询问用户是否覆盖（默认 N）。
 * 非 TTY 环境（如 CI）自动返回 false。
 * @returns {Promise<boolean>}
 */
async function askOverwrite(count, label) {
  if (global.__ANWS_FORCE_YES) return true;

  if (!process.stdin.isTTY) {
    warn(
      `${count} managed file(s) already exist. Non-TTY: skipping overwrite.`,
    );
    return false;
  }

  return confirm({
    message: `Overwrite ${count} managed file(s) for ${label}?`,
    confirmLabel: "Overwrite",
    cancelLabel: "Skip",
    defaultValue: false,
  });
}

async function askMigrate() {
  if (global.__ANWS_FORCE_YES) return true;

  if (!process.stdin.isTTY) {
    return false;
  }

  return confirm({
    message: "Legacy .agent/ directory detected. Migrate to .agents/?",
    confirmLabel: "Migrate",
    cancelLabel: "Keep legacy",
    defaultValue: false,
  });
}

/**
 * 打印操作摘要（更新场景）。
 * @param {string[]} files  已写入的文件
 * @param {string[]} skipped 受保护跳过的文件
 * @param {string}  action
 */
function printSummary(files, skipped = [], action) {
  const verb = action === "updated" ? "Updating" : "Writing";
  blank();
  info(`${verb} files...`);
  blank();
  for (const rel of files) {
    fileLine(rel.replace(/\\/g, "/"));
  }
  if (skipped.length > 0) {
    blank();
    info("Skipped (project-specific, preserved):");
    for (const rel of skipped) {
      skippedLine(rel.replace(/\\/g, "/"));
    }
  }
  blank();
  success(
    `Done! ${files.length} file(s) ${action}${skipped.length > 0 ? `, ${skipped.length} skipped` : ""}.`,
  );
  if (action === "updated") {
    info("Managed files have been updated to the latest version.");
  }
}

async function resolveTemplateLocaleForInit(installState) {
  if (
    global.__ANWS_TEMPLATE_LOCALE === "zh" ||
    global.__ANWS_TEMPLATE_LOCALE === "en"
  ) {
    return global.__ANWS_TEMPLATE_LOCALE;
  }

  let fromLock = "zh";
  if (installState.lockResult.lock) {
    fromLock = installState.lockResult.lock.templateLocale || "zh";
  }

  if (!process.stdin.isTTY) {
    return fromLock === "en" ? "en" : "zh";
  }

  const initialIndex = fromLock === "en" ? 1 : 0;
  return selectRadio({
    message:
      "Workflow template bundle (manifest paths are the same; text is zh or en):",
    options: [
      { label: "中文 (templates/)", value: "zh" },
      { label: "English (templates_en/)", value: "en" },
    ],
    initialIndex,
  });
}

async function selectTargets(installState, retainedTargetIds = []) {
  const installedTargetIds = new Set(retainedTargetIds);

  if (global.__ANWS_TARGET_IDS && global.__ANWS_TARGET_IDS.length > 0) {
    return Array.from(
      new Set([...retainedTargetIds, ...global.__ANWS_TARGET_IDS]),
    ).map((targetId) => getTarget(targetId));
  }

  if (!process.stdin.isTTY) {
    return retainedTargetIds.length > 0
      ? retainedTargetIds.map((targetId) => getTarget(targetId))
      : [getTarget("antigravity")];
  }

  const targets = listTargets();
  const lockedIndexes = [];
  const initialSelectedIndexes = [];

  for (const [index, target] of targets.entries()) {
    if (installedTargetIds.has(target.id)) {
      lockedIndexes.push(index);
      initialSelectedIndexes.push(index);
    }
  }

  if (initialSelectedIndexes.length === 0) {
    const antigravityIndex = targets.findIndex(
      (target) => target.id === "antigravity",
    );
    if (antigravityIndex >= 0) {
      initialSelectedIndexes.push(antigravityIndex);
    }
  }

  return selectMultiple({
    message: "Choose your target AI IDEs:",
    options: targets.map((target) => ({
      label: target.label,
      value: target.id,
      locked: installedTargetIds.has(target.id),
    })),
    initialSelectedIndexes,
    lockedIndexes,
  }).then((selectedOptions) =>
    selectedOptions.map((option) => getTarget(option.value)),
  );
}

async function resolveRetainedTargetIds(cwd, installState) {
  if (!installState.needsFallback && !installState.drift.hasDrift) {
    return installState.selectedTargets;
  }

  const retainedTargetIds = [];

  for (const targetId of installState.selectedTargets) {
    const [targetPlan] = buildProjectionPlan([targetId]);
    const managedFiles = (targetPlan?.managedFiles || []).filter(
      (rel) => rel !== "AGENTS.md",
    );
    if (managedFiles.length === 0) {
      retainedTargetIds.push(targetId);
      continue;
    }

    const managedExists = await Promise.all(
      managedFiles.map((rel) => pathExists(path.join(cwd, rel))),
    );

    if (managedExists.every(Boolean)) {
      retainedTargetIds.push(targetId);
    }
  }

  return retainedTargetIds;
}

function printNextSteps(targets) {
  blank();
  section(
    "Next steps",
    targets.some((target) => target.rootAgentFile)
      ? [
          "1. Read AGENTS.md to understand the system",
          "2. Run /quickstart in your AI assistant to analyze and start the workflow",
        ]
      : [
          "1. Review files written under the selected target directories",
          "2. Run /quickstart in your AI assistant to analyze and start the workflow",
        ],
  );
}

function printTargetSummary(successfulTargets, failedTargets) {
  blank();
  section("Target summary", [
    ...successfulTargets.map(
      (target) => `✔ ${target.targetLabel} (${target.targetId})`,
    ),
    ...failedTargets.map(
      (target) =>
        `✖ ${target.targetLabel} (${target.targetId}) — ${target.reason}`,
    ),
  ]);
}

module.exports = init;
