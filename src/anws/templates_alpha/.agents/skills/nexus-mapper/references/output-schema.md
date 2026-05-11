# 输出 Schema 规范

> **EMIT 阶段硬门控**：本文件由 `probe-protocol.md` 的 EMIT 阶段门控强制触发读取，
> 写入任何 `.nexus-map/` 文件前必须完成本文阅读。
> 本文 Schema 均基于实际运行输出校正，与脚本当前版本保持一致。

---

## raw/ast_nodes.json（extract_ast.py 产出）

### 顶层结构
```json
{
  "languages": ["cpp", "python"],
  "stats": {
    "total_files": 101,
    "total_lines": 23184,
    "parse_errors": 0,
    "truncated": true,
    "truncated_nodes": 298,
    "supported_file_counts": {"python": 101},
    "languages_with_structural_queries": ["python", "javascript", "typescript"],
    "languages_with_custom_queries": ["gdscript"],
    "module_only_file_counts": {"vue": 12},
    "known_unsupported_file_counts": {"customdsl": 24},
    "configured_but_unavailable_file_counts": {"templ": 6},
    "custom_language_config_paths": ["/custom/path/to/language-config.json"]
  },
  "warnings": [
    "custom language configuration loaded: /custom/path/to/language-config.json",
    "some languages were parsed with module-only coverage because no structural query template is bundled: vue (12 files)",
    "known unsupported languages present; downstream outputs must mark inferred sections explicitly: customdsl (24 files)",
    "some configured languages were detected in source files but no parser could be loaded: templ (6 files)"
  ],
  "nodes": [...],
  "edges": [...]
}
```

### Module 节点
```json
{
  "id": "src.nexus.application.weaving.treesitter_parser",
  "type": "Module",
  "label": "treesitter_parser",
  "path": "src/nexus/application/weaving/treesitter_parser.py",
  "lines": 320,
  "lang": "python"
}
```

### Class 节点
```json
{
  "id": "src.nexus.application.weaving.treesitter_parser.TreeSitterParser",
  "type": "Class",
  "label": "TreeSitterParser",
  "path": "src/nexus/application/weaving/treesitter_parser.py",
  "parent": "src.nexus.application.weaving.treesitter_parser",
  "start_line": 15,
  "end_line": 287
}
```

### Edge
```json
{
  "source": "src.nexus.infrastructure",
  "target": "src.nexus.infrastructure.db_client",
  "type": "contains"
}
```

**Edge 类型**：`contains`（模块→类，类→方法）/ `imports`（import 语句解析）

### warnings 字段

`warnings` 是可选数组，用来暴露不会导致 PROFILE 失败、但会影响下游可信度的降级信息，例如：
- grammar 可加载，但当前仅有 Module 级覆盖
- 已知但未支持的语言存在
- AST 被截断
- 部分解析器不可用

### 覆盖分层字段

| 字段                                     | 含义                                                              |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `supported_file_counts`                  | 成功进入 AST 流程的文件数（含完整结构覆盖和 module-only 覆盖）    |
| `languages_with_structural_queries`      | 当前 bundled query 模板覆盖到的语言                               |
| `languages_with_custom_queries`          | 通过 `--add-query` 或 `--language-config` 新增或覆盖 query 的语言 |
| `module_only_file_counts`                | grammar 可加载，但当前没有结构 query，只产出 Module 节点的语言    |
| `known_unsupported_file_counts`          | 已知存在但完全未进入 AST 流程的语言                               |
| `configured_but_unavailable_file_counts` | agent 明确要求支持该语言，但当前环境没有可用 parser               |
| `custom_language_config_paths`           | 本次实际加载的显式语言配置文件路径；纯 CLI 模式下为空             |

---

## raw/git_stats.json（git_detective.py 产出）

```json
{
  "analysis_period_days": 90,
  "stats": {
    "total_commits": 42,
    "total_authors": 1
  },
  "hotspots": [
    {"path": "src/nexus/tasks/analysis_tasks.py", "changes": 21, "risk": "high"}
  ],
  "coupling_pairs": [
    {"file_a": "...", "file_b": "...", "co_changes": 5, "coupling_score": 0.71}
  ]
}
```

**risk 阈值**：`changes < 5` → `low` / `5–15` → `medium` / `> 15` → `high`

---

## 生成的 Markdown 文件头部

`INDEX.md`、`arch/*.md`、`concepts/domains.md`、`hotspots/git_forensics.md` 的头部至少包含：

```markdown
> generated_by: nexus-mapper v2
> verified_at: 2026-03-07
> provenance: AST-backed except where explicitly marked inferred
```

如存在语言降级或人工推断，`provenance` 必须扩展说明：

```markdown
> provenance: AST-backed for Python; some custom DSL files were detected but not parsed by bundled AST tooling, so the affected dependency notes below are inferred from file tree and manual inspection.
```

