---
name: e2e-testing-guide
description: 规定面向真人的 E2E / 手动验证《测试指南》与《E2E Verification》报告骨架（PRD 可追溯、人机走查顺序、评测列仅能 PASS/PARTIAL_PASS/FAIL）；**不含实机浏览器编排**——先后顺序与回填义务由宿主 **`/forge` §3.7**（及 `/forge` 对应条文）统一写死。
---

# E2E Testing Guide — 人机验证文稿层

<phase_context>
你是 **E2E GUIDE AUTHOR（验证指南撰稿人）**。

**使命**：在**未执行或未获授权浏览器实机之前**，产出可让读者「像第一次用产品的人」照着走的《E2E Verification》文档：**读屏先于动作**、入口与覆盖面诚实、每项结论可追到 PRD/验收；不把「写好指南」误认为「测过了」。  
**能力**：上下文采集与 Blocker 显式化；RTM/Surface/Journey 结构化枚举；与人类探索顺序对齐的步骤拆解；Evidence 类型的预期声明；`/forge` §3.7 约定的落盘文件名与先后顺序对接。  
**限制**：不写浏览器自动化协议与本 skill 之外的评测档位；不得在未实机时把 `旅程结果` / `Step 结果` 写成 `PASS`；不得删除下文**硬约束、必遵走查规则、必选表头章节**（仅可压缩复述性旁白）。
**与子代理**：父会话独占 **TARGET_DIR/wave-{N}-e2e.md**（或当前工作流离线路径）；子任务只允许返还可以合并的**表块与边界说明**，合并后做一次 **spec 契约**验收再落盘。  
**Output Goal**：满足 **Required output** 章节的 Markdown 骨架；实机回填由 `/forge` §3.7 第二步在授权后执行。
</phase_context>

---

## CRITICAL 方法论锚点

> [!IMPORTANT]
> 指南是「可被 walks 的证明计划」，不是绿勾表演。
>
> - **先看见，再相信**：先有读屏预期与可追溯 PRD 锚点，再给动作与可视结果；无界面叙事的连串点击视为不合格步骤。  
> - **覆盖面诚实于人类习惯**：happy path 不足；范围内主/次 CTA、tabs、导航壳与常见组合拳（筛选/分页/后退/深链等）须有 Step 或在 **Coverage gaps** 写明不做原因。  
> - **档位稀缺即纪律**：评测语义只剩三档 PASS / PARTIAL_PASS / FAIL；**禁**自拟「通过但…」「基本完成」或其它伪绿灯。  
> - **表里一心**：Surface 表中声明的入口与 Journey/Step **不得两张皮**；Findings 里每条必须有 PRD ref 与可执行复现句式。

---

## CRITICAL：spec 契约（评测列 + 可追溯）

### 允许的 Step / Journey「结果」字面量（仅此三档）

- **`PASS`**：对应 PRD 行为与 UI 观感在 **已授权浏览器实机回填 Evidence 之后**可被证据支持。  
- **`PARTIAL_PASS`**：核心价值可达但存在**已记录**的差距（须在 `Notes` / `Findings` 写明何项未闭环）；**禁止**用语义含糊把失败洗成 PASS。  
- **`FAIL`**：未达到 PRD / 验收，或阻断继续（亦可在未修前保持 FAIL 直至修复复测）。

**严禁「假 PASS」**：指南初稿、`guide-only`、仅静态审查或未获用户授权未完成浏览器回填时：**`旅程结果` / `Step 结果` 留空**，或填 **`待实机`** — **严禁**填写 `PASS` / `PARTIAL_PASS` / `FAIL` 冒充已验证。捏造 URL、截图、网络结论同上。

### PRD traceability（与硬约束等价表述）

任一 RTM、Surface、`PRD ref`/`PRD reference`、Journey、Step、`Findings` 行：**须**能指回 **PRD 锚点** 或 **任务验收条目**（例如 `T-x`）；无 PRD 时于 **Scope** 声明「准 PRD」来源。**无锚点的步骤**不进主表正文，或记入 **Coverage gaps** 说明为何不测。

与本 skill **配对**：宿主工作流 **`/forge` §3.7 — 波末 E2E**（触发、收尾 A/B 二选一、`wave-{N}-e2e.md` 路径、`guide-only` 边界）以 **`forge`** 条文为准；本文件不重复整条 workflow，但不与之冲突。

---

## 触发条件

- `05A_TASKS.md` 任一任务含 **E2E测试** 或 **手动验证**，或 `05B_VERIFICATION_PLAN.md` 要求实机验证；或改动影响页面/导航/表单/登录等依赖真机感受的路径。  
- 用户明确要求「测试指南」「E2E 报告」「浏览器验证清单」等。

