'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { MANAGED_FILES, USER_PROTECTED_FILES } = require('./manifest');
const { resolveAgentsInstall, printLegacyMigrationWarning, pathExists } = require('./agents');
const { success, warn, error, info, fileLine, skippedLine, blank, logo } = require('./output');

/**
 * anws update — 将当前项目的托管文件更新到最新版本
 */
async function update() {
  const cwd = process.cwd();
  const agentDir = path.join(cwd, '.agents');

  // 检查 .agents/ 是否存在
  const agentExists = await pathExists(agentDir);
  if (!agentExists) {
    logo();
    error('No .agents/ found in current directory.');
    info('Run `anws init` first to set up the workflow system.');
    process.exit(1);
  }

  // 询问确认
  const confirmed = await askUpdate();
  if (!confirmed) {
    blank();
    info('Aborted. No files were changed.');
    process.exit(0);
  }

  logo();
  // 仅覆盖托管文件；USER_PROTECTED_FILES 永远跳过
  const srcRoot = path.join(__dirname, '..', 'templates', '.agents');
  const srcAgents = path.join(__dirname, '..', 'templates', 'AGENTS.md');
  const agentsDecision = await resolveAgentsInstall({
    cwd,
    askMigrate,
    forceYes: !!global.__ANWS_FORCE_YES
  });

  if (!agentsDecision.shouldWriteRootAgents && agentsDecision.legacyExists) {
    info('Keeping legacy .agent/rules/agents.md. Will not pull root AGENTS.md.');
  }
  if (agentsDecision.shouldWarnMigration) {
    printLegacyMigrationWarning();
  }

  const updated = [];
  const skipped = [];

  for (const rel of MANAGED_FILES) {
    if (rel === 'AGENTS.md' && !agentsDecision.shouldWriteRootAgents) {
      skipped.push(rel);
      continue;
    }

    if (USER_PROTECTED_FILES.includes(rel)) {
      if (!(rel === 'AGENTS.md' && agentsDecision.shouldWriteRootAgents && !agentsDecision.rootExists)) {
        skipped.push(rel);
        continue;
      }
    }

    const srcPath = rel === 'AGENTS.md' ? srcAgents : path.join(path.dirname(srcRoot), rel);
    const destPath = path.join(cwd, rel);

    const srcExists = await pathExists(srcPath);
    if (!srcExists) continue;

    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(srcPath, destPath);
    updated.push(rel);
  }

  // 打印摘要
  blank();
  info('Updated files:');
  blank();
  for (const rel of updated) {
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
  success(`Done! ${updated.length} file(s) updated${skipped.length > 0 ? `, ${skipped.length} skipped` : ''}.`);
  info('Managed files have been updated to the latest version.');
  info('Your custom files in .agents/ were not touched.');
}

/**
 * 交互式确认更新操作（默认 N）。
 */
async function askUpdate() {
  if (global.__ANWS_FORCE_YES) return true;

  if (!process.stdin.isTTY) {
    warn('Non-TTY environment detected. Skipping update to avoid accidental overwrites.');
    return false;
  }

  const readline = require('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(
      '\n\u26a0 This will overwrite all managed .agents/ files. Continue? [y/N] ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });
}

/**
 * 询问用户是否同意迁移 agents.md
 */
async function askMigrate() {
  if (global.__ANWS_FORCE_YES) return true;

  if (!process.stdin.isTTY) {
    return false;
  }

  const readline = require('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(
      '\n\u26a0 Legacy .agents/ directory detected. Do you want to migrate to .agents/? [y/N] ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });
}

module.exports = update;
