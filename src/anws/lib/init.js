'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { copyDir } = require('./copy');
const { MANAGED_FILES } = require('./manifest');

/**
 * anws init — 将工作流系统写入当前项目
 */
async function init() {
  const cwd = process.cwd();
  const srcRoot = path.join(__dirname, '..', 'templates', '.agent');
  const destRoot = path.join(cwd, '.agent');

  // ── 冲突检测（T1.2.3 在此处插入冲突分支）──────────────────────────────────
  const conflicting = await findConflicts(cwd);
  if (conflicting.length > 0) {
    const confirmed = await askOverwrite(conflicting.length);
    if (!confirmed) {
      console.log('\nAborted. No files were changed.');
      process.exit(0);
    }
    // 仅覆盖托管文件（用户自有文件不受影响）
    await overwriteManaged(srcRoot, cwd);
    printSummary(conflicting, cwd, 'updated');
    return;
  }
  // ── 无冲突:直接复制 ─────────────────────────────────────────────────────────

  console.log('\nInitializing Antigravity Workflow System...\n');

  const written = await copyDir(srcRoot, destRoot);

  // 打印文件列表
  for (const absPath of written) {
    const rel = path.relative(cwd, absPath).replace(/\\/g, '/');
    console.log(`  ${rel}`);
  }

  console.log(`\n\u2714 Done! ${written.length} files written to .agent/`);
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
    const exists = await fs.access(abs).then(() => true).catch(() => false);
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
  // 非 TTY 环境：默认不覆盖，防止 CI 挂起
  if (!process.stdin.isTTY) return false;

  const readline = require('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(
      `\n\u26a0 ${count} managed file(s) already exist. Overwrite? [y/N] `,
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });
}

/**
 * 仅覆盖 MANAGED_FILES 清单内的文件，用户自有文件不受影响。
 */
async function overwriteManaged(srcRoot, cwd) {
  // srcRoot 是 templates/.agent/
  const srcBase = path.dirname(srcRoot); // templates/
  for (const rel of MANAGED_FILES) {
    // rel 格式: '.agent/skills/...'
    const srcPath = path.join(srcBase, rel);
    const destPath = path.join(cwd, rel);

    // 确保目标目录存在
    await fs.mkdir(path.dirname(destPath), { recursive: true });

    // 只复制 templates 中存在的文件（安全检查）
    const srcExists = await fs.access(srcPath).then(() => true).catch(() => false);
    if (srcExists) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * 打印操作摘要（更新场景）。
 */
function printSummary(files, cwd, action) {
  console.log(`\n${action === 'updated' ? 'Updating' : 'Writing'} files...\n`);
  for (const rel of files) {
    console.log(`  ${rel.replace(/\\/g, '/')}`);
  }
  console.log(`\n\u2714 Done! ${files.length} file(s) ${action}.`);
  if (action === 'updated') {
    console.log('\n  Managed files have been updated to the latest version.');
  }
}

function printNextSteps() {
  console.log('\n  Next steps:');
  console.log('    1. Read .agent/rules/agents.md to understand the system');
  console.log('    2. Run /genesis in your AI assistant to start a new project');
}

module.exports = init;
