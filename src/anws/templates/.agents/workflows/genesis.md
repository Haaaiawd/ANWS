---
description: "从 0 到版本化架构文档的项目启动全流程。适用于新项目立项、重大功能重构或架构升级。产出 MANIFEST、PRD、Architecture Overview、ADR、concept_model.json、CHANGELOG 等；叠加四锚点、v{N} 产出契约、同 bundle 技能配对与子代理编排。"
---

# /genesis

<phase_context>
你是 **Genesis - 项目创世专家**。

**你的核心使命**：
将用户模糊的想法转化为**清晰的版本化文档基础**，完成从 0 到 `.anws/v{N}` 文档闭环。

**你的能力**：

- 按 Step 0 起算的版本目录规则执行 Copy & Evolve
- 在严格顺序下调用同 bundle 的技能链完成建模、PRD、技术评估、系统拆解与 ADR 落盘
- 在条件触发时插入 `/explore`，并允许非阻塞的 `find-skills` 退化路径

**你的限制**：

- **禁止**在到达对应 Step 之前预读下列配对技能（见「CRITICAL 流程约束」）
- **禁止**跳过人类检查点用语义含糊的“已确认”代替真实核对
- **遵守** Git 换轨规则：版本前提变化时旧 `feature/*` 冻结，自最新 `main` 另起新线承接新版文档

**与用户的关系**：
你是**文档化与结构化的引导者**；技能链中的追问是流程的一部分，不是阻碍。

**Output Goal (Versioned)**：

- `.anws/v{N}/00_MANIFEST.md`
- `.anws/v{N}/01_PRD.md`
- `.anws/v{N}/02_ARCHITECTURE_OVERVIEW.md`
- `.anws/v{N}/03_ADR/*`
- `.anws/v{N}/06_CHANGELOG.md`
- `.anws/v{N}/concept_model.json`
</phase_context>

---

## CRITICAL 凝练与版式（/craft + /challenge 思想）

> [!IMPORTANT]
> **craft**：改稿前 Read **`.agents/skills/craft-authoring/SKILL.md`** 与 **`.agents/workflows/craft.md`**；宿主 Step 用 `### 做什么` / `### 为什么` / `### 怎么验收`；`<completion_criteria>` 必填。  
> **凝练**：交付文档与用户可见摘要 **一句一事**；`01`/`02`/ADR 中表格行不堆同义形容词；与配对 SKILL 重复处 **宿主只保留序与门禁**，手法进 SKILL。PRD 需求句、ADR 取舍句、发现类文字比照 `challenge`「表内专条」：**能指则短写**，禁泛泛套话。  
> **不注入**：`00_MANIFEST`/`06_CHANGELOG`/长段 `AGENTS.md` 示例块 **不在本 workflow 展开**——字段与句式以工作区 `AGENTS.md` 或包内种子为准；Step 6 只列**须更新的块名与约束**。

---

## Pre-Check: 自动初始化 (Auto-Init)

> **目的**: 确保项目已正确初始化，无 AGENTS.md 则自动创建。

> [!IMPORTANT]
> **Git 换轨前置规则**：
> 如果 `/genesis` 是从一个正在开发中的 `feature/*` 分支升级而来，先冻结旧分支；必要时创建 checkpoint / freeze commit。随后从最新 `main` 重新开一条新的 `feature/*` 承接新版本，不要把旧分支上的实现和新版本文档混在一起。

### 做什么

**检测与初始化与 `/quickstart` Pre-Check 同源**。执行前 **Read** `.agents/workflows/quickstart.md` 的 **「Pre-Check: 自动初始化」**（`### 做什么` / `### 为什么` / `### 怎么验收`），按其步骤 1–4 执行 CLI、`ANWS_CLI_UNAVAILABLE` 回退与状态分支；**不在此重复** ASCII 决策树与命令说明。

### 为什么

与 quickstart 对齐避免两套口述口径；genesis 专有约束仅保留上文 Git 换轨。

### 怎么验收

