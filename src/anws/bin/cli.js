#!/usr/bin/env node
"use strict";

const { parseArgs } = require("node:util");
const path = require("node:path");
const { listTargets, getTarget } = require("../lib/adapters");
const { blank, error, info, logo } = require("../lib/output");

// ─── 版本号从 package.json 读取 ─────────────────────────────────────────────
const { version } = require(path.join(__dirname, "..", "package.json"));
const TARGET_IDS = listTargets().map((target) => target.id);

// ─── 帮助文本 ─────────────────────────────────────────────────────────────────
const HELP = `
USAGE
  anws <command> [options]

COMMANDS
  init      Install one or more target AI IDE workflow projections
            Init skips a target if its installedVersion equals the current CLI version
            (since v2.4.1). Run update to refresh templates instead.
  update    One-click update: scan install-lock or directory layout and refresh templates
            Preserves the templateLocale recorded in install-lock. Generates a changelog.

OPTIONS
  -v, --version   Print version number
  -h, --help      Show this help message
  -y, --yes       Auto-confirm overwrite prompts (non-interactive)
  --target        Target AI IDE(s) for init, comma-separated (${TARGET_IDS.join(", ")})
  --locale        Template bundle: zh (templates/) or en (templates_en/)
                  Default: zh; interactive init prompts after IDE selection
                  Update preserves the locale recorded in install-lock

INIT VS UPDATE
  Use init   for first-time install or adding a new target IDE.
  Use update when the CLI package has been upgraded and you want to refresh
               templates without changing target selection or locale.

SUPPORTED TARGETS
  windsurf     workflows + skills
  antigravity  workflows + skills
  cursor       commands + skills
  claude       commands + skills
  copilot      prompts + skills
  codex        preview, skills-only bundle via anws-system
  opencode     commands + skills
  trae         skills-only bundle via anws-system
  qoder        commands + skills
  kilo         workflows + skills

EXAMPLES
  anws init                       # Interactive: choose targets, then locale
  anws init --target windsurf,codex,opencode
  anws init --target windsurf --locale en -y
  anws update                     # Refresh all matched targets from install-lock
`.trimStart();

// ─── 参数解析 ─────────────────────────────────────────────────────────────────
const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    version: { type: "boolean", short: "v", default: false },
    help: { type: "boolean", short: "h", default: false },
    yes: { type: "boolean", short: "y", default: false },
    target: { type: "string" },
    locale: { type: "string" },
    check: { type: "boolean", default: false },
  },
  strict: false,
  allowPositionals: true,
});

if (values.yes) {
  global.__ANWS_FORCE_YES = true;
}

if (values.locale !== undefined) {
  const loc = String(values.locale).trim().toLowerCase();
  if (loc !== "zh" && loc !== "en") {
    error("--locale must be zh or en");
    process.exit(1);
  }
  global.__ANWS_TEMPLATE_LOCALE = loc;
}

if (values.target !== undefined) {
  const targetIds = values.target
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  targetIds.forEach((targetId) => getTarget(targetId));
  global.__ANWS_TARGET_IDS = Array.from(new Set(targetIds));
}

// ─── 命令路由 ─────────────────────────────────────────────────────────────────
async function main() {
  if (values.version) {
    console.log(version);
    process.exit(0);
  }

  if (values.help || positionals.length === 0) {
    logo();
    blank();
    console.log(HELP.trimEnd());
    process.exit(0);
  }

  const command = positionals[0];

  switch (command) {
    case "init":
      await require("../lib/init")();
      break;

    case "update":
      if (values.target !== undefined) {
        error(
          "`anws update --target` has been removed. Use `anws update` to update all matched targets.",
        );
        process.exit(1);
      }
      if (values.check) {
        error(
          "`anws update --check` has been removed. Use `anws update` directly.",
        );
        process.exit(1);
      }
      await require("../lib/update")();
      break;

    default:
      error(`Unknown command: "${command}"`);
      info("Run `anws --help` to see available commands.");
      process.exit(1);
  }
}

main().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
