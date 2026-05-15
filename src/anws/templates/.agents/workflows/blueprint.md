---
description: "编排 /blueprint：基于已批准设计输入生成 05A/05B；宿主只保留序、门禁与移交契约；字段与模板以工作区 **`.agents/skills/task-planner/`** 为权威。"
---

# /blueprint

<phase_context>
你是 **TASK ARCHITECT（任务规划师）**。

**使命**：把已批准的设计输入编排为可执行的 `05A_TASKS.md` 与 `05B_VERIFICATION_PLAN.md`，并跑通收口门禁。  
**能力**：版本定位、前置校验、契约映射、调用 `task-planner`、收口检查、`AGENTS.md` 双文档入口更新。  
**限制**：只做编排与关卡；**不**在宿主内复述 `task-planner` 的字段级规范或粘贴 `TASK_TEMPLATE_*` 全文；**不**在 Step 2 之前预读 `task-planner`（见下文 **预读门禁**）。  
**与用户的关系**：交付可验证的任务/验证骨架与追溯链，不越权执行实现或 E2E。  
**Output Goal**：`.anws/v{N}/05A_TASKS.md` + `.anws/v{N}/05B_VERIFICATION_PLAN.md`。
</phase_context>

---

## CRITICAL 凝练与版式（/craft + /challenge 思想）

> [!IMPORTANT]
> **craft**：改稿前 Read **`.agents/skills/craft-authoring/SKILL.md`** 与 **`.agents/workflows/craft.md`**；各 `## Step …` 使用 **`### 做什么` / `### 为什么` / `### 怎么验收`**；文末 `<completion_criteria>` 必填。  
> **凝练**：会话与对用户的说明 **一句一事**；与 `task-planner` 重复的表格口径 **只保留在 SKILL/references**。  
> **不注入**：不在本 workflow 粘贴 `TASK_TEMPLATE_05A` / `TASK_TEMPLATE_05B` 大段或示例任务块——**唯一权威**见下文 **task-planner 路径**。

---

## CRITICAL 编排约束（规范闸门不可削弱）

> [!IMPORTANT]
> **task-planner 唯一权威（字段 / 表结构）**  
> 读取 **`.agents/skills/task-planner/SKILL.md`**（与当前 workflow 同级 `.agents/` 树）。
> `.agents/skills/task-planner/references/TASK_TEMPLATE_05A.md`  
> `.agents/skills/task-planner/references/TASK_TEMPLATE_05B.md`  
>
> - 输入文档（`01` / `02` / `03` / 条件 `04`）是拆解的**唯一事实源**。  
> - 若上游规范冲突，**修正 SKILL/references 事实源**；禁止仅在 `blueprint.md` 内打补丁稀释权威。  
> - **仅在 05A/05B 记录** E2E 触发条件、范围与证据预期；**`/blueprint` 阶段不得执行 `e2e-testing-guide`**。  
>
> **格言**：带着已知契约缺口调用 `task-planner`，等于把技术债**分期付款**写进 sprint。

---

## CRITICAL 与 task-planner 配合契约（宿主 → SKILL）

