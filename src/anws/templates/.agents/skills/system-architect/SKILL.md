---
name: system-architect
description: `/genesis` Step 4 专用：识别独立系统、定义边界与依赖，产出 `.anws/v{N}/02_ARCHITECTURE_OVERVIEW.md`（含源码根目录与物理结构）；为 Step 5 ADR 与后续 `references/rfc_template.md` 级契约提供输入，本人不写入 `03_ADR/*.md`。
---

# system-architect（/genesis Step 4–5 衔接）

> 好的架构多半是「把问题拆成对的系统」，而不是造出完美单片。

<phase_context>
你是 **`/genesis` Step 4 的系统架构师**。  
**使命**：在版本化目录 `TARGET_DIR = .anws/v{N}` 内，产出可执行的系统清单、边界、依赖图与物理代码树根映射。  
**能力**：六维识别、C4 Level 1 与依赖可视化、与人类检查点 #2 对齐的拆分理由与复杂度自述。  
**限制**：严守 genesis 既定步骤序位；**不得**在本 skill 会话内写入或篡改 `03_ADR/*.md`、`01_PRD.md`、任务清单（ADR 只属于 **Step 5**）；不得削弱下文 CRITICAL、严重度表、RFC/ADR 分工与 Overview 模板结构。  
**与子流程关系**：以工作区 **`.agents/skills/system-architect/SKILL.md`** 为准。
</phase_context>

---

## CRITICAL 方法论锚点

> [!IMPORTANT]
> **拆解的目标是决策记录与实现可对齐的边界**，不是堆系统名。
>
> - **唤醒，不是宣告**：先还原 PRD 范围与 tech-evaluator Step 3 已定约束，再给系统清单；跳过约束还原的拆分易与后续 ADR 冲突。  
> - **展开，不是单线**：每个系统条目必须可被「部署单元 / 技术栈 / 职责」中的至少两类独立支撑；单依据拆分须显式记入风险与验证债。  
> - **升维，再落地**：先把跨系统接缝（契约、故障语义、所有权）说清楚，再落 `system-id`、目录树与矩阵；停在目录隐喻或停在口号都不可交付。  
> - **重建，而非复述**：用边界矩阵重建「谁在什么输入下承诺什么输出」，而非改写 PRD 原句。

---

## CRITICAL spec 产出契约（`02_ARCHITECTURE_OVERVIEW.md`）

> [!IMPORTANT]
>
> - **精确**：每条系统须含稳定 **`system-id`**、`职责`、`边界(I/O)`、`依赖`、`关联需求 REQ 引用`、`技术栈`、`设计文档相对路径占位`（与模板一致）；物理映射须给出**可追溯**源码根路径（字面路径字符串）。  
> - **有据可查**：矩阵与依赖图中的每一行须有对应清单小节支撑；禁止只写图表无文字定义。  
> - **可检验**：拆分理由章节须同时回答「为何不继续拆 / 为何不合并」各至少一例，且与复杂度评估相呼应。  
> - **禁止填充**：禁止无对象的「待定」「后续优化」「视情况而定」占位；未知须标为 **`[OPEN: 具体问题 + owner 粒度]`**。  
> - **双图强制**：Must include Mermaid **系统上下文（C4 L1）** 与 **系统依赖图**，且与矩阵无矛盾。

---

## CRITICAL：`/genesis` 序位与 ADR/RFC 发射分工

> [!IMPORTANT]
> **`/genesis` 强制顺序为 Step 0→6（末步 Step 6 含子节 6.1–6.4）；禁止跳步。** 本 skill 仅覆盖 **Step 4**。  
>
> **本 skill（Step 4）唯一目标路径**：写入 **`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`**（结构与下文模板章节一致）；并落实 Step 4 专属的 **源码根目录 + ASCII 物理结构树**（见模板与阶段说明）。  
> **禁止**：将 Step 3 评估表直接改名为 ADR 落盘；不得在本 skill 写入 `{TARGET_DIR}/03_ADR/*`。ADR 正文发射归 **`/genesis` Step 5**，且须基于 Step 3 候选方案对比表与 Step 4 系统边界成文。  
> **RFC（技术设计说明）**：面向单系统深挖时，使用本 skill **同仓库 skill 包的** `references/rfc_template.md` 作为结构权威；`/genesis` 主路径不强制每一步都产出 RFC——**系统设计文档路径**记在 Overview 每条目的「设计文档」字段，RFC 可作 `04_SYSTEM_DESIGN` 的前置草稿，**不作为本 Step 必选落盘**。  
> **ADR 写入检查清单（供 Step 5 执行核对；本 Step 只做输入，不勾选为已写完）**：  
>
> | 门禁项 | 规范 |
> |--------|------|
> | ADR 与 Step 3 对齐 | Step 5 须将 Step 3 候选方案对比表吸纳为候选方案章节与决策 |
> | Step 2.5 回填 | 若曾执行 `/explore`，Step 5 须在理由与取舍中吸纳研究证据 |
> | ADR 状态 | **Accepted** |
> | 「影响范围」章节 | Must exist；须列出引用本 ADR 的系统占位（可由 Step 6 后与 SYSTEM_DESIGN 交叉维护） |
> | ADR 结构 | Follow `tech-evaluator` **`references/ADR_TEMPLATE.md`** 全章节（模板见下文规范摘要） |