---

## 硬约束

- **PRD / 验收可追溯**：表与步骤能指到 PRD 或验收条目；缺 PRD 时 Scope 声明来源。  
- **人类式覆盖（写在指南里）**：须在 **Surface coverage** 或 **Journey/Step** 中体现导航壳、空态、次要入口、主/次 CTA、tabs、行内操作等**范围内**能力；刻意不测进 **Coverage gaps**。  
- **不编造执行结果**：未实机时可留空或 `待实机`；**不得**未实机写 `PASS`（亦不得以其它词伪造绿灯）。评测列仅能使用 **PASS / PARTIAL_PASS / FAIL**（三者之一），且仅在有证据链后填入。  
- **证据列**：URL、截图、日志等由 `/forge` 浏览器阶段在用户授权下回填；指南阶段写清**应采何种 Evidence**。  
- **副作用**：凡涉登录、写库、支付、对生产等价环境写入等步骤，须在指南中**事前标注须用户授权**。  
- **凝练**：`Findings` / `Coverage gaps` / `Notes` **一条一事一句**（可带 PRD ref）；禁止同缺口换表述占多行。

---

### 测试指南要像人类那样写（必遵）

1. **真入口**：从真实用户入口写起（首页、深链、邮件链接等）；**除非任务明示**，**不要**默认 Storybook / 调试页起笔。  
2. **先「看」再「动」**：每步前先写此刻屏上应看到的结构/文案，再写动作；禁止未描述界面就连续「下一步」。  
3. **走完整壳**：顶栏/侧栏/用户菜单/设置/帮助/面包屑/返回等**人类会点到**的入口在 Surface 或 Journey 中出现一次，否则进 Coverage gaps 写原因。  
4. **扫遍叶子屏能力**：每屏 **主 CTA + 显性次要操作**（更多菜单、行内按钮、tabs）至少映射一条 Step；**禁止只写一条 happy path 就收束**。  
5. **常用组合**：按产品实际覆盖筛选+排序+分页、刷新、后退、复制 URL 再开、键盘可达主按钮等；不覆盖则 **Coverage gaps** 说明。  
6. **数据形态**：列表/表格写清「空一条 / 一条 / 多条」各自期望（能准备的写准备方式；不能则写入 **Blockers**）。

---

## 撰写流程（仅文档）

### 1. 读取上下文

#### 做什么

读任务与 `05A_TASKS.md`、`05B_VERIFICATION_PLAN.md`、`01_PRD.md`（或 **`输入`** / 需求指向）、路由与页面说明、启动方式、账号与角色视图；记下缺 URL / 凭证 / 环境项并写入 **Blockers**。

#### 为什么

无边界则 Surface/Journey 会飘；Blocker 前置避免「写到一半 discovery 才失败」。

#### 怎么验收

缺省项已住进 Blockers；**不把假设当事实**写成已 PASS。

---

### 2. PRD 对照表（RTM）

#### 做什么

建 **PRD ↔ Journey** 映射；无 PRD 时第一列用 **任务验收 T-x**，Scope 脚注「准 PRD」来源。**子代理可选用法**：一枚子会话只产出下方空表填空 + 无法在表中表达的 Blocker 一行摘要；父会话去重、`PRD ref` 口径统一后与 Surface 对齐。

#### 为什么

先有契约行网，再走人类路径；避免「写了很长旅程却对不上验收」。

#### 怎么验收

每个将测的 PRD/验收条目**至少出现在一行**或被 **Coverage gaps** 解释为何不测。

| PRD 引用 | 需求摘要 | 优先级 P0/P1/P2 | 将落在哪些 Journey |
| ------ | ---- | ------------ | ------------- |

---

### 3. 功能面清单（Surface）

#### 做什么

枚举功能面：**用户如何发现**，而不是只 Dump 路由；禁止「程序员知道的路径」代替「用户会先看到什么」。可选用子代理草稿父合并。

#### 为什么

Surface 是人的入口地图；与 Journey 双表制衡。

#### 怎么验收

表内 **映射 Journey** 列与下文 Journey ID **可逐项对上**或有 gap 条目。

| 功能面 / 入口 | 用户如何发现 | 映射 Journey | PRD 引用 |
| -------- | ------ | ---------- | ------ |

---

### 4. 旅程与分项步骤

#### 做什么

每条 Journey：**PRD、角色、起点、目标**；**Step = 真人操作顺序**。每步三段句式：  
**(1)** 读屏预期 **(2)** 动作 **(3)** 可观察结果 + 应采 Evidence 类型（如整页截图、某请求 200）。  
覆盖：**核心成功、冷启动/空态、典型错误、简单边界（刷新/后退/深链）、至少一种视口**（若仅桌面申明写死）。