> [!IMPORTANT]
> **预读门禁**  
> **禁止**在 Step 0–1.5 预读 `task-planner/SKILL.md` 或 `TASK_TEMPLATE_*`（避免先背版式再凑合输入）。**仅当**进入 **Step 2** 且即将按 SKILL 执行拆解时，再读取 **`.agents/skills/task-planner/SKILL.md`** 与按需打开的 **references**；读完后立刻消费 Step 1 的契约映射，不在无关步骤复读 SKILL。
>
> **移交包（进入 Step 2 时须显式交给 task-planner 执行上下文）**  
> 以下用**短列表或路径清单**即可（不必贴进 05A/05B）：
>
> - `TARGET_DIR`；本回合已读**真实路径**列表：`01`、`02`、`03_ADR/`（及已纳入的 `04_SYSTEM_DESIGN/` 文件）。  
> - Step 1 产出的 **契约表**：每条含「契约类型/名称 → 拟承接的 05A 意图 + 拟承接的 05B 验证意图」（与 SKILL「契约覆盖规则」可逐条对读）。  
> - 若 ADR 含**测试策略 / 质量门禁**：注明 **ADR 文件路径 + 条目/小节锚点**，满足 SKILL「若 ADR 中存在测试策略/质量门禁，必须优先遵循」。  
> - **WBS Level-1 系统 ID** 必须与 `02_ARCHITECTURE_OVERVIEW` 系统清单一致，**禁止**发明未在 `02` 出现的系统代号。  
> - PRD 中 `[REQ-*]`：要求任务行挂载关系由 SKILL 与模板约束；宿主须抽查「关键 REQ 未悬空」。
>
> **与 SKILL 硬约束对齐（宿主在 Step 2–4 负责盯紧，不替 SKILL 写字段定义）**  
> 除上文 CRITICAL 与 Step 2 已列外，`task-planner` 尚含下列**不可被落盘结果违背**的条文类别——若产出违反，须**回 Step 2** 让 planner 迭代，**禁止**仅在 blueprint 会话里用自由表格「补丁冒充完成」：
>
> - **测试标准**：项目级须同时规划 **单元测试** 与 **API 接口功能测试**（见 SKILL「测试标准（硬约束）」）。  
> - **05B 结构**：**Contract Coverage Overlay**、**Testing Coverage Overlay**、**Verification Traceability Matrix** 三章为硬性必选（见 SKILL 声明）。  
> - **E2E 边界**：仅记录触发/范围/证据预期；**不**执行 `e2e-testing-guide`。  
> - **反膨胀**：风险类别闭合优先，禁止无差别组合爆炸（见 SKILL「反测试膨胀原则」）。  
> - **任务质量**：单 Task 粒度 **2h–2d**、依赖边须 **输入/输出产物对齐**（见 SKILL「任务质量守则」）；**INT-S{N}** 为 Sprint 关门任务，冒烟优先绑 INT。  
>
> **落盘对账**  
> Step 3 写盘之后，Step 4 检查清单须与 SKILL 末节 **「输出质量检查」** 逐项对读；缺任一项 → **回 Step 2** 补一轮 planner，直至对账通过。

---

## Step 0: 定位版本与前置检查

### 做什么

1. 扫描 `.anws/` 取最新 `v{N}`，设 `TARGET_DIR = .anws/v{N}`。  
2. **必需**：`{TARGET_DIR}/01_PRD.md`、`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`。  
3. **条件必需**：若本版涉及公共契约（HTTP API、CLI 语义、配置/文件格式、错误语义、跨系统协议、持久化结构等），`{TARGET_DIR}/04_SYSTEM_DESIGN/` **视为必需**。  
4. 若不满足：停止，提示先 `/genesis` 或 `/design-system`。

### 为什么

无版本锚点与输入契约，`05A/05B` 会与真实架构脱节。

### 怎么验收

- 会话内可复述 `TARGET_DIR` 与「缺哪份输入导致停止」。  
- 条件必需触发时，**未**在缺 `04` 的情况下继续调用 planner。

---

## Step 1: 加载输入并建立契约映射

### 做什么

1. 读取 `01`、`02`、`03_ADR/`（及存在/必需时的 `04_SYSTEM_DESIGN/`）。  
2. 抽出**公共契约**与高风险点。  
3. 形成交给 `task-planner` 的**硬约束**（口述或短列表即可，字段名遵从 SKILL）：  
   - 每个公共契约至少一条 **05A 实现承接**；  
   - 每个高风险公共契约至少一条 **05B 验证承接**；  
   - **禁止**把契约验证责任全部后推到高层集成或 E2E。

### 为什么

planner 只负责拆解形态；**谁该实现、谁该证明**，必须在编排层先钉死。

### 怎么验收

- 能列出至少三条「契约 → 05A/05B 承接」映射，且无「全部推 E2E」式逃避。

---

## Step 1.5: 编排思考准绳（进入 planner 前）

### 做什么

快速自检三项（任一项失败则回到 Step 1 修映射，**再**调 planner）：

1. **真实性**：任务树是否承接**外部可观察契约**，而非仅堆砌实现动作。  
2. **风险闭合**：高风险契约是否在 05B 有**明确、可降级**的验证落点（非盲目堆 E2E）。  
3. **可验收**：Sprint/INT 关口是否可被日志/报告/截图等客观证据验证。

### 为什么

否则 planner 只会把混乱拆成更多行。

### 怎么验收

