'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { findByType } = require('../manifest');

const TEMPLATE_ROOT = path.join(__dirname, '..', '..', 'templates');
const TEMPLATE_ROOT_EN = path.join(__dirname, '..', '..', 'templates_en');
const AGENTS_ROOT = path.join(TEMPLATE_ROOT, '.agents');
const ROOT_AGENTS_FILE = path.join(TEMPLATE_ROOT, 'AGENTS.md');
const ROOT_AGENTS_FILE_EN = path.join(TEMPLATE_ROOT_EN, 'AGENTS.md');

const VALID_TEMPLATE_LOCALES = new Set(['zh', 'en']);

function listCanonicalResources() {
  return [
    ...findByType('workflow').map((item) => ({ ...item })),
    ...findByType('skill').map((item) => ({ ...item }))
  ];
}

/**
 * @param {string} relPath  path relative to templates/ (manifest `source`)
 * @param {'zh'|'en'} [templateLocale='zh']  en uses templates_en/ when the file exists, else falls back to templates/
 */
function resolveCanonicalPath(relPath, templateLocale = 'zh') {
  const zhPath = path.join(TEMPLATE_ROOT, relPath);
  if (templateLocale !== 'en') {
    return zhPath;
  }
  const enPath = path.join(TEMPLATE_ROOT_EN, relPath);
  return fs.existsSync(enPath) ? enPath : zhPath;
}

/** @deprecated Prefer `resolveCanonicalPath(relPath, 'zh')` — kept for call sites that assume Chinese tree only */
function resolveCanonicalSource(relPath) {
  return resolveCanonicalPath(relPath, 'zh');
}

/**
 * @param {'zh'|'en'} [templateLocale='zh']
 */
function resolveRootAgentsPath(templateLocale = 'zh') {
  if (templateLocale !== 'en') {
    return ROOT_AGENTS_FILE;
  }
  return fs.existsSync(ROOT_AGENTS_FILE_EN) ? ROOT_AGENTS_FILE_EN : ROOT_AGENTS_FILE;
}

module.exports = {
  TEMPLATE_ROOT,
  TEMPLATE_ROOT_EN,
  AGENTS_ROOT,
  ROOT_AGENTS_FILE,
  ROOT_AGENTS_FILE_EN,
  VALID_TEMPLATE_LOCALES,
  listCanonicalResources,
  resolveCanonicalPath,
  resolveCanonicalSource,
  resolveRootAgentsPath
};
