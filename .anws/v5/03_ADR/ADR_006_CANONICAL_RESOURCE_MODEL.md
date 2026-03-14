# ADR-006: Canonical Resource Model 与投影模型

**状态**: Accepted
**日期**: 2026-03-14
**关联需求**: [REQ-002] [REQ-003] [REQ-005]
**关联版本**: .anws v5

---

## 背景

当前实现中的 `manifest.js` 直接维护 `.agents/...` 物理路径列表，等价于把 Antigravity 风格目录当成内部权威模型。这在单目标时代尚可接受，但面对 Windsurf、Cursor、Claude、GitHub Copilot、Codex 时会失效：同一语义资产在不同平台中会变成 workflow、skill、command、prompt、agent 等不同形态。

---

## 决策

采用三层资源模型：

1. **Canonical Capability**
   - `anws` 的语义资产单位，例如 `genesis`、`blueprint`、`spec-writer`
2. **Resource Projection**
   - 针对目标 IDE，将 capability 映射为资源形态，例如 workflow、skill、command、prompt、agent
3. **Target Layout**
   - 将资源投影落到具体物理路径与命名规则

---

## 为什么不是 `workflow / skill / prompt` 直接做权威模型

因为这些词已经带有目标平台语义：

- 在 Windsurf / Antigravity 中，`workflow` 与 `skill` 是天然实体
- 在 Cursor / Claude 中，更像 `command`
- 在 GitHub Copilot 中，会拆成 `agent` 与 `prompt`
- 在 Codex 中，既可能是 `prompt`，也可直接承载 `skill`

如果把 `workflow / skill / prompt` 直接定义为内部真相，后续仍然会被不同平台术语牵着走。

---

## 结果约束

1. `manifest.js` 不应再是固定常量文件清单，而应成为“按 target 解析后的 managed projection manifest”
2. `init.js` 与 `update.js` 只能消费 projection plan，不应自己决定目录命名
3. README / help 文案必须用“目标 IDE + 安装投影”来解释产品行为，而不是宣传某个固定目录

---

## 示例

| Capability | Windsurf | Cursor | Copilot | Codex |
|------------|----------|--------|---------|-------|
| `genesis` | workflow | command | agent + prompt | prompt |
| `spec-writer` | skill | command support / prompt include | prompt / agent support | skill |

> 上表表达的是资源形态映射原则，而不是最终实现文件名细节。

---

## 后果

### 正面

- 可以真正做到一套源，多目标
- 新增目标 IDE 的成本下降
- update 与测试都可以围绕 projection plan 建立

### 代价

- 需要引入显式 projection planner
- 需要补充目标矩阵测试
- 需要对现有 `.agents` 常量清单实现做迁移