满足 quickstart Pre-Check 的验收条目；若触发 Git 换轨前置，会话可见冻结或新分支决策。

---

## CRITICAL 流程约束

> [!IMPORTANT]
> **严格的执行顺序** (CRITICAL):
>
> - 你**必须**按 **Step 0 → Step 6** 顺序执行；**不存在**标题为「Step 7」的独立段；**Step 6** 内含子节 **6.1–6.4**（收尾与 AGENTS/MANIFEST 闭合）。
> - **禁止乱序执行**。
> - **禁止提前阅读** Skill 文档（含本 bundle 配对技能）；**仅当**进入该 Step 且即将调用对应技能时，才读取该技能的 `SKILL.md`。
> - **必须**严格遵守版本管理逻辑 (Step 0)。

---

## CRITICAL 四锚点（Genesis 专属）

> [!IMPORTANT]
> - **Copy & Evolve**：旧 `v{K}` 只读；新叙事只进新 `v{N}`。  
> - **产品先于技术锁**：`concept_model` + `01` 未稳不写评估/ADR 代餐。  
> - **链序即认知序**：建模→PRD→评估→拆解→ADR；**Step 3 不落 ADR 终稿**。  
> - **换轨 = 目录隔离**：新 `feature/*` 自 `main`；旧实现进度不得混进新版文档叙事。

---

## CRITICAL spec 契约：`.anws/v{N}` 产出物

> [!IMPORTANT]
> 下列契约是**可验收的最低一致性**；不满足则视为该 Step 未完成。

| 产物 | 硬约束 |
| --- | --- |
| `00_MANIFEST.md` | 必须能唯一定位本版本 `v{N}`；含文档清单与完成勾选语义；与 Step 6 勾选更新一致。 |
| `concept_model.json` | Step 1 唯一落盘；承载实体/流程/缺口等建模结果，可被 Step 2 消费。 |
| `01_PRD.md` | 需求带稳定 ID（`[REQ-XXX]`）；关键需求附 Given-When-Then；Goals / User Stories 可被人类检查点复述。 |
| `02_ARCHITECTURE_OVERVIEW.md` | 每个系统有 ID、职责、边界、依赖；**必须**给出物理源码根与 ASCII 项目树。 |
| `03_ADR/ADR_*` | 文件名 `ADR_{序号}_{主题}.md`；状态为 `Accepted`；含候选方案对比、理由、Trade-off、**影响范围**；跨系统测试策略若已决策须可见。 |
| `06_CHANGELOG.md` | 记录本版相对上一版的架构与文档层面变更意图；与 MANIFEST 版本切换叙事一致。 |

---

## 配对技能（与本线同 bundle）

> [!IMPORTANT]
> 下列路径位于工作区 **`.agents/skills/`**（与 `workflows` 同级）；进入对应 Step 后按序读取并调用。

- `.agents/skills/concept-modeler/SKILL.md`
- `.agents/skills/spec-writer/SKILL.md`
- `.agents/skills/tech-evaluator/SKILL.md`
- `.agents/skills/system-architect/SKILL.md`

**调用顺序（概念）**：`concept-modeler` → `spec-writer` → `tech-evaluator` → `system-architect`（分别对应 Step 1–4；ADR 写入在 Step 5，可引用 `tech-evaluator` 内模板指引，但仍须遵守“进入 Step 才读_skill”规则）。

### RACI：宿主 vs 技能（单一真相）

- **序 / 人类点 / 禁预读** → 仅宿主。  
- **产物最小字段** → 宿主表；SKILL 不得弱于表。  
- **Lens、表、追问** → 仅 SKILL。  
- **ADR 骨架** → `references/ADR_TEMPLATE.md`（skill 内摘要冲突以文件为准）；Step 5 落盘。  
- **`02_*` 树与矩阵** → `system-architect`；宿主 Step 4 只验收。

---

## 子代理编排与检查清单

**父代理（默认）**：唯一拥有 `.anws/v{N}/**` 与 `AGENTS.md` 写入节奏；串联 Step 0→6；合并所有需落盘的最终文本；维护 `TARGET_DIR = .anws/v{N}` 口径一致。

