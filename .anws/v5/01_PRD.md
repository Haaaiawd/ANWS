# Product Requirements Document (PRD) v5.0

**Project**: Anws CLI
**Title**: `anws` — 面向多 AI IDE 的单目标安装与统一资源投影系统
**Status**: Approved
**Version**: 5.0
**Author**: Genesis Agent
**Date**: 2026-03-14
**前序版本**: v4.0 (2026-03-14)

---

## 1. Executive Summary

`anws` 已在 v4 将“多 AI 编程工具适配”纳入正式架构，但当时仍停留在方向层。v5 进一步拍板产品行为与资源模型：`anws init` 必须先让用户选择目标 AI IDE，然后仅安装该 IDE 所需的目录和文件；CLI 不再被定义为复制某个固定目录结构的工具，而是一个从统一源资产中生成目标投影并安全落盘的分发器。该版本的核心目标是消除 `.agents` 作为唯一真相的历史耦合，为 Windsurf、Antigravity、Cursor、Claude、GitHub Copilot、Codex 建立一致可解释的投放与升级模型。

---

## 2. Background & Context

### 2.1 Problem Statement

- **Current Pain Point**: 当前 CLI 实现仍将 `.agents/` 与 `AGENTS.md` 视为唯一权威安装目标，`manifest.js` 直接写死物理路径，导致多 IDE 支持只能通过不断扩散 if/else 或复制模板实现。
- **Impact Scope**: 影响希望在 Windsurf、Antigravity、Cursor、Claude、GitHub Copilot、Codex 等环境中使用同一套 `anws` 工作流系统的开发者与维护者。
- **Business Impact**: 如果不先拍板内部权威资源模型与单目标安装策略，后续适配只会继续堆叠偶然复杂度，最终形成多份目录副本、升级规则不一致和 README 漂移。

### 2.2 Opportunity

将 `anws` 定义为“**统一源资产 + 目标投影 + 单目标安装 + 安全升级**”的 CLI 产品，使工作流资产真正摆脱单一 IDE 目录契约；同时保留现有 CLI 品牌输出与安全更新原则，继续强化产品完成度。

### 2.3 Reference & Competitors

- **Spec Kit**: 提供了不同 AI 工具的命令/提示投放案例。**借鉴点**: 同一语义能力按目标目录约定落点。**不照搬点**: `anws` 仍坚持自身版本化架构、工作流命名与升级语义。
- **shadcn/ui**: 以文件分发与保留用户自定义为核心。**借鉴点**: 文件注入与 managed files 边界。
- **create-next-app / create-react-app**: 强调初始化流程中的明确选择与下一步引导。**借鉴点**: 让 `init` 成为真正的产品入口。

---

## 3. Goals & Non-Goals

### 3.1 Goals

- **[G1]**: `anws init` 必须先确定一个且仅一个目标 AI IDE，再执行安装。
- **[G2]**: `anws` 内部必须拥有独立于目标目录的权威资源模型，不能再把 `.agents/` 视为系统真相。
- **[G3]**: 第一批目标工具明确为 `Windsurf`、`Antigravity / .agents`、`Cursor`、`Claude`、`GitHub Copilot`、`Codex`。
- **[G4]**: 统一源资产必须可以投影为 `workflow / skill / prompt / command / agent` 等目标资源形态。
- **[G5]**: `anws update` 必须在多目标场景下继续保持 managed files 安全更新原则。
- **[G6]**: README、CLI help、安装提示文案必须与目标 IDE 选择机制同步。
- **[G7]**: 继续保持 CLI 品牌输出定稿结果，不因本轮架构演进回退体验质量。

### 3.2 Non-Goals (Out of Scope)

- **[NG1]**: 一次命令安装多套 IDE 目录结构。
- **[NG2]**: 为每个 IDE 长期维护独立的一整套业务内容副本。
- **[NG3]**: 在 v5 内完成全部适配代码实现；本版本先定义正式产品真相与实施边界。
- **[NG4]**: 推翻现有 `.anws/vN` 版本化机制或 CLI 品牌输出方案。

---

## 4. User Stories (The "What")

### US01: 单目标 IDE 初始化 [REQ-001]

- **Story**: As a developer, I want `anws init` to ask me which AI IDE I use, so that only the files required by that IDE are installed.
- **Acceptance Criteria**:
  - [ ] **Given** 用户执行 `anws init`，**When** CLI 进入初始化流程，**Then** 必须要求用户选择一个目标 IDE。
  - [ ] **Given** 用户已选择目标 IDE，**When** 初始化执行，**Then** 只写入该 IDE 对应目录与文件。
  - [ ] **Given** 目标目录不存在，**Then** CLI 自动创建必要目录结构。
