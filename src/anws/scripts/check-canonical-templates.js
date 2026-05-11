#!/usr/bin/env node
'use strict';

/**
 * Contract check: every RESOURCE_REGISTRY source + AGENTS.md exists under
 * TEMPLATE_ROOT; optional content guard for known-broken legacy path strings.
 */

const fs = require('node:fs');
const path = require('node:path');
const { RESOURCE_REGISTRY } = require('../lib/manifest');
const { TEMPLATE_ROOT } = require('../lib/resources');

const FORBIDDEN_SUBSTRINGS = ['05-language-customization'];

function collectRegistrySources() {
  const set = new Set(RESOURCE_REGISTRY.map((r) => r.source));
  set.add('AGENTS.md');
  return set;
}

function assertFilesExist(sources, errors) {
  for (const rel of sources) {
    const abs = path.join(TEMPLATE_ROOT, rel);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing canonical template: ${rel} (expected ${abs})`);
      continue;
    }
    const st = fs.statSync(abs);
    if (!st.isFile()) {
      errors.push(`Canonical path is not a regular file: ${rel}`);
    }
  }
}

function scanTemplatesForForbiddenStrings(errors) {
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
        continue;
      }
      if (!ent.isFile()) continue;
      let text;
      try {
        text = fs.readFileSync(full, 'utf8');
      } catch {
        errors.push(`Unreadable file under templates: ${path.relative(TEMPLATE_ROOT, full)}`);
        continue;
      }
      for (const bad of FORBIDDEN_SUBSTRINGS) {
        if (text.includes(bad)) {
          errors.push(
            `Forbidden substring ${JSON.stringify(bad)} in ${path.relative(TEMPLATE_ROOT, full)}`
          );
        }
      }
    }
  }
  walk(TEMPLATE_ROOT);
}

function main() {
  const errors = [];
  const sources = collectRegistrySources();

  assertFilesExist(sources, errors);
  scanTemplatesForForbiddenStrings(errors);

  if (errors.length) {
    console.error('check-canonical-templates failed:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log(
    `check-canonical-templates: OK (${sources.size} paths under templates/, forbidden-pattern scan)`
  );
}

main();