**ADR_TEMPLATE 章节不可删节（摘录为发射规范；正文撰写在 Step 5）**：

| 章节 | 必须满足 |
|------|----------|
| 状态 | Proposed \| Accepted \| Deprecated \| Superseded … |
| 日期 | `YYYY-MM-DD` |
| 背景 | 问题、约束、干系期望 |
| 决策驱动因素 | 编号列表 |
| 候选方案 | 多方案利弊对照 |
| 决策 | 明确选定方案 |
| 后果 | 正/负/后续行动拆分 |
| 参考资料 | 可空但不得删除标题行 |
| 影响范围 | 列出将引用本报的系统 / 文档路径占位 |

---

## CRITICAL：`sequential-thinking`

> [!IMPORTANT]
> **必须**在开始列举系统-ID 之前，使用 `sequential-thinking`：**3–7 个 thought**（复杂度低取 3，高耦合或多端取 7），覆盖拆分/合并备选、演进与物理边界；自然 CoT **不可**顶替该 CLI 义务（无 CLI 时输出首段须声明 **`SEQUENTIAL_THINKING_BLOCKED`**，并降级为可追溯的条目化假设清单，禁止伪造 thought）。

---

## 严重度分级（Overview 自检 / 与人类检查点 #2）

| 等级 | 判定标准 | 所需行动 |
|------|----------|----------|
| **Critical** |  Overview 与 PRD 覆盖范围矛盾；系统边界导致无法实现需求；遗漏 genesis 要求的物理根路径 / 必备图 | Step 5 以前必须修复 |
| **High** |  依赖环路；跨系统契约完全空白；拆分粒度过极端（单机式或碎片化）且无理由 | forge 前应修复或通过 ADR / 增补设计闭合 |
| **Medium** |  边界措辞含糊但可解码；单侧依赖偏多但可重构 | Step 或设计阶段清偿 |
| **Low** |  文档措辞、排序、格式 | 可持续改进 |

---

## 子代理编排

**父代理（`/genesis` 宿主会话）**：拥有 `TARGET_DIR`、写入 `02_ARCHITECTURE_OVERVIEW.md` 的最终版本、与人类检查点的呈现节奏、以及是否触发 Step 5 的最终路由。  
**子代理（若可用）**：可接收切片「仅产出六维草稿 / 仅产出 Mermaid / 仅审计矩阵一致性」；**不得**独自定稿同名路径文件。  

**闭环交接清单**（子代理交回父代理前自检）

- [ ] 已声明 **写入 / 不落盘仅建议** 与一行原因  
- [ ] 所有系统-ID 在全篇唯一；矩阵与依赖图对齐  
- [ ] **未**触碰 `03_ADR/`、`01_PRD.md`  
- [ ] Critical/High 项已逐项上报父代理裁决  

---

## 顶级阶段：`/genesis` Step 4（含 Step 5 输入预备）

以下五阶段对应 Step 4 执行包；完成后父工作流进入 **Step 5 ADR 发射**（非本 skill 直接写入）。

### 阶段 A：输入与时间轴锚定

**做什么**：确认 `TARGET_DIR`；载入 `01_PRD.md`、`concept_model.json`（若存在）、Step 3 评估结论（内存或摘要）；摘录 `[REQ-*]`。  
**为什么**：无对象拆解产生「架构散文」。  
**怎么验收**：能列出 PRD 与 Step 3 中与部署/运行时相关的硬性约束不少于 3 条；Thought 序号已按计划执行。

### 阶段 B：六维系统识别（合成候选清单）

**做什么**：逐项扫 **用户触点 / 数据存储 / 核心逻辑 / 外部集成 / 部署单元 / 技术栈**，生成候选 **`system-id` 草案**。  
**为什么**：穷尽维度降低漏系统风险。  
**怎么验收**：六维皆有显式条目或标注 `N/A` 理由一行；草案数量落入 **3–10** 或可辩护的极少数例外。

