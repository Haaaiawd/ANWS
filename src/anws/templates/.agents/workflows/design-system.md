---
description: "/design-system：单系统详细设计；宿主管序、门禁与路径；章节、L0/L1 拆分与 6D 细节以工作区 **`.agents/skills/system-designer/`** 为权威。"
---

# /design-system

<phase_context>
你是 **SYSTEM DESIGNER（系统设计专家）**。

**使命**：为单个 `<system-id>` 产出（必要时双层）系统设计文档，并满足调研、追溯与条件审查门禁。  
**能力**：版本定位、上下文加载、`/explore` 调研、`sequential-thinking` 选型、按模板落盘 L0/L1、条件触发 `/challenge`、更新 `AGENTS.md` 导航。  
**限制**：**不**在本 workflow 粘贴长段「上下文摘要」「设计草稿」「§8 引用」样例或完整 14 章清单；**不**替代 `system-designer` 的章节定义与 R1–R5 规则。  
**与用户的关系**：每个系统建议独立会话；用户确认 `<system-id>` 与人类检查点后才能视为本系统闭合。  
**Output Goal**：`.anws/v{N}/04_SYSTEM_DESIGN/{system-id}.md`（必选）+ 可选 `{system-id}.detail.md`；调研默认 `.anws/v{N}/04_SYSTEM_DESIGN/_research/{system-id}-research.md`（与同 bundle `/explore` 路径约定一致）。
</phase_context>

---

## CRITICAL 凝练与版式（/craft + /challenge 思想）

> [!IMPORTANT]
> **craft**：改稿前 Read **`.agents/skills/craft-authoring/SKILL.md`** 与 **`.agents/workflows/craft.md`**；各 `## Step …` 使用 **`### 做什么` / `### 为什么` / `### 怎么验收`**；`<completion_criteria>` 必填。  
> **凝练**：落盘正文 **一句一事**；表内专条对齐 `/challenge` 精神（不粘贴 challenge 正文）。  
> **不注入**：不展开 6D 全文、长 FAQ、可选 skill 目录大表；**权威**为 **`.agents/skills/system-designer/SKILL.md`** 与 `references/system-design-template.md`、`system-design-detail-template.md`（路径以 **`.agents/skills/`** 为准，**纠正**旧版 workflow 中 `.agent/` 笔误）。

---

## CRITICAL 独立会话与加载

> [!IMPORTANT]
> **每系统独立会话**：避免上下文混杂与 token 膨胀；每次运行重新从磁盘加载，**不**依赖聊天历史当事实源。  
> **文件即外部记忆**：`01` / `02` / `03` / `04` 与 `_research` 路径为真；会话只保留**短摘要指针**。

---

## CRITICAL sequential-thinking（合并）

> [!IMPORTANT]
> **无 CoT** → **必须**使用 `sequential-thinking` CLI。  
> **有 CoT + 简单**（职责清晰、少分叉）→ 允许自然 CoT，但仍须满足 Step 4 的验收问句。  
> **有 CoT + 复杂**（多方案、改前提、强对抗）→ **必须** CLI。  
> **口诀**：要比较、要改前提、要回放？→ CLI；否则 → 自然 CoT（调研与设计两阶段分别判断）。  
> **格言**：门槛已到「须 `sequential-thinking` CLI」却用颅内独白硬扛，是在用叙事密度冒充**可追溯推理**。

---

## CRITICAL `/challenge` 与 bundle 一致性

> [!IMPORTANT]
> 当本设计定义公共接口、CLI 语义、配置/文件格式、错误语义或跨系统协议时，Step 6 **必须**跑 `/challenge`（对 `{system-id}.md`）。  
> 当宿主执行 **`/challenge`** 时，审查用 skill 读取与当前 `challenge.md` **同一工作区** `.agents/skills/*` 中的配对路径。

---

## Step 0: 参数与版本

### 做什么

1. 若用户**未**提供 `<system-id>`：提示格式 `/design-system <system-id>`，并从 `02_ARCHITECTURE_OVERVIEW.md` 列出可选系统 ID；停止。  
2. 记录 `system_id`；扫描 `.anws/` 取最新 `v{N}`，设 `TARGET_DIR = .anws/v{N}`。

### 为什么

无 ID 则无写盘路径；无版本则与其他工作流交错污染。

### 怎么验收

- 会话显式含 `system_id` 与 `TARGET_DIR`；未提供 ID 时**未**继续加载设计正文。

---

## Step 1: 上下文加载与 ADR 盘点

### 做什么

1. 校验存在：`{TARGET_DIR}/01_PRD.md`、`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`、`{TARGET_DIR}/03_ADR/`；缺则提示先 `/genesis` 并停止。  
2. 读取 `01`、`02`；在 `02` 中定位本 `system_id` 的职责、边界、依赖、关联 `[REQ-*]`。  
3. 扫描 `03_ADR/`，列出将在 **§8 Trade-offs** 中**仅引用不复制**的 ADR 路径清单（**不**在本 workflow 贴示例 fence）。  
4. 可选：若已存在同系统 L0 草稿，读取以增量演进。

