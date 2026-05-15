'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');

async function withTempDir(run) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'anws-init-'));
  try {
    await run(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

function runCliInDir(cwd, args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

test('anws init --target windsurf writes windsurf projection and AGENTS.md', async () => {
  await withTempDir(async (tempDir) => {
    const result = runCliInDir(tempDir, ['init', '--target', 'windsurf']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(await exists(path.join(tempDir, '.windsurf', 'workflows', 'genesis.md')), true);
    assert.equal(await exists(path.join(tempDir, '.windsurf', 'skills', 'spec-writer', 'SKILL.md')), true);
    assert.equal(await exists(path.join(tempDir, 'AGENTS.md')), true);
    assert.equal(await exists(path.join(tempDir, '.agents')), false);
    const lock = JSON.parse(await fs.readFile(path.join(tempDir, '.anws', 'install-lock.json'), 'utf8'));
    assert.equal(lock.templateLocale, 'zh');
  });
});

test('anws init --locale en copies English workflow templates', async () => {
  await withTempDir(async (tempDir) => {
    const result = runCliInDir(tempDir, ['init', '--target', 'windsurf', '--locale', 'en']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const genesis = await fs.readFile(path.join(tempDir, '.windsurf', 'workflows', 'genesis.md'), 'utf8');
    assert.match(genesis, /You are \*\*Genesis/);
    const lock = JSON.parse(await fs.readFile(path.join(tempDir, '.anws', 'install-lock.json'), 'utf8'));
    assert.equal(lock.templateLocale, 'en');
  });
});

test('anws init --target antigravity writes .agents and AGENTS.md', async () => {
  await withTempDir(async (tempDir) => {
    const result = runCliInDir(tempDir, ['init', '--target', 'antigravity']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(await exists(path.join(tempDir, '.agents', 'workflows', 'genesis.md')), true);
    assert.equal(await exists(path.join(tempDir, '.agents', 'skills', 'spec-writer', 'SKILL.md')), true);
    assert.equal(await exists(path.join(tempDir, 'AGENTS.md')), true);
  });
});

test('anws init --target windsurf,codex writes multiple target projections and install-lock', async () => {
  await withTempDir(async (tempDir) => {
    const result = runCliInDir(tempDir, ['init', '--target', 'windsurf,codex']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(await exists(path.join(tempDir, 'AGENTS.md')), true);
    assert.equal(await exists(path.join(tempDir, '.windsurf', 'workflows', 'genesis.md')), true);
    assert.equal(await exists(path.join(tempDir, '.codex', 'skills', 'anws-system', 'SKILL.md')), true);
    assert.equal(await exists(path.join(tempDir, '.codex', 'skills', 'anws-system', 'references', 'genesis.md')), true);
    assert.equal(await exists(path.join(tempDir, '.codex', 'skills', 'spec-writer', 'SKILL.md')), true);
    assert.equal(await exists(path.join(tempDir, '.anws', 'install-lock.json')), true);
  });
});

test('anws init --target opencode writes command and skill projections', async () => {
  await withTempDir(async (tempDir) => {
    const result = runCliInDir(tempDir, ['init', '--target', 'opencode']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(await exists(path.join(tempDir, 'AGENTS.md')), true);
    assert.equal(await exists(path.join(tempDir, '.opencode', 'commands', 'genesis.md')), true);
    assert.equal(await exists(path.join(tempDir, '.opencode', 'skills', 'spec-writer', 'SKILL.md')), true);
    assert.equal(await exists(path.join(tempDir, '.anws', 'install-lock.json')), true);
  });
});

test('anws init dedupes already selected targets in install-lock', async () => {
  await withTempDir(async (tempDir) => {
    const result = runCliInDir(tempDir, ['init', '--target', 'windsurf,windsurf']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const lock = JSON.parse(await fs.readFile(path.join(tempDir, '.anws', 'install-lock.json'), 'utf8'));
    assert.equal(lock.targets.length, 1);
    assert.equal(lock.targets[0].targetId, 'windsurf');
  });
});

test('anws init preserves existing installed targets when adding a new target via --target', async () => {
  await withTempDir(async (tempDir) => {
    const firstInit = runCliInDir(tempDir, ['init', '--target', 'windsurf']);
    assert.equal(firstInit.status, 0, firstInit.stderr || firstInit.stdout);

    const secondInit = runCliInDir(tempDir, ['init', '--target', 'opencode']);
    assert.equal(secondInit.status, 0, secondInit.stderr || secondInit.stdout);

    assert.equal(await exists(path.join(tempDir, '.windsurf', 'workflows', 'genesis.md')), true);
    assert.equal(await exists(path.join(tempDir, '.opencode', 'commands', 'genesis.md')), true);

    const lock = JSON.parse(await fs.readFile(path.join(tempDir, '.anws', 'install-lock.json'), 'utf8'));
    assert.deepEqual(lock.targets.map((item) => item.targetId), ['opencode', 'windsurf']);
    assert.deepEqual(lock.lastUpdateSummary.successfulTargets, ['opencode']);
  });
});

test('anws init preserves scanned targets when install-lock is missing and a new target is added', async () => {
  await withTempDir(async (tempDir) => {
    const firstInit = runCliInDir(tempDir, ['init', '--target', 'windsurf']);
    assert.equal(firstInit.status, 0, firstInit.stderr || firstInit.stdout);

    await fs.rm(path.join(tempDir, '.anws', 'install-lock.json'), { force: true });

    const secondInit = runCliInDir(tempDir, ['init', '--target', 'opencode']);
    assert.equal(secondInit.status, 0, secondInit.stderr || secondInit.stdout);
    assert.match(secondInit.stdout, /Install lock missing or unreadable\. Falling back to scanned target state\./);

    const lock = JSON.parse(await fs.readFile(path.join(tempDir, '.anws', 'install-lock.json'), 'utf8'));
    assert.deepEqual(lock.targets.map((item) => item.targetId), ['opencode', 'windsurf']);
  });
});

test('anws init with skipped overwrite retains templateLocale when lock targets remain', async () => {
  await withTempDir(async (tempDir) => {
    const first = runCliInDir(tempDir, ['init', '--target', 'windsurf', '--locale', 'en']);
    assert.equal(first.status, 0, first.stderr || first.stdout);

    await fs.writeFile(path.join(tempDir, '.windsurf', 'workflows', 'genesis.md'), 'user conflict', 'utf8');

    const second = runCliInDir(tempDir, ['init', '--target', 'windsurf']);
    assert.equal(second.status, 0, second.stderr || second.stdout);

    const lock = JSON.parse(await fs.readFile(path.join(tempDir, '.anws', 'install-lock.json'), 'utf8'));
    assert.equal(lock.templateLocale, 'en');
    assert.deepEqual(lock.targets.map((item) => item.targetId), ['windsurf']);
  });
});

test('anws init reports partial success and only writes successful targets into install-lock', async () => {
  await withTempDir(async (tempDir) => {
    await fs.mkdir(path.join(tempDir, '.windsurf', 'workflows'), { recursive: true });
    await fs.writeFile(path.join(tempDir, '.windsurf', 'workflows', 'genesis.md'), 'user-owned conflict', 'utf8');

    const result = runCliInDir(tempDir, ['init', '--target', 'windsurf,codex']);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /Target summary/);
    assert.match(result.stdout, /Windsurf \(windsurf\)/);
    assert.match(result.stdout, /Codex \(Preview\) \(codex\)/);

    const lock = JSON.parse(await fs.readFile(path.join(tempDir, '.anws', 'install-lock.json'), 'utf8'));
    assert.deepEqual(lock.targets.map((item) => item.targetId), ['codex']);
    assert.deepEqual(lock.lastUpdateSummary.failedTargets, ['windsurf']);
    assert.equal(await exists(path.join(tempDir, 'AGENTS.md')), true);
    assert.equal(await exists(path.join(tempDir, '.codex', 'skills', 'anws-system', 'SKILL.md')), true);
  });
});

test('anws init preserves existing AGENTS auto block when overwriting managed files', async () => {
  await withTempDir(async (tempDir) => {
    const existingAgents = [
      '# AGENTS.md - AI 协作协议',
      '',
      '<!-- AUTO:BEGIN — 项目状态保留区（升级时唯一保留的部分，请勿手动修改区块边界） -->',
      '## 📍 当前状态 (由 Workflow 自动更新)',
      '',
      '- **最新架构版本**: `.anws/v999`',
      '- **活动任务清单**: `custom/tasks.md`',
      '<!-- AUTO:END -->',
      '',
      '## 自定义补充',
      '',
      '保留我的自定义内容。'
    ].join('\n');

    await fs.writeFile(path.join(tempDir, 'AGENTS.md'), `${existingAgents}\n`, 'utf8');

    const result = runCliInDir(tempDir, ['init', '--target', 'windsurf', '--yes']);

    assert.equal(result.status, 0, result.stderr || result.stdout);

    const finalAgents = await fs.readFile(path.join(tempDir, 'AGENTS.md'), 'utf8');
    assert.match(finalAgents, /\*\*最新架构版本\*\*: `\.anws\/v999`/);
    assert.match(finalAgents, /\*\*活动任务清单\*\*: `custom\/tasks\.md`/);
    assert.match(finalAgents, /<!-- AUTO:BEGIN/);
    assert.match(finalAgents, /<!-- AUTO:END -->/);
  });
});

