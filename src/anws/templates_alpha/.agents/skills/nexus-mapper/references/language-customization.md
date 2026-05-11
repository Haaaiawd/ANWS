# 为 nexus-mapper 补充语言支持

> 本文件不是阶段门控文件。当内置语言覆盖不足时，后续 agent 应优先参考本文件，通过命令行参数补充支持；只有在配置较复杂时，才使用显式 JSON 配置文件。

---

## 目标

当前脚本的默认模型是：

1. 先使用内置扩展名映射和内置 Tree-sitter query
2. 若内置覆盖不足，再由 agent 通过命令行补充语言支持
3. 若命令行参数过多或 query 过长，再退回到 `--language-config <JSON_FILE>`

这意味着：
- 不要求仓库内必须存在固定路径的语言配置文件
- 不建议为了单个仓库的单次分析先改核心脚本
- 新接手的 agent 可以在一次命令中直接把额外语言接入分析流程

---

## 优先方案：命令行补充

### 适用场景

满足以下条件时，优先用命令行：

- 仓库里出现了内置未覆盖的扩展名
- 只需要补 1 到 3 个语言映射
- query 较短，适合直接写在命令行中

### 步骤 1：确认语言名

先确认 `tree-sitter-language-pack` 或当前环境可识别的语言名。例如：

- `.templ` -> `templ`
- `.hbs` -> `handlebars`
- `.rego` -> `rego`

如果语言名不确定，先查官方 grammar 名称；不要猜测一个语言名直接写入最终结论。

### 步骤 2：补扩展名映射

```bash
python extract_ast.py <repo_path> \
  --add-extension .templ=templ \
  --add-extension .hbs=handlebars
```

这会把原本不认识的扩展名纳入语言分发流程。

### 步骤 3：按需补 query

如果只需要 Module 级覆盖，可以到此为止。

如果需要类/函数级结构，继续追加 `--add-query`：

```bash
python extract_ast.py <repo_path> \
  --add-extension .templ=templ \
  --add-query templ struct "(component_declaration name: (identifier) @class.name) @class.def"
```

参数格式：

```text
--add-query <LANG> <TYPE> <QUERY_STRING>
```

其中：
- `<LANG>`：语言名，例如 `templ`
- `<TYPE>`：`struct` 或 `imports`
- `<QUERY_STRING>`：Tree-sitter query 字符串

capture 命名必须继续遵守现有约定：
- 类：`@class.def` / `@class.name`
- 函数：`@func.def` / `@func.name`
- 导入：`@mod`

---

## 备选方案：显式 JSON 配置文件

当下面任一情况成立时，可使用 `--language-config`：

- 需要补多个语言，命令行已经过长
- query 很复杂，不适合内联在 shell 命令里
- 希望把一次分析所需的扩展映射和 query 集中保存

示例：

```json
{
  "extensions": {
    ".templ": "templ",
    ".hbs": "handlebars"
  },
  "queries": {
    "templ": {
      "struct": "(component_declaration name: (identifier) @class.name) @class.def",
      "imports": ""
    }
  },
  "unsupported_extensions": {
    ".legacydsl": "legacydsl"
  }
}
```

执行方式：

```bash
python extract_ast.py <repo_path> --language-config /custom/path/to/language-config.json
```

说明：
- `extensions`：扩展名到语言名的映射
- `queries`：自定义 `struct` / `imports` query
- `unsupported_extensions`：显式声明当前仍不支持的扩展名，避免静默跳过

这里的 JSON 文件是一次分析的显式输入，不要求固定放在仓库某个默认位置。

---

## 覆盖诚实度规则

不管是命令行还是显式 JSON，新增语言都必须遵守同一套分层标准：

1. `structural coverage`
   条件：parser 可加载，且存在 `struct` query

2. `module-only coverage`
   条件：parser 可加载，但没有 `struct` query

3. `configured-but-unavailable`
   条件：agent 明确要求支持该语言，但当前环境无法加载 parser

4. `unsupported`
   条件：该语言仍未纳入本次 AST 流程，或被显式标记为未支持

禁止：
- 把 `configured-but-unavailable` 写成 `module-only`
- 把 `unsupported` 伪装成“仓库里没出现”

---

## 推荐决策顺序

当后续 agent 遇到一个未覆盖语言时，按以下顺序处理：

1. 先确认当前仓库里是否真的存在该扩展名文件
2. 再确认当前环境能否加载对应 parser
3. 若能加载：优先用 `--add-extension`；需要结构节点时再补 `--add-query`
4. 若命令太长：改用 `--language-config`
5. 若 parser 不能加载：保留 `configured-but-unavailable`，不要伪造结果

---

## 设计原则

- 内置语言优先，命令行补充其次，显式 JSON 最后
- 对单次分析，优先使用最小额外输入，不要先改核心脚本
- 自定义 query 是正式输入，不是旁路 hack
- 所有新增语言都必须遵守同一套 metadata 和 provenance 规则