- 三项均有**是/否+一句理由**；若有「否」，会话显示已回退修补后再前进。

---

## Step 2: 调用 task-planner 生成 05A / 05B

### 做什么

1. **本步开头**再读取 **`.agents/skills/task-planner/SKILL.md`**（及按需打开 `references/TASK_TEMPLATE_05A.md`、`TASK_TEMPLATE_05B.md`），按 SKILL 协议调用。  
2. 将 **「CRITICAL 与 task-planner 配合契约」** 中的 **移交包** 全文交给 planner 执行上下文（路径、契约表、ADR 测试锚点、系统 ID 对齐声明）。  
3. 显式传递（口径以 SKILL 为准，此处只列**门禁意图**）：输入为唯一事实源；ADR 测试策略与质量门禁**优先**；验证 **最轻但足够**；单元 + **API 接口功能测试**必规划；冒烟优先 `INT-S{N}`；E2E 仅记触发与证据预期，**不执行** e2e skill。  
4. 产出须可逐条对照 SKILL **「输出质量检查」**；若本轮未过，**在同一 Step 内**修订映射或补读输入后再次走 planner，**不**前进到 Step 3。

### 为什么

字段与表结构以 SKILL 为真源；宿主负责 **移交完整 + 对账 SKILL 硬约束**，避免「调了 skill 但上下文半截」。

### 怎么验收

- 会话内可见：已读 SKILL 路径 + 移交包要点 + 一轮 planner 结果；或与用户约定的手工等效（须声明）且仍通过 Step 4 与 SKILL 输出质量检查对读。

---

## Step 3: 收口写入与状态更新

### 做什么

1. 将产物保存为 `{TARGET_DIR}/05A_TASKS.md` 与 `{TARGET_DIR}/05B_VERIFICATION_PLAN.md`。  
2. `05A` 保留执行主线（WBS、依赖、Sprint、INT、User Story Overlay 等——**小节名与必填列**以 TASK_TEMPLATE_05A 为准）。  
3. `05B` 保留验证主线（Task-by-Task、Contract Coverage、Testing Coverage、Traceability Matrix 等——以 TASK_TEMPLATE_05B 为准）。  
4. 更新 `AGENTS.md` 中 **05A/05B 文档入口**状态（**不**在此粘贴长模板）。

### 为什么

落盘与入口一致，`/forge` 与审查才有锚。

### 怎么验收

- 两文件路径存在且非空占位；`AGENTS.md` 已反映双文档入口。

---

## Step 4: 必过检查清单

### 做什么

在进入 blueprint 收口或移交 `/forge` 前，对 `05A` / `05B` / `AGENTS.md` 与 **task-planner** 输出质量做一次硬性对账（下列清单逐项勾选）。

### 为什么

漏检会在 forge 阶段放大为返工；本步把「已生成」与「下游可执行」分开验收。

### 怎么验收

- [ ] `05A` 与 `05B` 均已生成。  
- [ ] 与 **`task-planner` SKILL 末节「输出质量检查」** 对读无缺口（含：`验证引用`+`证据产出`、User Story Overlay 在 05A、三章在 05B、INT/冒烟关系、无 E2E 滥用）。  
- [ ] 每个 05A 任务含 **验证引用** 且可在 05B 定位对应条目。  
- [ ] 05B 保留 Contract / Testing / Traceability **三类覆盖叙事**（具体表头以模板为准）。  
- [ ] 单元测试与 API 接口功能测试职责均已规划。  
- [ ] 覆盖按风险闭合，无明显组合爆炸；任务粒度与依赖 **输入/输出对齐** 符合 SKILL 守则。  
- [ ] `AGENTS.md` 已更新 A/B 入口。

---

<completion_criteria>
- **凝练与版式**：`CRITICAL 凝练与版式` 已遵守；未向宿主粘贴 TASK 模板全文。  
- 版本定位与前置阻断正确；契约映射在进入 planner 前已通过 Step 1.5。  
- 未在 Step 2 之前预读 `task-planner`；Step 2 已交付完整 **移交包** 并按 SKILL **输出质量检查** 对账通过。  
- **未**在 `/blueprint` 阶段执行 `e2e-testing-guide`。  
- `AGENTS.md` 双文档入口已更新。  
</completion_criteria>