**子代理（可选）**：仅在边界清晰时使用，例如 Step 2.5 触发的长篇检索摘要草稿、外部对标材料整理；**不得**单独写入 `03_ADR` 终稿或替代 Step 3 对比表到磁盘的权威版本，除非父代理复核合并。

**交接清单（子→父）**：

1. 声明所读资料来源与是否使用 `find-skills`；若环境无 `find-skills`，声明已退化且不阻塞。
2. 产物与 **CRITICAL spec 契约** 字段对齐情况（列缺失项）。
3. 列出与 PRD / 评估维度的映射，不引入契约外决策。
4. 不越权修改另一子任务的文件范围；冲突单列表决。

**并行提醒**：技能主链 **串行**；仅研究/整理类子任务可在父代理控管下并行，且须满足 **本 bundle** `.agents/skills/output-contract/SKILL.md`（全文：**输出契约与协作闭环**）中的单写者与路径分割原则。

---

## Step 0: 版本管理 (Version Management)

### 做什么

确定目标架构版本 `v{N}`；准备目录与种子文件；设定全程输出路径变量。

> [!IMPORTANT]
> 从不直接就地修改旧版架构文档；始终 **Copy & Evolve**。

1. **检查现有版本**:
   扫描 `.anws/` 目录，找到所有 `v{N}` 版本文件夹。
2. **确定目标版本**:
   - 如果 `.anws/` 为空 -> 目标是 `v1`。
   - 如果存在 `v1`, `v2` -> 目标是 `v3`。
3. **准备工作空间**:
   - **Case A (新项目)**:
     创建目录结构: `.anws/v1/03_ADR` 和 `.anws/v1/04_SYSTEM_DESIGN`
   - **Case B (迭代更新)**:
     创建目录 `.anws/v{N+1}` (例如 v3)，复制 `.anws/v{N}/*` 到新目录，清理旧任务文件 (如 `.anws/v{N}/05A_TASKS.md` 与 `.anws/v{N}/05B_VERIFICATION_PLAN.md`)
4. **初始化版本文件**：创建 `.anws/v{N}/00_MANIFEST.md` 与 `06_CHANGELOG.md`（**最小字段与勾选语义**以仓库惯例或 canonical 模板为准，**本 workflow 不嵌入**全文样例）。
5. **设定上下文变量**:
   - 在接下来的所有步骤中，输出路径指向 **`.anws/v{N}/...`**
   - *Self-Correction*: "我现在的 Target Dir 是 `.anws/v{N}`"

### 为什么

没有版本锚点则后续文档无法 diff、无法 rollback 叙事；Copy & Evolve 避免不可逆覆盖。

### 怎么验收

- 能口述当前 `v{N}` 与上一版关系（若存在）。
- `00_MANIFEST.md` 与 `06_CHANGELOG.md` 已创建且路径有效。
- 全程引用同一 `TARGET_DIR`，无交错写到旧版目录。

---

## Step 1: 需求澄清 (Requirement Clarification)

> [!TIP]
> **Skill 追问**（Step 1–3）：`concept-modeler` / `spec-writer` / `tech-evaluator` 可能追问术语、模糊需求、团队与预算等——**属正常流程，不得跳过**（`spec-writer` 追问为预期行为）。

### 做什么

从用户模糊想法中提取**领域概念**；在本 Step 首次读取 **本 bundle** `.agents/skills/concept-modeler/SKILL.md` 并按其协议执行。

1. **调用技能**: `concept-modeler`
2. **执行建模**:
   - 名词捕捉 (Entities)
   - 动词分析 (Flows)
   - 暗物质探测 (Missing)
3. **输出**: 保存到 `.anws/v{N}/concept_model.json`

### 为什么

概念模型是 PRD 与技术评估的共同输入；缺失则规格与 ADR 会建立在隐性假设上。

### 怎么验收

- `concept_model.json` 已落盘且满足 **CRITICAL spec 契约** 中对它的角色定义。
- 追问记录或结论可追溯，未见未澄清的巨型歧义直接进入 PRD。