### 阶段 C：边界、依赖与需求追溯

**做什么**：对每个系统写清 **I/O 边界**；建立 **边界矩阵 + 依赖图**；挂载关联需求 ID。  
**为什么**：接缝是 ADR 与后续设计的着力点。  
**怎么验收**：矩阵行数与清单一致；图上每条边在两系统条目中各出现一次且无环（若有环须在理由段解释接受条件）。

### 阶段 D：物理代码结构映射（`/genesis` Step 4 CRITICAL）

**做什么**：**每个系统**：**源码根路径**（如 `src/packages/frontend`）+ **ASCII 目录树**。  
**为什么**：克隆与 IDE 导入依赖物理真相。  
**怎么验收**：树中不出现「TBD-only」而无 `[OPEN]` 记录；路径与单体/多仓假设一致。

### 阶段 E：成文、`02_*` 落盘与 Step 5 就绪交接

**做什么**：按下方 **输出格式模板**填满 `02_ARCHITECTURE_OVERVIEW.md`；自检严重度表；为人类检查点 #2 准备一页执行摘要（可附文末 shortlist）。  
**为什么**：ADR 必须与稳定系统边界对齐。  
**怎么验收**：模板 §1–8 齐全；`High` 以上问题数显式归零或升格为 **`[OPEN]`** 并得到父代理接受；父代理已知下一步须跑 **Step 5**。

### Step 5 输入就绪（宿主执行；本 skill 校对清单）

**做什么**：移交 **系统-ID 全集**、**跨系统疑点**、`[OPEN]`、`Step 3` 对比表指针。  
**为什么**：ADR 必须引用真实边界与备选方案来历。  
**怎么验收**：`tech-evaluator` ADR_TEMPLATE 可被无冲突填充；ADR「影响范围」可预填系统占位。

---

## 核心原则

> [!IMPORTANT]
> **关注点分离**：一系统一事；**边界清晰**：I/O 与数据契约显式；**适度拆分**：避免 **>10** 系统且无理由，禁止 **无端单系统**。  
>
> **反模式**：每功能一系统 / 巨石无界 / 跨层叠责 / 「前端后端混一栏不分」  
> **正例**：按技术栈、部署单元、职责边界、变更频率论证拆分或合并  

---

## 系统识别框架：6 维度（执行扫表）

### 1. 用户触点

Web / Mobile / CLI / API Gateway…… → 通常映射独立 `*-system`。异栈或异部署触点 **不得**强行合并为一个 ID。

### 2. 数据存储

数据库、缓存、对象存储、搜索；可合并仅在 **同一运维边界 + 共用访问模式 + 拆分无独立生命周期** 时，并记入理由。

### 3. 核心业务逻辑

API、Agent、Pipeline、Batch；不同演进速率与 SLA 的常见拆点。

### 4. 外部集成

OAuth、支付、LLM；默认归入主导系统边界，仅在集成复杂度自持生命周期时升格独立系统-ID。

### 5. 部署单元

CDN 静态 / 容器服务 / Worker；**一对一映系统候选**最常见。

### 6. 技术栈

栈差异本身是强分解信号（例：React + FastAPI + PG → 至少三系统维度上的边界）。

---

## 输出格式：Architecture Overview 模板

使用以下结构产出 **`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`**：

```markdown
# 系统架构总览 (Architecture Overview)

**项目**: [Project Name]
**版本**: 1.0
**日期**: [YYYY-MM-DD]

---

## 1. 系统上下文 (System Context)

### 1.1 C4 Level 1 - 系统上下文图

[使用Mermaid绘制系统与用户、外部系统的交互]

\`\`\`mermaid
graph TD
    User[用户] -->|HTTP| WebApp[Web应用]
    WebApp -->|API| Backend[后端服务]
    Backend -->|Query| DB[(数据库)]
    Backend -->|Call| LLM[LLM API]
\`\`\`

### 1.2 关键用户 (Key Users)
- **终端用户**: 使用Web界面的用户
- **管理员**: 管理系统配置的用户
- ...

### 1.3 外部系统 (External Systems)
- **LLM API**: OpenAI / Anthropic
- **认证服务**: Auth0 / OAuth
- ...

---

## 2. 系统清单 (System Inventory)

### System 1: Frontend UX System
**系统ID**: `frontend-system`

**职责 (Responsibility)**:
- 用户界面展示与交互
- API调用封装
- 客户端状态管理

**边界 (Boundary)**:
- **输入**: 用户操作（点击、输入）
- **输出**: HTTP API请求
- **依赖**: backend-api-system

**关联需求**: [REQ-001] 用户登录, [REQ-002] Dashboard展示

**技术栈**:
- Framework: React 18
- Build Tool: Vite
- Styling: TailwindCSS
- State: Context API / Zustand

**源码根目录**: `src/packages/frontend`

**仓库内物理结构 (ASCII)**:
```
src/packages/frontend/
  apps/
  components/
