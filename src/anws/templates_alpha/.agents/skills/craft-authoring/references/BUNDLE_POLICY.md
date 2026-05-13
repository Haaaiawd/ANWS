# 模板 Bundle 契约（CLI · canonical · alpha）

本文定义 **安装边界**：哪些文件由 CLI 复制、canonical 与 alpha overlay 如何分工，避免「静默改写产品契约」。  
修改 **`lib/manifest.js`** 的登记项 = **显式改变**用户侧安装集合，须在 **发版说明** 中写明。

---

## 1. CLI 复制的唯一来源

| 机制 | 说明 |
|------|------|
| **`RESOURCE_REGISTRY`** | `lib/manifest.js` 中的数组；**唯一**驱动 `anws init` / `anws update` 写入用户项目的路径集合（经各 IDE target 投影）。 |
| **`TEMPLATE_ROOT`** | `src/anws/templates/`（见 `lib/resources`）。**`resolveCanonicalSource` 只拼接此根 + 每条 registry 的 `source`。 |
| **校验** | `scripts/check-canonical-templates.js`：registry 中每条 `source` 必须在 **`templates/`** 下存在且为普通文件。 |

未出现在 **`RESOURCE_REGISTRY`** 中的相对路径——即使躺在 **`templates/`** 目录里——**默认不会被 CLI 安装**。那是「仓库里有、产品上未发货」，与 alpha 省略某 skill **不是同一语义**：前者是 **registry 缺口**，后者是 **overlay 故意不收**。（例：若磁盘上存在 **`nexus-query/`** 而未登记，则 CLI 不发货；alpha 树则可能整目录不镜像—阅读时以 **registry + 本文件** 为准，勿混谈。）

---

## 2. Canonical（`templates/`）与英文镜像（`templates_en/`）

- **`templates/`**：npm 包内 canonical 中文默认树；与 **`package.json` version** 对齐叙述时用「shipped canonical」。
- **`templates_en/`**：英文镜像维护树；**CLI 仍只读 `templates/`** 作为复制源。双语对齐是 **维护责任**，不是第二条安装根。
- 改 workflow/skill 内容时：**两份树语义对齐**，避免 EN-only 漂移。

---

## 3. Alpha overlay（`templates_alpha/` · `templates_alpha_en/`）

**不是**第二条 semver，也 **不在** `RESOURCE_REGISTRY` 里整树挂载。

| 属性 | 说明 |
|------|------|
| **用途** | 可选安装根、remediation、实验版式；给「先写厚再收敛」用。 |
| **安装方式** | 当前 **无** `anws init --bundle alpha`；使用 overlay = **人工**把该树当作项目里的 `.agents/` 来源，或自定义脚本。 |
| **与 canonical 关系** | 允许 **故意省略**整个 skill 目录（例如不镜像 **`nexus-query`**）以控体积；需要该能力时 **改读 shipped `templates/` 同名路径** 或把对应条目 **登记进 registry** 后再依赖 CLI。 |
| **共用契约** | **`output-contract`**、**`genesis` ADR 时序** 等已收敛到与 canonical **同一路径名** 时，优先 **单 skill 引用**，避免在 overlay 里再抄一份长文。 |

### 合并进 canonical 之前（检查清单）

1. **省略项**：是 **永久从产品中删掉能力**，还是 **仅 overlay 不提供**？若是后者，canonical/registry **不得**假装该能力不存在。
2. **Registry**：新增或删除 `RESOURCE_REGISTRY` 条目会影响 **所有** 用户下一次 update；必须 semver + RELEASE_NOTES。
3. **体积**：先 **瘦身 / 抽 skill / 去重复** 再合并，避免把叙事债务写进默认路径。

---

## 4. 与 `/craft`、output-contract 的分工

| 文档 / Skill | 管什么 |
|----------------|--------|
| **`craft-authoring`（本仓库 SKILL）** | Workflow / Skill / Prompt **撰写脚手架**与评分闸门。 |
| **`output-contract`** | 执行期 **落盘 spec**、**委派与单写者**。 |
| **本文 `BUNDLE_POLICY`** | **谁会被 CLI 安装**、canonical / alpha **语义边界**、合并 **决策记录**。 |

---

## 5. 瘦身与后续工作（建议顺序）

1. **登记缺口**：若 canonical **`templates/`** 里某路径应随 CLI 发货但未在 registry，**要么登记要么删磁盘冗余**，避免「仓库有、用户永远没有」。
2. **重复收敛**：各 reviewer / workflow 中与 **`output-contract`**、**`BUNDLE_POLICY`** 重复的段落，改为 **一句引用**。
3. **大块 skill**（如 **`system-architect`**）：模板示例与 ADR 镜像表 **外链** 单一真源，再谈 alpha 转正或大合并。
