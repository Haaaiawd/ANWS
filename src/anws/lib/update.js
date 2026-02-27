'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { MANAGED_FILES, USER_PROTECTED_FILES } = require('./manifest');
const { success, warn, error, info, fileLine, skippedLine, blank, logo } = require('./output');

/**
 * anws update — 将当前项目的托管文件更新到最新版本
 */
async function update() {
  const cwd = process.cwd();
  const agentDir = path.join(cwd, '.agent');

  // 检查 .agent/ 是否存在
  const agentExists = await fs.access(agentDir).then(() => true).catch(() => false);
  if (!agentExists) {
    logo();
    error('No .agent/ found in current directory.');
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
  const srcRoot = path.join(__dirname, '..', 'templates', '.agent');
  const updated = [];
  const skipped = [];

  for (const rel of MANAGED_FILES) {
    if (USER_PROTECTED_FILES.includes(rel)) {
      skipped.push(rel);
      continue;
    }

    const srcPath = path.join(path.dirname(srcRoot), rel);
    const destPath = path.join(cwd, rel);

    const srcExists = await fs.access(srcPath).then(() => true).catch(() => false);
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

  // 检查 agents.md 模板是否有变更，提供 .new 文件供用户合并
  const agentsMerged = await checkAgentsTemplate(cwd, srcRoot);

  blank();
  success(`Done! ${updated.length} file(s) updated${skipped.length > 0 ? `, ${skipped.length} skipped` : ''}.`);
  info('Managed files have been updated to the latest version.');
  info('Your custom files in .agent/ were not touched.');

  if (agentsMerged) {
    blank();
    warn('agents.md template has changed!');
    info('A new template has been saved to:');
    info('  .agent/rules/agents.md.new');
    blank();
    info('Please review and merge the changes into your agents.md.');
    info('After merging, delete agents.md.new.');
  }
}

/**
 * 交互式确认更新操作（默认 N）。
 */
async function askUpdate() {
  if (!process.stdin.isTTY) {
    warn('Non-TTY environment detected. Skipping update to avoid accidental overwrites.');
    return false;
  }

  const readline = require('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(
      '\n\u26a0 This will overwrite all managed .agent/ files. Continue? [y/N] ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });
}

/**
 * 检查 agents.md 模板是否相比上次安装/更新有变化。
 * 用 hash 文件记录上次模板指纹，与新模板比较。
 * 如果有变化 → 写入 agents.md.new + 更新 hash。
 *
 * @param {string} cwd       项目根目录
 * @param {string} srcRoot   模板 .agent/ 目录
 * @returns {Promise<boolean>} 是否产生了 .new 文件
 */
async function checkAgentsTemplate(cwd, srcRoot) {
  const templatePath = path.join(path.dirname(srcRoot), '.agent', 'rules', 'agents.md');
  const hashPath = path.join(cwd, '.agent', 'rules', '.agents-template-hash');
  const newPath = path.join(cwd, '.agent', 'rules', 'agents.md.new');

  const templateExists = await fs.access(templatePath).then(() => true).catch(() => false);
  if (!templateExists) return false;

  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const newHash = crypto.createHash('md5').update(templateContent).digest('hex');

  // 读取上次存储的 hash
  let oldHash = null;
  try {
    oldHash = (await fs.readFile(hashPath, 'utf-8')).trim();
  } catch {
    // hash 文件不存在（首次 update 或旧版本安装）
  }

  if (oldHash === newHash) {
    return false; // 模板没变化
  }

  // 模板有变化 → 写入 .new 供用户合并
  await fs.writeFile(newPath, templateContent, 'utf-8');
  // 更新 hash 记录
  await fs.writeFile(hashPath, newHash, 'utf-8');

  return true;
}

module.exports = update;