...
```

**设计文档**: `04_SYSTEM_DESIGN/frontend-system.md` (待创建)

---

### System 2: Backend API System
**系统ID**: `backend-api-system`

**职责 (Responsibility)**:
- REST API服务
- 业务逻辑处理
- 数据库交互

**边界 (Boundary)**:
- **输入**: HTTP请求 (JSON)
- **输出**: HTTP响应 (JSON)
- **依赖**: database-system, agent-system

**关联需求**: [REQ-001] 用户登录, [REQ-003] 数据查询

**技术栈**:
- Framework: FastAPI
- Language: Python 3.11
- ORM: SQLAlchemy
- Auth: JWT

**源码根目录**: `src/backend/api`

**仓库内物理结构 (ASCII)**:
```
src/backend/api/
  api/
  services/
...
```

**设计文档**: `04_SYSTEM_DESIGN/backend-api-system.md` (待创建)

---

### System 3: Database System
**系统ID**: `database-system`

**职责 (Responsibility)**:
- 数据持久化
- 数据查询与索引
- 数据备份与恢复

**边界 (Boundary)**:
- **输入**: SQL查询
- **输出**: 查询结果
- **依赖**: 无（基础设施）

**关联需求**: 所有需要数据存储的需求

**技术栈**:
- Database: PostgreSQL 15
- Cache: Redis 7
- ORM: SQLAlchemy

**源码根目录**: `infra/db` 或 `[schema/migrations path]`

**仓库内物理结构 (ASCII)**:
```
db/migrations/
...
```

**设计文档**: `04_SYSTEM_DESIGN/database-system.md` (待创建)

---

[继续列出其他系统...]

---

## 3. 系统边界矩阵 (System Boundary Matrix)

| 系统 | 输入 | 输出 | 依赖系统 | 被依赖系统 | 关联需求 |
|------|------|------|---------|----------|---------|
| Frontend | 用户操作 | HTTP请求 | Backend API | - | [REQ-001], [REQ-002] |
| Backend API | HTTP请求 | JSON响应 | Database, Agent | Frontend | [REQ-001], [REQ-003] |
| Database | SQL查询 | 查询结果 | - | Backend API, Agent | All |
| Agent System | 任务请求 | 执行结果 | Database, LLM API | Backend API | [REQ-005] |

---

## 4. 系统依赖图 (System Dependency Graph)

\`\`\`mermaid
graph TD
    Frontend[Frontend System] -->|API Call| Backend[Backend API System]
    Backend -->|Query| DB[Database System]
    Backend -->|Invoke| Agent[Agent System]
    Agent -->|Query| DB
    Agent -->|Call| LLM[LLM API - External]
    
    style Frontend fill:#e1f5ff
    style Backend fill:#fff4e1
    style DB fill:#e1ffe1
    style Agent fill:#ffe1f5
\`\`\`

**依赖关系说明**:
- Frontend依赖Backend（前后端分离架构）
- Backend是核心枢纽，协调Database和Agent
- Agent独立完成推理任务，但需要Database支持

---

## 5. 技术栈总览 (Technology Stack Overview)

| Layer | Technology | Used By |
|-------|-----------|---------|
| **Frontend** | React, Vite, TailwindCSS | Frontend System |
| **Backend** | Python, FastAPI, SQLAlchemy | Backend API System |
| **Database** | PostgreSQL, Redis | Database System |
| **Agent** | LangGraph, OpenAI | Agent System |
| **Infrastructure** | Docker, Kubernetes | All Systems |

---

## 6. 拆分原则与理由 (Decomposition Rationale)

### 为什么拆分为这些系统？

**技术栈维度**:
- Frontend (React) vs Backend (Python) → 技术栈完全不同，必须分离

**部署维度**:
- Frontend (静态部署CDN) vs Backend (容器部署) → 部署方式不同

**职责维度**:
- Backend API (业务逻辑) vs Agent (推理逻辑) → 职责独立，可并行开发

**变化频率**:
- Frontend (UI变化频繁) vs Database Schema (相对稳定) → 分离便于独立演进

### 为什么不进一步拆分？

**Frontend为什么不拆分为多个系统？**
- 虽然有多个页面，但共享状态和组件，拆分会增加复杂度

**Backend为什么不拆成微服务？**
- 当前规模不需要，Modular Monolith足够
- 可以通过模块化代码结构实现关注点分离

---

## 7. 系统复杂度评估 (Complexity Assessment)

**系统数量**: 4个系统

**评估**:
- 数量合理 (< 10)
- 边界清晰
- 依赖关系简单（无循环依赖）

**潜在风险**:
- Backend API可能成为瓶颈（协调多个系统）
- 未来可能需要拆分Backend（当代码量 > 50K行时）

---

## 8. 下一步行动 (Next Steps)

### 为每个系统设计详细文档

运行以下命令为每个系统创建设计文档：

\`\`\`bash
/design-system frontend-system
/design-system backend-api-system
/design-system database-system
/design-system agent-system
\`\`\`

### `/genesis` Step 5 提醒（宿主）

- 宿主应基于 Step **3 + 本文件**写入 `03_ADR/ADR_001_TECH_STACK.md` 及其他跨系统决策，结构遵循 `ADR_TEMPLATE.md`。

### `/blueprint` 前置（整体设计完成后）

\`\`\`bash
/blueprint
\`\`\`
```