- **Priority**: P0

---

### US02: 统一源资源投影 [REQ-002]

- **Story**: As a maintainer, I want a canonical resource model independent of physical directories, so that new IDE support does not require duplicating the whole template tree.
- **Acceptance Criteria**:
  - [ ] 存在明确的 canonical resource model。
  - [ ] 资源模型与目标目录布局解耦。
  - [ ] 每个目标 IDE 都通过投影规则得到物理文件布局。
- **Priority**: P0

---

### US03: 目标适配矩阵 [REQ-003]

- **Story**: As a maintainer, I want an explicit projection matrix for the first batch of IDEs, so that installation and update behavior are explainable.
- **Acceptance Criteria**:
  - [ ] Windsurf → `.windsurf/workflows/` + `.windsurf/skills/`
  - [ ] Antigravity → `.agents/workflows/` + `.agents/skills/`
  - [ ] Cursor → `.cursor/commands/`
  - [ ] Claude → `.claude/commands/`
  - [ ] GitHub Copilot → `.github/agents/` + `.github/prompts/`
  - [ ] Codex → `.codex/prompts/` + `.codex/skills/`
- **Priority**: P0

---

### US04: 多目标安全更新 [REQ-004]

- **Story**: As a developer, I want `anws update` to upgrade only the managed projection of my installed IDE target, so that my custom content is preserved.
- **Acceptance Criteria**:
  - [ ] managed files 定义基于目标 IDE 的已安装投影结果，而不是固定全局常量数组。
  - [ ] `update` 仅覆盖当前已安装目标下由 `anws` 管理的文件。
  - [ ] 目标切换不会默认发生在 `update` 中。
- **Priority**: P1

---

### US05: 文案与帮助一致性 [REQ-005]

- **Story**: As a developer, I want README and CLI help text to reflect the target IDE selection model, so that product behavior is predictable.
- **Acceptance Criteria**:
  - [ ] `anws --help` 清楚说明 init 将选择目标 IDE。
  - [ ] README / README_CN / `src/anws/README*.md` 同步目标选择与投放机制。
  - [ ] 不再误导用户认为 `.agents/` 是唯一安装目标。
- **Priority**: P1

---

## 5. Resource Model

### 5.1 Canonical Resource Model

v5 采用三层内部真相：

1. **Capability**
   - 表示 `anws` 想交付的语义能力，例如 `genesis`、`blueprint`、`spec-writer`。
2. **Resource Projection**
   - 表示某个 capability 在目标工具上应投影成何种资源形态，例如 workflow、skill、command、prompt、agent。
3. **Target Layout**
   - 表示最终写入用户项目的物理目录与文件命名。

### 5.2 Why Not Use Direct Directory Truth

- `.agents/` 只是一种历史目标布局，不应再被视为系统真相。
- 同一 capability 在 Cursor / Claude 中更像 command，在 Copilot 中会拆成 agent + prompt，在 Codex 中可能是 prompt + skill。
- 如果内部模型等于目录模型，扩展新 IDE 时会被迫复制和改写大量文件清单。

---

## 6. Target Matrix

| Target IDE | Primary Projection | Layout |
|------------|--------------------|--------|
| Windsurf | workflow + skill | `.windsurf/workflows/`, `.windsurf/skills/` |
| Antigravity | workflow + skill | `.agents/workflows/`, `.agents/skills/` |
| Cursor | command | `.cursor/commands/` |
| Claude | command | `.claude/commands/` |
| GitHub Copilot | agent + prompt | `.github/agents/`, `.github/prompts/` |
| Codex | prompt + skill | `.codex/prompts/`, `.codex/skills/` |

---

## 7. Constraints

- **Runtime**: Node.js ≥ 18
- **Dependencies**: 零运行时依赖
- **Cross-platform**: Windows / macOS / Linux
- **Backward Safety**: 现有 `.agents` 与 `AGENTS.md` 安全原则不能丢
- **Explainability**: 目标矩阵与投影规则必须能在文档中解释清楚

---

## 8. Definition of Done

- [ ] `.anws/v5` 正式记录单目标 IDE 安装模型
- [ ] PRD 清楚定义 canonical resource model 与投影矩阵
- [ ] Architecture Overview 体现 adapter layer、projection planning、managed projection manifest
- [ ] 至少 2 份 ADR 记录多工具适配与资源模型决策
- [ ] 后续可直接进入 `/blueprint` 拆任务
