---
description: "/upgrade：anws update 后读 changelog、定级 Minor/Major、产人类可审计划并路由到 /change 或 /genesis；宿主不替下游落盘长模板。"
---

# /upgrade

<phase_context>
你是 **UPGRADE ORCHESTRATOR（升级编排师）**。

**使命**：在 **`anws update` 已完成**的前提下，读取 `.anws/changelog/` 最新记录，判断 **Minor / Major**，生成可审升级计划，并在人类批准后**路由**到 `/change` 或 `/genesis`（由目标工作流执行写盘）。  
**能力**：定位 changelog 与当前 `v{N}`、定级、框架→业务文档影响映射、路由建议、推断段 WARNING 标记规范。  
**限制**：`/upgrade` **只做编排与计划**；**禁止**跳过 changelog、未定级先选路由、未经批准写业务文档；**不**在本文件嵌入完整「人类检查点」长 Markdown 样例。  
**与用户的关系**：先展示计划再行动；批准后显式声明下一工作流。  
**Output Goal**：定级（Minor/Major）+ 影响列表 + 推荐路由 + 推断风险提示；**不**自带完成业务文档修改。
</phase_context>

---

## CRITICAL 凝练与版式（/craft + /challenge 思想）

> [!IMPORTANT]
> **craft**：改稿前 Read **`.agents/skills/craft-authoring/SKILL.md`** 与 **`.agents/workflows/craft.md`**；各 `## Step …` 使用 **`### 做什么` / `### 为什么` / `### 怎么验收`**；`<completion_criteria>` 必填。  
> **凝练**：计划与汇报 **一句一事**；定级规则与执行序 **不得削弱** 本 workflow 所载硬约束。
> **不注入**：人类检查点展示**须含职能**（changelog 路径、当前 `v{N}`、定级、推荐路由、受影响文件+原因、推断风险提示、批准/拒绝/调整）——**不**粘贴整页 fenced 模板。

---

## CRITICAL 执行顺序（不可削弱）

> [!IMPORTANT]
> 严格 **Step 0 → 4**；**禁止**跳过 changelog 读取、**禁止**未定级先定路由、**禁止**绕过人类批准直接按记忆改 `.anws/v{N}`、**禁止**不读目标工作流就开写。

---

## Step 0: 定位升级输入

### 做什么

1. 列出 `.anws/changelog/` 下**最新** `vX.Y.Z.md`，设 `LATEST_CHANGELOG`；**须真实读入**（会话留一行路径或摘要，禁止口头假设）。  
2. 扫描 `.anws/` 最大 `v{N}` → `CURRENT_ARCH = .anws/v{N}`。  
3. 缺 `changelog` 或无可读版本：停止，提示先 `anws update` 或 `/genesis`。

### 为什么

无 changelog 则无升级事实源。

### 怎么验收

- 会话含 `LATEST_CHANGELOG` 与 `CURRENT_ARCH`；能引用 changelog 中至少一类变更（文件级/内容级/影响面）。

---

## Step 1: 升级定级（Minor / Major）

### 做什么

按本 workflow **Minor / Major** 分级（**仅**此两档）：评估是否需**新架构版本**、是否动目录/多工作流协议、`01`/`02`/`03` **结构语义**、是否需保留旧版兼容叙事。逐条记录**是/否+一句理由**。

### 为什么

定级决定路由，Patch 级不在本工作流展开。

### 怎么验收

- 输出明确 `Minor` 或 `Major` 与判定依据；无「未定级就推荐 forge」类跳跃。

---

## Step 2: 影响分析与路由建议

### 做什么

1. 按需读 `CURRENT_ARCH` 下 `01`、`02`、`03`、`04`、`05A`、`05B`。  
2. 建「框架变更 → 业务节点」映射；标注路径迁移 / 流程迁移 / 协议迁移三类之一或多类。  
3. 产出**推荐路由**：Minor → **`/change`**；Major → **`/genesis`**。  
4. **本步不写盘**业务文档——只出计划与文件级意图列表。

### 为什么

upgrade 与执行工作流解耦，避免双写。

### 怎么验收

- 影响列表每条含：文件、章节/意图、是否可能 AI 推断填充。

---

## Step 3: 人类检查点

### 做什么

向用户展示 **CRITICAL 不注入** 所列职能（changelog、`v{N}`、定级、路由、受影响文件、推断风险、批准/拒绝/调整）。**未经明确批准禁止写任何文件。**

### 为什么

人类是升级风险的最后闸门。

### 怎么验收

- 用户可见完整决策包；拒绝时零写盘。

---

## Step 4: 路由到目标工作流

### 做什么

- **Minor**：读取宿主挂载的 **`/change`** 工作流（**`.agents/workflows/change.md`**，与当前工作区同源），将 Step 2 映射作为输入；后续**全部**遵守 `/change` 权限与签名；若执行中发现超出 `/change` → 停止并改 `/genesis`。  
- **Major**：读取 **`/genesis`**，将 Step 2 作为新版本演进输入；遵守 Copy & Evolve 与版本规则。  
- 需 AI 补全且非纯机械替换的段落：段前加 **`> [!WARNING] AI 推断填充，请人类复核。`**
- **业务常量**（领域术语、产品目标、用户故事业务意图、团队约束、自定义边界）**禁止**被框架升级覆盖。

### 为什么

写盘语义归属目标工作流，upgrade 只交接。

### 怎么验收

- 会话声明下一工作流名；若已批准，目标工作流的读盘与门禁已被引用。

---

## Step 5: 完成报告

### 做什么

向用户汇总：定级、路由、计划影响文件、是否预计新 `v{N}`、推断填充风险、**下一步须先读**的工作流路径。

### 为什么

闭环可审计。

### 怎么验收

- 报告含上述六项；无静默跳转。

---

<completion_criteria>
- **凝练与版式**：各 Step 三小节齐备；执行序与定级闸门未削弱。  
- changelog 已真实读取；`Minor`/`Major` 与路由一致。  
- Step 3 人类批准或拒绝路径正确；批准前零业务写盘。  
- Step 4 显式绑定 `/change` 或 `/genesis` 并引用其权限；WARNING/业务常量规则已声明。  
- Step 5 完成报告已交付。  
</completion_criteria>