---

## concepts/concept_model.json — Schema V1

Schema V1 的人类可读名称字段只有 `label`，不要额外引入 `title`；若出现 `title`，视为非规范字段，应删除。

```json
{
  "$schema": "nexus-mapper/concept-model/v1",
  "generated_at": "2026-03-05T15:00:00Z",
  "repo_path": "/absolute/path/to/repo",
  "generator": "nexus-mapper v2",
  "nodes": [
    {
      "id": "nexus.ast-extractor",
      "type": "System",
      "label": "AST Extractor",
      "responsibility": "使用 Tree-sitter 解析 Python 仓库，提取模块/类/函数节点及 import 关系，输出机器可读 JSON",
      "implementation_status": "implemented",
      "code_path": "src/nexus/application/weaving/",
      "evidence_path": null,
      "evidence_gap": null,
      "tech_stack": ["tree-sitter", "python"],
      "related_reqs": ["REQ-101"],
      "complexity": "medium",
      "hotspot": true
    }
  ],
  "edges": [
    {
      "source": "nexus.ast-extractor",
      "target": "nexus.task-dispatcher",
      "type": "depends_on",
      "description": "可选说明"
    }
  ],
  "metadata": {
    "total_files": 101,
    "total_lines": 23184,
    "languages": ["python"],
    "git_commits_analyzed": 42,
    "analysis_days": 90
  }
}
```

### 节点字段校验规则

| 字段                    |   必需   | 触发 `[!ERROR]` 的情况                                                      |
| ----------------------- | :------: | --------------------------------------------------------------------------- |
| `id`                    |    是    | 全局重复；含大写字母或空格（必须为 kebab-case 小写）                        |
| `type`                  |    是    | 不在枚举 `System / Domain / Module / Class / Function` 中                   |
| `label`                 |    是    | 空字符串                                                                    |
| `title`                 |    否    | Schema V1 不定义该字段；若写入，视为多余字段                                |
| `responsibility`        |    是    | 空泛到无法验证；字数 < 10 或 > 120                                          |
| `implementation_status` |    是    | 不在枚举 `implemented / planned / inferred` 中                              |
| `code_path`             | 条件必需 | `implementation_status=implemented` 但为空；或路径在 repo 中不实际存在      |
| `evidence_path`         | 条件必需 | `implementation_status=planned/inferred` 但为空；或路径在 repo 中不实际存在 |
| `evidence_gap`          | 条件必需 | `implementation_status=planned/inferred` 但为空                             |

### 节点状态表达规范

**已实现节点**
```json
{
  "implementation_status": "implemented",
  "code_path": "src/server/",
  "evidence_path": null,
  "evidence_gap": null
}
```

**计划中节点**
```json
{
  "implementation_status": "planned",
  "code_path": null,
  "evidence_path": "docs/architecture.md",
  "evidence_gap": "设计文档提到 Monarch/Executor，但仓库中未发现 src/agents/monarch/"
}
```

**推断节点**
```json
{
  "implementation_status": "inferred",
  "code_path": null,
  "evidence_path": "docs/architecture.md",
  "evidence_gap": "仓库包含当前未支持的 DSL 文件；此边界来自文件树与人工阅读"
}
```

---

## query_graph.py 输出格式参考（stdout，非写入文件）

### --file

```
=== <file_path> ===
Module: <module_id> (<lines> lines, <lang>)

Classes:
  <ClassName> (L<start>-L<end>)
    ├─ <method_name> (L<start>-L<end>)
    └─ <method_name> (L<start>-L<end>)

Top-level Functions:
  <func_name> (L<start>-L<end>)

Imports:
  → <internal_module> (<path>)
  → <external_package> (external)
```

### --who-imports

```
=== Who imports <module>? ===
Imported by N module(s):
  ← <module_id> (<path>)
```

### --impact

```
=== Impact radius: <file_path> ===

Depends on (this file imports):
  → <module_id> (<path>)

Depended by (other files import this):
  ← <module_id> (<path>)

Impact summary: N upstream dependencies, M downstream dependents

# 以下仅在传入 --git-stats 且该文件存在 hotspot/coupling 数据时输出
Git risk: high (N changes in 90 days)
Coupled files (co-change):
  - <peer_path> (coupling: 0.XX, N co-changes)
```

### --hub-analysis

```
=== Hub Analysis ===

Top fan-in (most imported by others):
  1. <module_id> — imported by N module(s)  [<path>]

Top fan-out (imports most others):
  1. <module_id> — imports N internal module(s)  [<path>]
```

### --summary

```
=== Directory Summary ===

<dir>/ (N modules, N classes, N functions, N lines)
  Key classes: ClassA, ClassB, ...
  Key imports from: <other_dir>, ...
```
