'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { warn, blank } = require('./output');

async function pathExists(targetPath) {
  return fs.access(targetPath).then(() => true).catch(() => false);
}

async function getAgentsState(cwd) {
  const legacyPath = path.join(cwd, '.agent', 'rules', 'agents.md');
  const rootPath = path.join(cwd, 'AGENTS.md');

  return {
    legacyPath,
    rootPath,
    legacyExists: await pathExists(legacyPath),
    rootExists: await pathExists(rootPath)
  };
}

async function resolveAgentsInstall({ cwd, askMigrate, forceYes = false }) {
  const state = await getAgentsState(cwd);

  if (!state.legacyExists) {
    return { ...state, shouldWriteRootAgents: true, shouldWarnMigration: false };
  }

  const migrate = forceYes ? true : await askMigrate();
  return {
    ...state,
    shouldWriteRootAgents: migrate ? !state.rootExists : false,
    shouldWarnMigration: migrate
  };
}

function printLegacyMigrationWarning() {
  blank();
  warn('Please manually copy your custom rules from .agent/rules/agents.md to the root AGENTS.md');
  warn('After copying, you can safely delete the old .agent/rules/agents.md file.');
  blank();
}

module.exports = {
  getAgentsState,
  resolveAgentsInstall,
  printLegacyMigrationWarning,
  pathExists
};
