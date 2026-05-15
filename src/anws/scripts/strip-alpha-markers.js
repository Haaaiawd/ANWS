#!/usr/bin/env node
'use strict';

/**
 * One-off maintainer script: remove ALPHA / alpha product-line markers from
 * shipped workflow + skill markdown under templates/ and templates_en/.
 */

const fs = require('node:fs');
const path = require('node:path');

const BASE = path.resolve(__dirname, '..');
const ROOTS = [path.join(BASE, 'templates'), path.join(BASE, 'templates_en')];

function walkMdFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMdFiles(p, out);
    else if (ent.isFile() && ent.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function transform(s) {
  let o = s;

  // --- Headings: # /foo (ALPHA)
  o = o.replace(/# \/([^\r\n(]+) \(ALPHA\)/g, '# /$1');

  // --- YAML description quoted (zh/en)
  o = o.replace(/^(\s*description:\s*")【ALPHA】/gm, '$1');
  o = o.replace(/^(\s*description:\s*")\[ALPHA\]\s*/gm, '$1');
  o = o.replace(/^(\s*description:\s*)【ALPHA】/gm, '$1');
  o = o.replace(/^(\s*description:\s*)\[ALPHA\]\s*/gm, '$1');

  // --- Section titles
  o = o.replace(/## ALPHA paired skills \(same bundle as this line\)/g, '## Paired skills (same bundle as this line)');
  o = o.replace(/## ALPHA paired skills \(same bundle as this track\)/g, '## Paired skills (same bundle as this track)');
  o = o.replace(/## ALPHA 体系配对技能（与本线同 bundle）/g, '## 配对技能（与本线同 bundle）');

  o = o.replace(/\*\*ALPHA 宿主约束\*\*/g, '**宿主约束**');
  o = o.replace(/\*\*ALPHA host constraints\*\*/gi, '**Host constraints**');
  o = o.replace(/\*\*ALPHA 域契约\*\*/g, '**CRITICAL 域契约**');
  o = o.replace(/\*\*ALPHA domain\*\*/gi, '**CRITICAL domain**');

  o = o.replace(/^- ALPHA：/gm, '- **域内要点**：');
  o = o.replace(/^- ALPHA:/gm, '- **Focus**:');

  // --- Role / persona suffixes
  o = o.replace(/\s*—\s*ALPHA track/gi, '');
  o = o.replace(/（ALPHA 线）/g, '');
  o = o.replace(/\s*\(ALPHA track\)/gi, '');

  // --- genesis / forge phrasing
  o = o.replace(/\*\*alpha `\/genesis`/gi, '**`/genesis`');
  o = o.replace(/\balpha `\/genesis`/gi, '`/genesis`');
  o = o.replace(/`\/genesis`（ALPHA 线）/g, '`/genesis`');
  o = o.replace(/`\/genesis` \(ALPHA track\)/gi, '`/genesis`');
  o = o.replace(/`\/genesis`\s*（ALPHA）/g, '`/genesis`');
  o = o.replace(/`\/genesis`\s*\(ALPHA\)/gi, '`/genesis`');
  o = o.replace(/与 \*\*同工作区 `\/genesis`（ALPHA）\*\* 连用/g, '与 **同工作区 `/genesis`** 连用');
  o = o.replace(/use with \*\*`\/genesis` \(ALPHA\)\*\* in the same workspace/gi, 'use with **`/genesis`** in the same workspace');

  o = o.replace(/叠加 ALPHA 四锚点/g, '叠加四锚点');
  o = o.replace(/layers ALPHA Four Anchors/gi, 'layers Four Anchors');
  o = o.replace(/叠加 ALPHA 执行契约/g, '叠加执行契约');
  o = o.replace(/,\s*layered with ALPHA execution contract/gi, ', layered with execution contract');
  o = o.replace(/与 canonical forge 等价/g, '与标准 forge 流程等价');
  o = o.replace(/equivalent to canonical forge/gi, 'equivalent to the standard forge flow');

  // --- Challenge / explore "do not weaken because ALPHA"
  o = o.replace(/不得因「ALPHA」或篇幅目标/g, '不得因篇幅目标');
  o = o.replace(/不得因 ALPHA 篇幅/g, '不得为压缩篇幅');
  o = o.replace(/均不得因 ALPHA 篇幅/g, '均不得为压缩篇幅');
  o = o.replace(/do not weaken into implication-only prose for ALPHA length/gi, 'do not weaken into implication-only prose for length targets');
  o = o.replace(/because this is ALPHA or for length targets/gi, 'for length targets');

  // --- task-reviewer / e2e
  o = o.replace(/alpha spec 契约/g, '本 SKILL spec 契约');
  o = o.replace(/alpha spec contract/gi, 'this SKILL spec contract');
  o = o.replace(/\*\*限制\*\*：ALPHA 仅允许/g, '**限制**：仅允许');
  o = o.replace(/\*\*Constraints\*\*: ALPHA may compress/gi, '**Constraints**: Edits may compress');

  o = o.replace(/（及 alpha 对齐的 forge 条文）/g, '（及 `/forge` 对应条文）');
  o = o.replace(/\(and alpha-aligned forge text\)/gi, '(per `/forge` wording)');

  // --- spec-writer delta paragraph
  o = o.replace(
    /本模板相对 `templates\/\.agents\/skills\/spec-writer` 增加 \*\*ALPHA\*\* 侧的/g,
    '本模板相对 `templates/.agents/skills/spec-writer` 增加'
  );
  o = o.replace(/this template adds \*\*\[ALPHA\]\*\*-side/gi, 'this template adds');

  // --- system-architect completion bullet
  o = o.replace(
    /- \*\*phase_context\*\* 已落地；文稿体现 \*\*ALPHA\*\* 与同会话禁混 canonical `templates\/` 同名 skill 的约束口径。\s*/g,
    '- **phase_context** 已落地；文稿与约束口径一致（禁预读、单一路径）。\n'
  );
  o = o.replace(
    /- \*\*phase_context\*\* applied; wording reflects \*\*\[ALPHA\]\*\* and same-session prohibition on mixing canonical `templates\/` skill with same name\.\s*/gi,
    '- **phase_context** applied; wording matches constraints (no early read, single path).\n'
  );

  // --- concept-modeler
  o = o.replace(/- \*\*主路径\*\*：alpha \*\*`\/genesis` Step 1\*\*/g, '- **主路径**：**`/genesis` Step 1**');
  o = o.replace(/（与 ALPHA 契约叠加）/g, '（与本 SKILL 契约叠加）');
  o = o.replace(/\(stacked with ALPHA contract\)/gi, '(stacked with this SKILL contract)');

  // --- Section headers ## 【ALPHA】 / ## [ALPHA]
  o = o.replace(/## 【ALPHA】/g, '## ');
  o = o.replace(/## \[ALPHA\]\s*/g, '## ');

  // --- Bracket tags (remaining)
  o = o.replace(/【ALPHA】/g, '');
  o = o.replace(/\[ALPHA\]/g, '');

  // --- Parenthetical (ALPHA) left from titles — careful: only common cases
  o = o.replace(/\s*\(ALPHA\)\s*$/gm, '');
  o = o.replace(/（ALPHA）/g, '');

  // --- Cleanup awkward spacing after bracket removals
  o = o.replace(/（\s+\//g, '（/');
  o = o.replace(/\(\s+\//g, '(/');
  o = o.replace(/—\s{2,}/g, '— ');

  return o;
}

function main() {
  let changed = 0;
  for (const root of ROOTS) {
    for (const file of walkMdFiles(root)) {
      const before = fs.readFileSync(file, 'utf8');
      const after = transform(before);
      if (after !== before) {
        fs.writeFileSync(file, after, 'utf8');
        changed++;
      }
    }
  }
  console.log(`strip-alpha-markers: updated ${changed} markdown files`);
}

main();