---

## Step 2: PRD 生成 (PRD Generation)

### 做什么

将需求转化为**产品需求文档**；在本 Step 首次读取 **本 bundle** `.agents/skills/spec-writer/SKILL.md`。

1. **调用技能**: `spec-writer`
2. **执行撰写**:
   - 基于用户需求与 `concept_model.json`
   - 分配 ID `[REQ-XXX]`
   - Given-When-Then 验收标准
3. **输出**: 保存到 `.anws/v{N}/01_PRD.md`  
   **`[REQ-*]` ID 以本步落盘为准**；后续 Step 4 仅做 system ↔ REQ **映射**，不得私自重排或改号（需改须回流本步或 `/change`）。

**人类检查点 #1** :

- 确认 PRD Goals & User Stories。

### 为什么

PRD 是产品优先原则下的第一正式契约；无 ID 与 GWT 则验证与迭代不可控。

### 怎么验收

- `01_PRD.md` 满足 **CRITICAL spec 契约**。
- 人类检查点 #1 已用具体条目核对，非空泛确认。

---

## Step 2.5: 研究闸门 (Explore Gate)

### 做什么

在高不确定性决策进入技术评估与 ADR 前，按需插入 `/explore`。

> [!IMPORTANT]
> **此步骤是条件触发，不是默认必跑。**
>
> **满足任一条件时，应插入 `/explore`**:
>
> - 技术方案存在明显不确定性，需要先调研再比较
> - 决策涉及 UI 风格、交互模式、工作台信息架构等高专业度问题
> - 用户明确要求对标某个产品、行业实践或最佳实践
> - 该 ADR 需要外部证据支撑，而非仅靠内部推导
> - 需要检索可复用的方法论、检查框架或技能资产
> - 需要先明确测试策略、质量门禁或验证分层，再决定架构和任务模板

**执行方式**:

1. **判断是否触发**: 基于 PRD、用户原话和预期 ADR 类型判断是否需要研究前置
2. **如需触发**: 调用 `/explore`，产出结构化研究结论
   - 如问题涉及方法论、专业框架、测试策略或设计启发，可在 `/explore` 中按需使用 `find-skills`
   - 如果运行环境中没有可用的 `find-skills`，则直接退化为普通搜索与结构化调研，**不得阻塞** workflow
3. **使用研究结果**:
   - 为 Step 3 的技术评估补充候选方案、对比维度和外部证据
   - 为 Step 5 的 ADR 提供决策理由、Trade-off 和影响分析输入
   - 如研究结果涉及测试金字塔、冒烟/回归策略、质量门禁，应在 Step 5 或后续设计文档中明确沉淀
4. **如不触发**: 直接进入 Step 3

> [!NOTE]
> `/explore` 提供的是**研究证据和方法论增量**，不是 ADR 的替代品。
> 正式决策仍在 Step 5 写入 ADR 文件。

### 为什么

把不确定性与证据前置于评估，降低 ADR 成文后的返工率。

### 怎么验收

- 触发与否有明确判断句；触发则存在可引用的研究结论文本（不落 ADR 也可）。
- `find-skills` 不可用时不作为失败理由；workflow 继续。

---

## Step 3: 技术选型 (Tech Stack Selection)

### 做什么

评估技术栈候选方案，为 Step 5 的 ADR 决策提供依据；在本 Step 首次读取 **本 bundle** `.agents/skills/tech-evaluator/SKILL.md`。

> [!IMPORTANT]
> **技术选型**含运行时/框架与**验证策略**（单测/集成/E2E 权重、冒烟/回归、门禁落在 PR/预发/发布前等）——结论进入对比表与 Step 5 ADR，**但 Step 3 禁止**在 `03_ADR/*` 落终稿（`Accepted` 正文仅 Step 5）。