---

## 拆解守则

### 守则1：不要过度拆分

**规则**：系统数量通常 **< 10**。拆分须带来独立部署价值、生命周期或技术栈差异之一。

### 守则2：不要过度聚合

**规则**：前端、后端、数据库**通常**为三套独立系统-ID（可有例外但必须 ADR 级论证）。

### 守则3：边界必须清晰

**规则**：每条目 **输入 / 输出 / 序列化语义**（至少到「JSON/Event/SQL」一级）可查。

### 守则4：使用 C4 + Mermaid 可视化

**规则**：上下文图 + 依赖图与矩阵一致。

---

## RFC（`references/rfc_template.md`）结构契约 — 节选规范

仅在需要补足 **API / 函数签名 / DDL** 粒度时使用；**章节骨架不得删**。  

| RFC 必选块 | 规范 |
|-----------|------|
| 高层设计 + Mermaid | 数据流与组件层级可追溯 |
| API 契约 / 函数接口 | **精确签名**，禁止占位符冒充已定契约 |
| 数据模型策略 | DDL 变更或等价声明 |
| 实施步骤 | 原子、有序 |
| 安全与风险 | 认证、校验显式 |

> 全文模板见：**`.agents/skills/system-architect/references/rfc_template.md`**（若本地化 `references/`，须保持等价章节）。

---

## 工具箱

**识别 Checklist**：触点 / 存储 / 核心逻辑 / 外部集成 / 部署 / 栈 — 逐项勾。  
**落盘自检**：上文 **质量检查清单** + **严重度表**。

---

## 常见场景摘要

| 场景 | 系统（典型计数） |
|------|----------------|
| Web 三件套 | Frontend + Backend API + DB（3） |
| + Agent | + Agent（4） |
| 企业扩展 | Web + Mobile + Backend + DB + Search + Worker（≤6–8） |

---

## 质量检查清单

### 系统数量

- 典型 **3–10**；无功能级微观服务化；无私服式单栏

### 系统边界

- I/O + 契约粒度明确；职责单一且不交叉

### 依赖关系

- 无未解释环；Mermaid 可读出与矩阵等价信息；任一系统外向依赖不宜 **> 5** 而无缓解策略

### 文档完整性（Step 4）

- §1–8 **按模板齐备**  
- Physical root + ASCII tree **每系统**一笔  
- 拆分理由对冲问题已答

---

## CRITICAL：`/genesis` 集成提示（只读宿主条文摘要）

宿主 **Step 6** 会更新 **`AGENTS.md`** 与本 Overview 对齐；宿主 **禁止**在未完成 Step 5 时用 ADR 内容覆盖本节系统边界。**Git 分支换轨**仍以宿主 `genesis.md` 「Pre-Check」为准。

---

<completion_criteria>
- Architecture Overview **模板§1–8**（含边界矩阵与技术栈两张主表）、**拆解守则四章**、**严重度四章表**、**RFC 节选规范表 + ADR 发射分工 + ADR_TEMPLATE 章节表**均以规范形态保留且无 emoji。  
- **CRITICAL** 块齐备：**方法论锚点**、**spec 产出契约**、**genesis 序位与 ADR/RFC 分工**、**sequential-thinking**。  
- **子代理编排**与交接清单齐备；顶级 **五阶段 Step 4** + **Step 5 输入就绪** 均含「做什么／为什么／怎么验收」。  
- **phase_context** 已落地；文稿与约束口径一致（禁预读、单一路径）。
- 输出路径约定仍指向 **`{TARGET_DIR}/02_ARCHITECTURE_OVERVIEW.md`**。  
</completion_criteria>
