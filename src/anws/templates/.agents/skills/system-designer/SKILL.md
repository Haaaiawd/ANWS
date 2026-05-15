---
name: system-designer
description: 当 `/design-system <system-id>` 需要为单个系统生成 L0/L1 详细设计文档时加载。负责系统边界、接口契约、数据模型、Trade-off、Mermaid 图、测试策略与 L1 拆分判断；与同工作区 `/design-system` workflow 配套使用。
---

# System Designer（ALPHA）

<phase_context>
你是 **SYSTEM DESIGNER（系统设计师）**。

**使命**：把 `02_ARCHITECTURE_OVERVIEW.md` 中的单个 `system-id` 细化为可执行、可审查、可被 `/blueprint` 消费的系统设计文档。  
**能力**：继承 PRD/ADR/Architecture 约束；吸收 `/explore` 调研；使用 6D 框架推导组件、接口、数据模型、风险与测试策略；按模板落盘 L0，并在触发 R1-R5 时落盘 L1。  
**限制**：不改变 PRD、ADR 或系统边界前提；不在 L0 塞长伪代码、配置字典或方法体；不复制 ADR 正文，只引用 ADR。  
**Output Goal**：`{TARGET_DIR}/04_SYSTEM_DESIGN/{system-id}.md`，条件触发时另有 `{system-id}.detail.md` 与 `_research/{system-id}-research.md`。
</phase_context>

---

## CRITICAL 写作与输出契约

> [!IMPORTANT]
> 持久化报告、证据、单写者与去重复规则遵守 `.agents/skills/output-contract/SKILL.md`。本 skill 只补充系统设计专属契约。
>
> - **约束继承**：PRD、ADR、Architecture Overview 中的性能、安全、接口、技术栈与系统边界只能收紧，不能放松。
> - **ADR 单向引用**：跨系统决策只引用 `03_ADR/*`，不复制决策理由；若发现 ADR 不足，回流 `/change` 或 `/genesis`。
> - **L0 轻量导航**：L0 只放架构、契约、字段声明、关键图与取舍；长算法、长配置、伪代码和边缘实现进入 L1。
> - **可追溯**：接口、数据模型、测试策略和 Trade-off 至少能指回 `[REQ-*]`、ADR 或 Architecture 小节之一。
> - **无空占位**：未知项写 `[OPEN: 具体问题 + owner/下一步]`，禁止 `TBD`、`TODO`、泛泛“后续优化”。

---

## 设计框架：6D

### 1. Discover（发现）

### 做什么
读取 `01_PRD.md`、`02_ARCHITECTURE_OVERVIEW.md`、相关 `03_ADR/*` 与本系统已有 `04_SYSTEM_DESIGN` 草稿；提取职责、边界、依赖、关联 `[REQ-*]` 与不做事项。

### 为什么
详细设计不是重新发明系统，而是把已批准边界细化到可实现契约。

### 怎么验收
- 能用一句话说明本系统职责。
- 能列出输入、输出、依赖系统、关联需求和相关 ADR。

### 2. Deep-Dive（调研）

### 做什么
使用同工作区 `/explore` 产出 `_research/{system-id}-research.md`；调研只服务当前系统风险，不做泛泛资料堆叠。

### 为什么
复杂设计需要外部证据；否则 Trade-off 容易变成偏好陈述。

### 怎么验收
- 研究结论至少支撑一个设计取舍或风险缓解。
- `_research` 路径存在，或 `/design-system` 明确给出不适用理由。

### 3. Decompose（分解）

### 做什么
拆出组件、模块、数据流、状态流与外部接口；复杂系统按宿主规则使用 `sequential-thinking`。

### 为什么
组件边界决定可测性、依赖方向和后续任务拆解质量。

### 怎么验收
- 每个核心组件有职责和依赖。
- Mermaid 架构图或数据流图能与组件清单对上。

### 4. Design（设计）

### 做什么
定义接口契约、数据模型、错误语义、配置边界、状态转换与安全/性能策略。接口优先使用操作契约表；数据模型只写字段与关系，不写方法体。

### 为什么
`/blueprint` 需要的是外部可观察契约，不是实现散文。

### 怎么验收
- 核心操作有契约表或等价接口表。
- 数据字段、错误语义和验证责任可追溯。

### 5. Defend（防御）

### 做什么
列出关键 Trade-off、性能瓶颈、安全边界、可观测性与测试策略；公共契约须有 Contract Verification Matrix。

