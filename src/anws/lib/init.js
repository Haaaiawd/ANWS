'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { copyDir } = require('./copy');
const { MANAGED_FILES, USER_PROTECTED_FILES } = require('./manifest');
const { resolveAgentsInstall, printLegacyMigrationWarning, pathExists } = require('./agents');
const { success, warn, info, fileLine, skippedLine, blank, logo } = require('./output');

/**
 * anws init — 将工作流系统写入当前项目
 */
async function init() {
  const cwd = process.cwd();
  const srcRoot = path.join(__dirname, '..', 'templates', '.agents');
  const destRoot = path.join(cwd, '.agents');
  const srcAgents = path.join(__dirname, '..', 'templates', 'AGENTS.md');

  const agentsDecision = await resolveAgentsInstall({
    cwd,
    askMigrate,
    forceYes: !!global.__ANWS_FORCE_YES
  });

  // ── 冲突检测（T1.2.3 在此处插入冲突分支）──────────────────────────────────
  const conflicting = await findConflicts(cwd);
  if (conflicting.length > 0) {
    const confirmed = await askOverwrite(conflicting.length);
    if (!confirmed) {
      blank();
      info('Aborted. No files were changed.');
      process.exit(0);
    }
    // 仅覆盖托管文件（用户自有文件不受影响）
    const { written: updated, skipped } = await overwriteManaged(srcRoot, cwd, {
      srcAgents,
      shouldWriteRootAgents: agentsDecision.shouldWriteRootAgents
    });
    if (agentsDecision.shouldWarnMigration) {
      printLegacyMigrationWarning();
    }
    printSummary(updated, skipped, 'updated');
    return;
  }
  // ── 无冲突:直接复制 ─────────────────────────────────────────────────────────

  logo();
  info('Initializing Anws...');
  blank();

  const writtenFiles = await copyDir(srcRoot, destRoot);
  const written = Array.isArray(writtenFiles) ? writtenFiles : [];

  if (agentsDecision.shouldWriteRootAgents) {
    const destAgents = path.join(cwd, 'AGENTS.md');
    try {
      await fs.copyFile(srcAgents, destAgents);
      written.push(destAgents);
    } catch (e) {
      // 忽略
    }
  }

  if (agentsDecision.shouldWarnMigration) {
    printLegacyMigrationWarning();
  }

  // 打印文件列表
  for (const absPath of written) {
    const rel = path.relative(cwd, absPath).replace(/\\/g, '/');
    fileLine(rel);
  }

  blank();
  success(`Done! ${written.length} files written to .agents/`);
  printNextSteps();
}

// ─── 辅助函数 ──────────────────────────────────────────────────────────────────

/**
 * 找出 cwd 中已存在的托管文件列表。
 * @returns {Promise<string[]>} 已存在的托管文件相对路径数组
 */
async function findConflicts(cwd) {
  const conflicts = [];
  for (const rel of MANAGED_FILES) {
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
async function askOverwrite(count) {
  if (global.__ANWS_FORCE_YES) return true;

  // 非 TTY 环境：默认不覆盖，防止 CI 挂起
  if (!process.stdin.isTTY) {
    warn(`${count} managed file(s) already exist. Non-TTY: skipping overwrite.`);
    return false;
  }

  const readline = require('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(
      `\n\u26a0  ${count} managed file(s) already exist. Overwrite? [y/N] `,
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });
}

async function askMigrate() {
  if (global.__ANWS_FORCE_YES) return true;

  if (!process.stdin.isTTY) {
    return false;
  }

  const readline = require('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(
      '\n\u26a0 Legacy .agent/ directory detected. Do you want to migrate to .agents/? [y/N] ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });
}

/**
 * 仅覆盖 MANAGED_FILES 清单内的文件，用户自有文件不受影响。
 * USER_PROTECTED_FILES 中的文件即便冲突也跳过，保留用户修改。
 * @returns {{ written: string[], skipped: string[] }}
 */
async function overwriteManaged(srcRoot, cwd, options = {}) {
  const srcBase = path.dirname(srcRoot); // templates/
  const written = [];
  const skipped = [];
  const shouldWriteRootAgents = options.shouldWriteRootAgents !== false;
  const srcAgents = options.srcAgents || path.join(srcBase, 'AGENTS.md');

  for (const rel of MANAGED_FILES) {
    if (rel === 'AGENTS.md' && !shouldWriteRootAgents) {
      skipped.push(rel);
      continue;
    }

    // 受保护文件：文件已存在时跳过，交给用户自行维护
    if (USER_PROTECTED_FILES.includes(rel)) {
      const destPath = path.join(cwd, rel);
      const exists = await pathExists(destPath);
      if (exists) {
        skipped.push(rel);
        continue;
      }
    }

    const srcPath = rel === 'AGENTS.md' ? srcAgents : path.join(srcBase, rel);
    const destPath = path.join(cwd, rel);

    await fs.mkdir(path.dirname(destPath), { recursive: true });
    const srcExists = await pathExists(srcPath);
    if (srcExists) {
      await fs.copyFile(srcPath, destPath);
      written.push(rel);
    }
  }

  return { written, skipped };
}

/**
 * 打印操作摘要（更新场景）。
 * @param {string[]} files  已写入的文件
 * @param {string[]} skipped 受保护跳过的文件
 * @param {string}  action
 */
function printSummary(files, skipped = [], action) {
  const verb = action === 'updated' ? 'Updating' : 'Writing';
  blank();
  info(`${verb} files...`);
  blank();
  for (const rel of files) {
    fileLine(rel.replace(/\\/g, '/'));
  }
  if (skipped.length > 0) {
    blank();
    info('Skipped (project-specific, preserved):');
    for (const rel of skipped) {
      skippedLine(rel.replace(/\\/g, '/'));
    }
  }
  blank();
  success(`Done! ${files.length} file(s) ${action}${skipped.length > 0 ? `, ${skipped.length} skipped` : ''}.`);
  if (action === 'updated') {
    info('Managed files have been updated to the latest version.');
  }
}

function printNextSteps() {
  blank();
  info('Next steps:');
  info('  1. Read AGENTS.md to understand the system');
  info('  2. Run /quickstart in your AI assistant to analyze and start the workflow');
}

module.exports = init;