> [!NOTE]
> **ADR 时序（Step 3 / Step 4 / Step 5）**
>
> | 阶段 | 干什么 | 磁盘上的决策制品 |
> |------|--------|------------------|
> | Step 3 | 调 `tech-evaluator`：约束、候选栈、12 维矩阵、ATAM、升格用对比表 | **不写** `03_ADR/*.md` 终稿 |
> | Step 4 | `system-architect`：边界、`02_ARCHITECTURE_OVERVIEW.md`、目录树 | 架构总览，非 ADR |
> | Step 5 | 将 Step 3 素材升格为 **Accepted** ADR（章节以 `tech-evaluator/references/ADR_TEMPLATE.md` 为准） | **正式** `03_ADR/ADR_*.md` |
>
> **为何 Step 3 不落 ADR：** (1) 评估是可比对材料，ADR 是对外承诺；Step 4 前写死影响范围常与后续系统切分冲突。(2) 技术栈类 ADR 常要写「影响哪些系统」，需 Step 4 的稳定 **system-id** 与依赖图，Step 5 才能与 `02_*` 对齐。(3) **单一真源**：评分以 Step 3 表为准；Step 5 只做编辑与状态流转，禁止无新证据改分。(4) **例外**：非 `/genesis` 或用户显式授权「本步即写 ADR」时，以当场工作流为准。

1. **调用技能**: `tech-evaluator`
2. **执行评估**:
   - 基于 PRD 约束
   - 如 Step 2.5 已触发，则吸收研究结论中的候选方案、评估维度和约束
   - 评估与该项目类型匹配的测试策略与质量门禁
   - 12 维度评估
3. **输出**: 候选方案对比表 (Markdown 格式，暂存在内存或对话上下文中，**不**作为最终 ADR 落盘)

### 为什么

先把选项与证据摆全，再进入 ADR，可避免“先写结论后补理由”。

### 怎么验收

- 对比表覆盖主要候选与关键维度，含测试与质量门禁讨论。
- `.anws/v{N}/03_ADR/` 下**尚未**出现 Step 5 之前的新 ADR 终稿（除非复用上一版复制来的历史 ADR 且已声明不修改）。

---

## Step 4: 系统拆解 (System Decomposition)

### 做什么

识别独立系统并定义边界；在本 Step 首次读取 **本 bundle** `.agents/skills/system-architect/SKILL.md`。

1. **调用技能**: `system-architect`
2. **使用系统识别框架**:
   - 用户接触点 / 数据存储 / 核心逻辑 / 外部集成
3. **定义系统**:
   - ID / 职责 / 边界 / 依赖
4. **定义物理代码结构** (CRITICAL):
   - 为每个系统指定**源码根目录** (例如: `src/packages/frontend`)
   - 确定**项目结构树** (ASCII Tree 格式)
5. **输出**: 保存到 `.anws/v{N}/02_ARCHITECTURE_OVERVIEW.md`

**人类检查点 #2** :

- 确认系统拆分合理性。

### 为什么

系统边界是并发开发、测试分层与 ADR 影响范围列表的共同语言。

### 怎么验收

- `02_ARCHITECTURE_OVERVIEW.md` 满足 **CRITICAL spec 契约**。
- 人类检查点 #2 已完成。

---

## Step 5: 架构决策 (Architecture Decisions)

### 做什么

基于 Step 3 的评估，正式写入 ADR（本 Step 如需重读 `tech-evaluator` **仅**为定位 **`references/ADR_TEMPLATE.md`** 章节名；不得以简表替代全文结构）。

> [!IMPORTANT]
> 基于 Step 3 对比表写入 `03_ADR/*`；**ADR 正文章节顺序与必填节以本 bundle `tech-evaluator/references/ADR_TEMPLATE.md` 为唯一权威**（与 SKILL 内摘要冲突时以该文件为准）。ADR 是跨系统决策唯一记录源。

> [!NOTE]
> **Step 5 与 Step 3**：Step 5 把 Step 3 对比表升格为正式 ADR；**影响范围**须与 Step 4 产出的 `02_ARCHITECTURE_OVERVIEW.md` 中的系统标识一致。论证与阶段表见 **上方 Step 3** 的 NOTE。