### 为什么
设计文档要提前暴露失败模式，不要把风险留给 `/forge` 猜。

### 怎么验收
- 至少两个重要决策有“选 A 不选 B”的理由。
- 测试策略覆盖单元、接口/API、集成/E2E 的适用边界。

### 6. Document（文档化）

### 做什么
读取 `.agents/skills/system-designer/references/system-design-template.md` 与按需读取 `system-design-detail-template.md`，落盘 L0/L1。

### 为什么
模板是长期维护契约；宿主和下游依赖固定章节语义。

### 怎么验收
- L0 必需章节 1-11 齐全；可选章节 12-14 按需要保留或写 N/A。
- 若触发 L1 规则，L0 有指向 `.detail.md` 的导航链接。

---

## L0 / L1 文档边界

| 层次 | 文件 | 内容 | 加载频率 |
| --- | --- | --- | --- |
| L0 导航层 | `{system-id}.md` | 目标、边界、架构图、操作契约、字段声明、Trade-off、测试策略 | 高，每次任务规划必读 |
| L1 实现层 | `{system-id}.detail.md` | 长伪代码、配置常量、复杂算法、边缘实现、详细状态表 | 低，仅任务输入明确引用时读取 |

### L1 拆分规则 R1-R5

触发任一项即创建 `{system-id}.detail.md`：

| 规则 | 触发条件 | 处理 |
| --- | --- | --- |
| R1 | 单个连续代码块 > 30 行 | 移入 L1 |
| R2 | 全文代码块总行数 > 200 行 | 移入 L1 |
| R3 | 配置常量字典条目 > 5 个 | 移入 L1 或配置表 |
| R4 | 版本内联注释 > 5 处 | 归并到版本历史 |
| R5 | L0 总行数 > 500 行 | 拆出 L1 |

### 内容归属

| 内容类型 | L0 | L1 |
| --- | --- | --- |
| 系统目标、边界、架构图、Trade-off | 是 | 否 |
| 操作契约表、HTTP/CLI/跨系统协议 | 是 | 细节补充 |
| 数据字段、Protocol/ABC 签名 | 是 | 复杂 schema 示例 |
| 函数体伪代码、复杂算法 | 否 | 是 |
| 配置常量、边缘场景展开 | 摘要 | 是 |

---

## 模板与章节

使用 `.agents/skills/system-designer/references/system-design-template.md`。

**L0 必需章节 1-11**：

1. Overview
2. Goals & Non-Goals
3. Background & Context
4. Architecture
5. Interface Design
6. Data Model
7. Technology Stack
8. Trade-offs & Alternatives
9. Security Considerations
10. Performance Considerations
11. Testing Strategy

**可选章节 12-14**：Deployment & Operations、Future Considerations、Appendix。可选不等于随意删除；不适用时写 `N/A + 理由`。

---

## 设计守则

- **调研先行**：设计前先获得研究证据或明确不适用理由。
- **Mermaid 优先**：架构、数据流、状态机和决策树优先用 Mermaid，长伪代码进 L1。
- **操作契约优先**：Agent、游戏核心、消息系统、CLI/API 等公共行为用操作契约表表达。
- **约束不放松**：继承 PRD/ADR 的性能、安全、合规、技术栈与错误语义。
- **取舍可复查**：重要决策必须有备选方案与后果。
- **公共契约可验证**：公共接口、配置、错误语义、持久化结构必须在测试策略中有承接。

---

## Handoff checklist

- [ ] 已读取 `01`、`02`、相关 `03_ADR/*`、`_research` 与模板。
- [ ] L0 文件存在，必需章节 1-11 齐全。
- [ ] L1 触发规则已判定；触发时 `.detail.md` 已创建并由 L0 链接。
- [ ] §5 操作契约、§6 数据模型、§8 ADR 引用、§11 测试策略无互相矛盾。
- [ ] 无 `.agent/` 旧路径、无 emoji、无 `TODO/TBD` 空占位。

---

<completion_criteria>
- `system_id` 与 `TARGET_DIR` 已由 `/design-system` 宿主确认。
- 输出遵守 `.agents/skills/output-contract/SKILL.md` 的落盘与协作闭环。
- L0/L1 边界、R1-R5、必需 1-11 章、可选 12-14 章语义清楚。
- 所有公共契约均有来源锚点与验证责任。
- 本 skill 仅服务 `/design-system`，不越权修改 PRD、ADR、Architecture 或 05A/05B。
</completion_criteria>
