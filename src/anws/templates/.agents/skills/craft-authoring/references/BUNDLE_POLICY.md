# 模板 Bundle 契约（CLI · 发货模板）

本文定义 **安装边界**：哪些文件由 CLI 复制；产品与 CLI 仅维护 **一套** `RESOURCE_REGISTRY`。**`zh` / `en`** 只决定从 **`templates/`** 或 **`templates_en/`** 取同源相对路径的文案，不是两套并行产品权威。  
修改 **`lib/manifest.js`** 的登记项 = **显式改变**用户侧安装集合，须在 **发版说明** 中写明。

---

## 1. CLI 复制的唯一来源

| 机制 | 说明 |
|------|------|
| **`RESOURCE_REGISTRY`** | `lib/manifest.js` 中的数组；**唯一**驱动 `anws init` / `anws update` 写入用户项目的路径集合（经各 IDE target 投影）。 |
| **`TEMPLATE_ROOT`** / **`TEMPLATE_ROOT_EN`** | `src/anws/templates/` 与 `src/anws/templates_en/`（见 `lib/resources`）。**`resolveCanonicalPath(rel, templateLocale)`** 在 **`zh`** 时读 `templates/`；在 **`en`** 时优先 `templates_en/` 下同相对路径，不存在则回退 `templates/`。 |
| **校验** | `scripts/check-canonical-templates.js`：registry 中每条 `source` 必须在 **`templates/`** 下存在且为普通文件。 |

未出现在 **`RESOURCE_REGISTRY`** 中的相对路径——即使躺在 **`templates/`** 目录里——**默认不会被 CLI 安装**。例如 **`nexus-query/`** 等仅作仓库维护、未登记时，CLI 不发货；以 **registry + 本文件** 为准。

---

## 2. `templateLocale`：`templates/` 与 `templates_en/`

- **`templates/`**：npm 包内默认中文文案树，亦是 **registry 路径的存在性校验根**。
- **`templates_en/`**：英文镜像；`install-lock` 中 **`templateLocale: en`** 时，init/update 从 **`templates_en/`** 读取同源 **相对路径**，缺失条目回退 **`templates/`**。
- 维护时 **同一组 `source` 相对路径** 在中英文树之间 **语义对齐**，避免 EN-only 漂移。

---

## 3. 与 `/craft`、output-contract 的分工

| 文档 / Skill | 管什么 |
|----------------|--------|
| **`craft-authoring`（本仓库 SKILL）** | Workflow / Skill / Prompt **撰写脚手架**与评分闸门。 |
| **`output-contract`** | 执行期 **落盘 spec**、**委派与单写者**。 |
| **本文 `BUNDLE_POLICY`** | **谁会被 CLI 安装**、locale 选根规则、registry **决策记录**。 |

---

## 4. 瘦身与后续工作（建议顺序）

1. **登记缺口**：若 **`templates/`** 里某路径应随 CLI 发货但未在 registry，**要么登记要么删磁盘冗余**，避免「仓库有、用户永远没有」。
2. **重复收敛**：各 reviewer / workflow 中与 **`output-contract`**、**`BUNDLE_POLICY`** 重复的段落，改为 **一句引用**。
3. **大块 skill**（如 **`system-architect`**）：模板示例与 ADR 镜像表 **外链** 单一真源，再谈体积收敛或大合并。