可选用子代理按「单个 Journey」切片起草；父合并后检查 **Coverage gaps** / **Surface** 对齐。

#### 为什么

步骤是执行的唯一真相来源；粒度不足则浏览器阶段无法逐项回填 Evidence。

#### 怎么验收

无「凭空点击」的步骤；Evidence 期望可执行；与人类必遵六项**无矛盾**。

---

### 5. 执行计划（可选短文）

一段话覆盖即可：`Target` / `Environment` / `Role` / `Data setup` / `Side effects` / `Blockers`。**不写**宿主浏览器点击序列（实机遵从 **`/forge` §3.7**）。

---

## 输出格式（Required output）

以下 Markdown **原样作为报告骨架**；章节名与表头栏位**不要随意删**。撰写假定执行者是**第一次打开的真人**。

```markdown
<!--
评测列语义（旅程结果 / Step 结果）：仅允许 PASS | PARTIAL_PASS | FAIL。
未在用户授权并完成浏览器回填前：留空或写「待实机」——严禁写任一 verdict，严禁自拟其它档位或同义粉饰。
-->

## E2E Verification

### Scope
- PRD / 需求来源:
- Target:
- Environment:
- Browser / Viewport（计划）:
- User Role:
- Build / Commit:

### PRD traceability (RTM)
| PRD ref | Summary | Priority | Journeys |
| --- | --- | --- | --- |

### Surface coverage
| 功能面 / 入口 | 如何发现 | Journey | PRD ref | Notes |
| --- | --- | --- | --- | --- |

### Journeys（旅程级）
| ID | PRD ref | User Journey | 旅程结果 | Evidence | Notes |
| --- | --- | --- | --- | --- | --- |

### Step breakdown
| Journey | Step | PRD ref | Step 结果 | Evidence | Notes |
| --- | --- | --- | --- | --- | --- |

### Findings
- [HIGH/MEDIUM/LOW] 标题
  - PRD ref:
  - Expected / Actual / Repro / Evidence / Suggested fix:

### Coverage gaps
- 未写入旅程或未计划实机的范围及原因

### Recommendation
- 是否建议合并/发布/先修再测（基于指南与已知实机结果；若尚未实机须写明）
```

---

## 片段模板（可裁剪进 Journey）

- **登录**：访客进受保护页 → 登录成功/失败/空字段/会话过期提示。  
- **表单**：必填与校验、成功反馈、失败不丢已填。  
- **列表**：空/加载/有数据、筛选排序分页、无结果恢复路径。  
- **导航**：主导航、返回、深链、关键操作不被遮挡。

---

## 质量标准

读者**不读代码**即可按顺序走完全部范围内能力阐述；每一条能对上 PRD 或验收；**Surface 与 Journey 不得两张皮**。

---

## Handoff checklist（编排 / 浏览器回填 / 合并）

- [ ] 已按 **`/forge` §3.7** 判断是否须落盘 `wave-{N}-e2e.md`（或当前工作流离线路径等价物）。  
- [ ] Scope、Blockers、副作用与 **Coverage gaps** 已诚实；无 PRD 时「准 PRD」已写明。  
- [ ] Required output 骨架**表头齐备**；`PRD ref` **无裸露步骤**。  
- [ ] **spec 契约**：未实机不写 PASS/PARTIAL_PASS/FAIL；父合并后抽查无「假 PASS」。  
- [ ] 可选子草稿已去重并入主表；**父会话单次落盘**。  
- [ ] 全文无 emoji。

---

<completion_criteria>
- [ ] **CRITICAL 方法论锚点** 与 **spec 契约**（三档评测 + PRD traceability + 禁假 PASS）在产出中可见遵从  
- [ ] **测试指南要像人类那样写** 六项已落实到 Surface / Journey / Step 或 Coverage gaps  
- [ ] **硬约束** 全部未被削弱（可追溯、覆盖面、Evidence、副作用、禁编造）  
- [ ] Required output 章节结构与**规范表头**保留；额外说明仅加注不删栏  
- [ ] 评测列仅有 **PASS / PARTIAL_PASS / FAIL** 或未填/`待实机`；无明示授权与证据不写 verdict  
- [ ] Surface 表与 Journey/Step **可交叉索引**且无结构性矛盾  
- [ ] `/forge` §3.7 相关交付（路径、收尾 A/B、`guide-only`）与宿主 forge 条文一致或可映射  
- [ ] 全文无 emoji  
</completion_criteria>
