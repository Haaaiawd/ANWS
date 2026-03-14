---
name: sequential-thinking
description: 当复杂问题需要系统性逐步推理时使用。适用于多阶段分析、设计规划、问题分解，或初始范围不明确且可能需要修正、分支与动态调整思考范围的任务。
license: MIT
---

# Sequential Thinking

通过可修正、可分支、可动态扩展的顺序推理，帮助 AI 处理复杂问题。

## Core Capabilities

- **迭代推理**: 将复杂问题拆解为连续的 thought 步骤
- **动态范围**: 随着理解深入调整 `totalThoughts`
- **修正能力**: 当新证据出现时回看并修正早期判断
- **分支探索**: 从关键分叉点探索替代路径
- **上下文保持**: 在整个推理过程中维持清晰的思考链条

## When to Use

在以下场景使用：
- 问题需要多个相互关联的推理步骤
- 初始范围或方法不明确
- 需要在复杂性中找到核心问题
- 可能需要回溯或修正早期结论
- 想探索替代方案路径

**不适用场景**: 简单查询、直接事实、单步任务，或解决路径已经非常明确的问题。

## Basic Usage

按如下 JSON 形态组织思考步骤。

### Required Fields

- `thought` (string): 当前推理内容
- `nextThoughtNeeded` (boolean): 是否还需要继续推理
- `thoughtNumber` (integer): 当前 thought 编号，从 `1` 开始
- `totalThoughts` (integer): 当前预估总步数，可动态调整

### Optional Fields

- `isRevision` (boolean): 标记当前 thought 是否在修正先前思路
- `revisesThought` (integer): 指明修正的是哪一个 thought
- `branchFromThought` (integer): 指明从哪一个 thought 开始分支
- `branchId` (string): 当前分支标识符

## Workflow Pattern

```
1. 从 `thoughtNumber: 1` 开始。
2. 每一步：
   - 在 `thought` 中表达当前推理
   - 用 `totalThoughts` 估计整体范围，必要时调整
   - 若还需继续，设置 `nextThoughtNeeded: true`
3. 当结论已经足够清晰时，设置 `nextThoughtNeeded: false`
```

## Example 1: 基础推演 (Baseline Reasoning)

```typescript
// First thought
{
  thought: "问题表面上是“查询性能下降”，但先不要急着选优化手段。需要先把问题拆成三层：是单条 SQL 退化、接口级 N+1、还是更上层的调用放大。若根因没分清，后面的缓存、索引、重写都可能只是补丁。",
  thoughtNumber: 1,
  totalThoughts: 4,
  nextThoughtNeeded: true
}

// Second thought
{
  thought: "从查询日志看，用户详情接口在一次请求里触发了大量重复读取，已经出现明显的 N+1 信号。但还不能直接下结论，因为重复查询也可能只是症状；需要继续确认慢点究竟来自“查询次数过多”，还是“某条关键查询本身很慢”。因此总步数上调一档。",
  thoughtNumber: 2,
  totalThoughts: 6,
  nextThoughtNeeded: true
}

// Final thought
{
  thought: "结论可以收敛了：主因是列表页批量加载时触发的 N+1，次因是关联字段缺少索引放大了单次查询成本。优化顺序应该先消除 N+1，再补索引验证尾延迟；这样既先打掉主矛盾，也避免一上来引入缓存复杂度。",
  thoughtNumber: 6,
  totalThoughts: 6,
  nextThoughtNeeded: false
}
```

## Example 2: 修正前提 (Revision in Flight)

```typescript
{
  thought: "回看 profiling 结果后，前面的判断需要修正：真正拖垮接口的不是 N+1 本身，而是关联列缺少索引，导致每次关联查询都在放大全表扫描成本。也就是说，N+1 仍然存在，但它不是第一性瓶颈，优先级应该后移。",
  thoughtNumber: 4,
  totalThoughts: 6,
  isRevision: true,
  revisesThought: 2,
  nextThoughtNeeded: true
}
```

## Example 3: 复杂变更拆解 (Structured Impact Analysis)

```typescript
{
  thought: "用户一次性提出了多项规则修改，不该把它们当成同一种改动处理。先拆开看：有的是机制原则调整，有的是数值平衡，有的是接口语义变化，还有的是文档与实现脱节。如果不先分型，后面会把“该改 ADR 的”“该改设计文档的”“该补代码契约的”混成一锅。",
  thoughtNumber: 1,
  totalThoughts: 3,
  nextThoughtNeeded: true
}

{
  thought: "先做影响矩阵。机制原则类改动通常会回流到 ADR 和 System Design；数值平衡会影响规则表、配置与测试基线；接口语义变化最危险，因为它会悄悄破坏调用方的假设。这里最该警惕的不是改动数量，而是有没有改到“被多个模块默认依赖、但文档里没写清楚”的隐性契约。",
  thoughtNumber: 2,
  totalThoughts: 3,
  nextThoughtNeeded: true
}

{
  thought: "可以收敛了：先处理那些会改变系统边界或调用语义的项，再处理数值与体验层面的项。顺序上应优先修正文档与契约，再讨论平衡性；否则后续所有实现和评审都会建立在漂移的前提上。结论不是“先改最显眼的”，而是“先修最容易污染系统认知的”。",
  thoughtNumber: 3,
  totalThoughts: 3,
  nextThoughtNeeded: false
}
```

## Example 4: 分支比较 (Branching Trade-offs)

```typescript
// Branch A
{
  thought: "方案 A：先引入缓存削峰。好处是见效快、对接口层侵入小，适合先止血；坏处是会把问题从“数据库慢”转成“缓存一致性与失效策略复杂”，如果根因其实是查询设计不合理，这条路容易把偶然复杂度永久留在系统里。",
  thoughtNumber: 3,
  totalThoughts: 7,
  branchFromThought: 2,
  branchId: "cache",
  nextThoughtNeeded: true
}

// Branch B
{
  thought: "方案 B：直接做索引优化和查询重写。好处是从根上消除瓶颈，长期结构更干净；代价是需要更仔细验证写入放大、锁竞争和回归风险。这条路更慢，但如果业务模型稳定，通常比提前上缓存更符合简单优先的原则。",
  thoughtNumber: 3,
  totalThoughts: 7,
  branchFromThought: 2,
  branchId: "query",
  nextThoughtNeeded: true
}
```

## Heuristic Reminders

以下提醒是**辅助思考的启发式问题**，不是硬约束。按任务性质选择性使用即可。

- **问题定义提醒**: 你现在是在描述现象，还是在定位根因？
- **证据提醒**: 当前判断基于事实、观察结果，还是基于猜测与假设？
- **边界提醒**: 当前问题影响的是局部模块、单系统，还是跨系统结构？
- **复杂度提醒**: 你是在消除本质复杂度，还是在增加偶然复杂度？
- **收敛提醒**: 当前是否已经足够形成结论，还是仍在无效发散？

## Tips

- 先给出粗略的 `totalThoughts`，随着理解深入再调整
- 当早期假设被证伪时，优先修正，不要沿着错误前提继续推进
- 当存在明确替代路径时，可以用分支并行比较
- 在 `thought` 中明确表达不确定性，比过早下结论更可靠
- 最后一个 thought 应明确给出结论，必要时补充下一步行动