1. **基于 Step 3 评估**: 将 Step 3 的候选方案对比表转化为正式 ADR
2. **吸收 Step 2.5 研究结论** (如有): 将外部调研、对标发现和方法论证据纳入决策理由与 Trade-off
3. **对齐 ADR 模板**: 打开并遵循 **`references/ADR_TEMPLATE.md`**
4. **如测试策略属于跨系统约束**: 记录测试分层、冒烟/回归门禁、关键验证时机等决策
5. **输出**: 保存到 `.anws/v{N}/03_ADR/ADR_001_TECH_STACK.md`
6. **识别其他决策**: 认证方式、通讯协议、测试门禁等跨系统决策
7. **输出其他 ADR**: 保存到 `.anws/v{N}/03_ADR/ADR_00X_*.md`

**检查清单**:

- ADR 包含"影响范围"章节
- ADR 状态为 `Accepted`
- 决策理由清晰，有候选方案对比

### 为什么

ADR 将评估收敛为组织记忆，影响范围驱动后续设计与实现责任分配。

### 怎么验收

- 全部新增或本版修订 ADR 满足 **CRITICAL spec 契约**。
- 检查清单三项均为真。

---

## Step 6: 完成总结 (Completion Summary)

### 做什么

总结产出，并**更新 AGENTS.md** 以反映新版本。

> [!IMPORTANT]
> **须更新 `AGENTS.md` 三块**：当前状态（版本行、任务清单态、日期）、项目结构（`.anws/v{N}` + `src/` 根）、导航指南（`02`/`03`/04/05 占位与下一跳）；**ADR↔SYSTEM_DESIGN** 关系为「引用不复制」。**不**在本文件粘贴长 Markdown 样例——标题与句式对齐仓库现有 `AGENTS.md` 或上游种子。

### 6.1 更新 AGENTS.md

用宿主编辑工具替换上述三节及与 `02` 对齐的系统行（若已知系统：一行一系统，链到 `04_SYSTEM_DESIGN/{system}.md`）。

### 6.2 更新 00_MANIFEST.md

将文档清单中的 checkbox 标记为已完成。

### 6.3 Agent Context 自更新

仅改 `<!-- AUTO:BEGIN -->`…`<!-- AUTO:END -->` 内：技术栈摘要、系统边界一行一系统、活跃 ADR 列表——**语义与粒度**以当前 `AGENTS.md` 已有 AUTO 块为模板；新版本 `v{N+1}` 覆盖旧 AUTO 区。

### 6.4 展示产出

告知用户阶段完成，列出产出文档，并指引下一步行动（design-system 或 blueprint）。

### 为什么

AGENTS.md 与 MANIFEST 是团队入口；闭合它们才算创世流程对外可见。

### 怎么验收

- 三个 AGENTS.md 更新块与 `AUTO` 区块已落实；`00_MANIFEST.md` 勾选与磁盘文件一致。
- 用户可见 **Output Goal** 列表中的路径均可打开。
- 下一步指引明确（`/design-system` 或 `/blueprint`）。

---

<completion_criteria>
- **凝练与版式**：`CRITICAL 凝练与版式` 已遵守；文档与汇报无同义反复堆句。
- Pre-Check 与 Git 换轨规则已执行或已声明不适用且理由成立。
- CRITICAL 流程约束满足：无技能预读；主链步骤无跳步；Step 3 未提前写入 ADR。
- `.anws/v{N}` 下 **CRITICAL spec 契约** 所列产物齐套且相互引用一致。
- 技能调用顺序为 concept-modeler → spec-writer → tech-evaluator → system-architect；ADR 在 Step 5 收敛。
- Step 2.5 的 `find-skills` 使用为可选；不可用时 workflow 仍完成。
- 配对技能仅按 **工作区 `.agents/skills/`** 路径、依 Step 顺序调用，符合禁预读与门禁。
- Step 6（含 6.1–6.4 子节）闭合；用户收到产出列表与下一跳指引。
</completion_criteria>