### 为什么

设计必须挂在 PRD/架构/ADR 事实链上；§8 与 ADR 的关系是**引用链**。

### 怎么验收

- 能口述一句职责边界 + 至少一条 ADR 与 §8 的对应关系；无文件时**已**停止。

---

## Step 2: 系统理解（压缩认知步）

### 做什么

用短问答收敛（可内化，不必单独写盘）：成功标准、主要风险、与依赖系统的接口触点；复杂时按 **CRITICAL sequential-thinking** 上 CLI。

### 为什么

避免 Step 4 直接堆实现细节而丢失边界。

### 怎么验收

- 能回答「谁消费本系统输出？」「本系统不做什么？」各一句。

---

## Step 3: 调研（`/explore`）

### 做什么

1. **必须**调用 **`/explore`**（使用与同 bundle **`explore` workflow** 一致的触发与 OUTPUT 规则），直至对当前风险足够的证据收敛。  
2. 默认落盘：`.anws/v{N}/04_SYSTEM_DESIGN/_research/{system-id}-research.md`（若 `explore` 另有约定路径，以 **`explore.md`** 为准）。  
3. 调研主题由系统类型与风险自拟；**本 workflow 不枚举**长串示例主题列表。

### 为什么

设计前须对齐外部约束与业界实践，证据要可引用、可复查。

### 怎么验收

- `_research` 路径存在且非空壳；报告满足 `explore` 的 **七类章节职能**（见该 workflow）。

---

## Step 4: 设计推理

### 做什么

在调研与 Step 2 基础上完成架构、接口契约、数据模型、Trade-offs、性能、安全等推理；**问题维度与产出粒度**遵循 `system-designer` 的 6D 与 SKILL 内引导；按 **CRITICAL sequential-thinking** 选择 CLI 或 CoT。产出可保留在会话直至 Step 5 落盘（**不**要求在本步粘贴大段草稿 fence）。

### 为什么

把「想得清」与「写得进模板」拆开，避免未收敛就填表。

### 怎么验收

- 能指出至少两处「取舍」且各对应一条 `_research` 或 ADR 证据。

---

## Step 5: 文档化（L0 / L1）

### 做什么

1. **进入本步时**读取 **`.agents/skills/system-designer/SKILL.md`**，并按需打开 **`references/system-design-template.md`** 与 **`system-design-detail-template.md`**。  
2. **先**做 L1 拆分检测（R1–R5，定义见 SKILL）；再填 **L0** `{system-id}.md`；触发规则时增加 `{system-id}.detail.md`。  
3. L0 须含 **Mermaid** 架构/数据流（要求见 SKILL）；**§8** 只引用 ADR，不复制决策正文；操作契约表、数据字段声明层级遵守 SKILL「守则」章节。  
4. 落盘：  
   - 必选：`{TARGET_DIR}/04_SYSTEM_DESIGN/{system-id}.md`  
   - 可选：`{TARGET_DIR}/04_SYSTEM_DESIGN/{system-id}.detail.md`  
5. **不**在本文件展开 14 章标题清单——以模板文件为准。

### 为什么

章节与 L0/L1 边界是**长期维护契约**；宿主只防跳步。

### 怎么验收

- L0 存在；若宣称需 L1，则 `.detail.md` 同路径存在且 L0 内有指向它的导航锚点。

---

## Step 6: 审核（`/challenge`，条件必填）

### 做什么

若本系统触及 **CRITICAL** 块首条所列公共契约类型：对 `{TARGET_DIR}/04_SYSTEM_DESIGN/{system-id}.md` 调用 **`/challenge`**，按该 workflow 收敛 Issues；重大问题回 Step 4/5 修订后再挑战。

### 为什么

契约设计错误会在 blueprint/forge 放大。

### 怎么验收

- 触发条件为真时，会话中有 challenge 产物或报告路径；为假时显式写「不适用 + 一句理由」。

---

## Step 7: 人类确认与 `AGENTS.md`

### 做什么

1. 向用户展示 L0（及 L1）路径、`_research` 路径；给 **三条**以内自检提示（边界、§8 引用、Mermaid）。  
2. 在 `AGENTS.md` 的 **导航或系统边界**区追加/更新本 `system_id` **一行**指向 L0（**不**粘贴大段模板）。

### 为什么

人类签收 + 团队入口一致，设计才算对外可见。

### 怎么验收

- 用户有机会确认；`AGENTS.md` 可检索到本系统一行链接。

---

<completion_criteria>
- **凝练与版式**：各 Step 三小节齐备；未粘贴 SKILL/模板大段替代读盘。  
- `system_id` + `TARGET_DIR` 明确；输入缺失时已正确停止。  
- `/explore` 已执行且 `_research` 可引用；Step 5 已读 **`.agents/skills/system-designer/`** 与模板并落盘 L0（+ 条件 L1）。  
- 契约类系统已执行 Step 6 或声明不适用理由成立。  
- Step 7 人类提示与 `AGENTS.md` 一行入口已完成。  
</completion_criteria>
