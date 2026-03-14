# .anws v5 - 版本清单

**创建日期**: 2026-03-14
**状态**: Active
**前序版本**: v4 (2026-03-14)

## 版本目标
在 v4 已建立“多 AI 编程工具适配”方向的基础上，进一步将 `anws` 演进为**面向单一目标 IDE 的按需安装分发系统**：`anws init` 必须让用户显式选择目标 AI IDE，再仅安装该目标所需的工作流、技能、提示与辅助文件；同时明确内部权威资源模型、适配矩阵与更新边界，为后续 `/blueprint` 和 CLI 实现提供可执行真相。

## 主要变更
- 明确 `anws init` 采用**单选目标 IDE 安装**，禁止一次写入多套目标目录
- 将内部权威模型从目录导向升级为 `canonical capability + resource projection + target layout`
- 将第一批目标工具扩展为 Windsurf、Antigravity / `.agents`、Cursor、Claude、GitHub Copilot、Codex
- 明确 Codex 除 `prompts` 外，也可直接承载 `skills`
- 将 managed files 从“固定常量清单”演进为“按 target 解析后的投放结果清单”
- 为 `/blueprint` 准备 CLI 适配层、投放矩阵、README/帮助文案同步等任务边界

## 文档清单
- [x] 00_MANIFEST.md (本文件)
- [x] 01_PRD.md
- [x] 02_ARCHITECTURE_OVERVIEW.md
- [x] 03_ADR/ (ADR_004_MULTI_TOOL_ADAPTERS, ADR_006_CANONICAL_RESOURCE_MODEL)
- [ ] 04_SYSTEM_DESIGN/ (待 /design-system 执行)
- [ ] 05_TASKS.md (由 /blueprint 生成)
- [x] 06_CHANGELOG.md
