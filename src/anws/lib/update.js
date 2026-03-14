'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { MANAGED_FILES, USER_PROTECTED_FILES } = require('./manifest');
const { planAgentsUpdate, resolveAgentsInstall, printLegacyMigrationWarning, pathExists } = require('./agents');
const { collectManagedFileDiffs, printPreview } = require('./diff');
const { detectUpgrade, generateChangelog } = require('./changelog');
const { success, warn, error, info, fileLine, skippedLine, blank, logo } = require('./output');

async function update(options = {}) {
  const cwd = process.cwd();
  const check = !!options.check;
  const agentDir = path.join(cwd, '.agents');
  const legacyAgentDir = path.join(cwd, '.agent');
  const { version } = require(path.join(__dirname, '..', 'package.json'));

  const agentExists = await pathExists(agentDir);
  const legacyAgentExists = await pathExists(legacyAgentDir);
  const isLegacyMigration = !agentExists && legacyAgentExists;

  if (!agentExists && !legacyAgentExists) {
    logo();
    error('No .agents/ found in current directory.');
    info('Run `anws init` first to set up the workflow system.');
    process.exit(1);
  }

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
  if (isLegacyMigration) {
    logo();
    blank();
    info('Legacy .agent/ directory detected.');
    info('anws update will migrate managed files into the new .agents/ structure.');
    info('Your old .agent/ directory will be preserved for manual review.');
    blank();
  }

  let agentsUpdatePlan = null;
  if (agentsDecision.shouldWriteRootAgents && agentsDecision.rootExists) {
    const templateContent = await fs.readFile(srcAgents, 'utf8');
    const existingContent = await fs.readFile(path.join(cwd, 'AGENTS.md'), 'utf8');
    agentsUpdatePlan = planAgentsUpdate({ templateContent, existingContent });

    if (agentsUpdatePlan.warning) {
      warn(agentsUpdatePlan.warning);
    }
  }

  const versionState = await detectUpgrade({ cwd, version });
  const rawChanges = await collectManagedFileDiffs({
    cwd,
    managedFiles: MANAGED_FILES,
    srcAgents,
    shouldWriteRootAgents: agentsDecision.shouldWriteRootAgents,
    agentsUpdatePlan
  });
  const changes = rawChanges.filter((item) => {
    if (item.file !== 'AGENTS.md') return true;
    if (agentsUpdatePlan && agentsUpdatePlan.mode === 'skip') return false;
    return agentsDecision.shouldWriteRootAgents;
  });

  if (check) {
    if (!versionState.needUpgrade) {
      if (!isLegacyMigration) {
        logo();
        blank();
      }
      info(`Already up to date. Latest recorded version is v${versionState.latestVersion || version}.`);
      return;
    }
    if (!isLegacyMigration) {
      logo();
      blank();
    }
    printPreview({
      fromVersion: versionState.fromVersion,
      toVersion: versionState.toVersion,
      changes
    });
    return;
  }

  if (!versionState.needUpgrade) {
    if (!isLegacyMigration) {
      logo();
      blank();
    }
    info(`Already up to date. Latest recorded version is v${versionState.latestVersion || version}.`);
    return;
  }

  const confirmed = await askUpdate();
  if (!confirmed) {
    blank();
    info('Aborted. No files were changed.');
    return;
  }

  if (!isLegacyMigration) {
    logo();
  }
  const updated = [];
  const skipped = [];

  for (const rel of MANAGED_FILES) {
    if (rel === 'AGENTS.md' && !agentsDecision.shouldWriteRootAgents) {
      skipped.push(rel);
      continue;
    }

    if (rel === 'AGENTS.md' && agentsUpdatePlan && agentsUpdatePlan.mode === 'skip') {
      skipped.push(rel);
      continue;
    }

    if (USER_PROTECTED_FILES.includes(rel) && rel !== 'AGENTS.md') {
      if (!(rel === 'AGENTS.md' && agentsDecision.shouldWriteRootAgents)) {
        skipped.push(rel);
        continue;
      }
    }

    const srcPath = rel === 'AGENTS.md' ? srcAgents : path.join(path.dirname(srcRoot), rel);
    const destPath = path.join(cwd, rel);
    const srcExists = await pathExists(srcPath);
    if (!srcExists) continue;

    await fs.mkdir(path.dirname(destPath), { recursive: true });

    if (rel === 'AGENTS.md') {
      const templateContent = await fs.readFile(srcPath, 'utf8');
      const nextContent = agentsUpdatePlan ? agentsUpdatePlan.content : templateContent;
      await fs.writeFile(destPath, nextContent, 'utf8');
    } else {
      await fs.copyFile(srcPath, destPath);
    }

    updated.push(rel);
  }

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

  const changelogPath = await generateChangelog({ cwd, version, changes });

  blank();
  success(`Done! ${updated.length} file(s) updated${skipped.length > 0 ? `, ${skipped.length} skipped` : ''}.`);
  info('Managed files have been updated to the latest version.');
  info('Your custom files in .agents/ were not touched.');
  if (isLegacyMigration) {
    info('Legacy .agent/ was preserved. You can review and delete it manually after migration.');
    const deleted = await maybeDeleteLegacyDir(legacyAgentDir);
    if (deleted) {
      info('Legacy .agent/ directory was deleted after confirmation.');
    }
  }
  info(`Generated upgrade record: ${path.relative(cwd, changelogPath).replace(/\\/g, '/')}`);
  info('Run `/upgrade` in your AI IDE to update your architecture docs.');
}

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
      '\n⚠ This will overwrite all managed .agents/ files. Continue? [y/N] ',
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
      '\n⚠ Legacy .agent/ directory detected. Do you want to migrate to .agents/? [y/N] ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });
}

async function maybeDeleteLegacyDir(legacyAgentDir) {
  const exists = await pathExists(legacyAgentDir);
  if (!exists) return false;

  if (global.__ANWS_FORCE_YES) {
    return false;
  }

  if (!process.stdin.isTTY) {
    return false;
  }

  const readline = require('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const shouldDelete = await new Promise((resolve) => {
    rl.question(
      '\n⚠ Legacy .agent/ directory has been preserved. Delete it now? [y/N] ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      }
    );
  });

  if (!shouldDelete) return false;

  await fs.rm(legacyAgentDir, { recursive: true, force: true });
  return true;
}

module.exports = update;
