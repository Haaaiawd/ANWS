<div align="center">

<img src="assets/logo.png" width="200" alt="Anws">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Multi-Tool](https://img.shields.io/badge/Support-Claude%20Code%20%7C%20Copilot%20%7C%20Cursor%20%7C%20Windsurf-blueviolet)](https://github.com/Haaaiawd/Anws)
[![Vibe Coding](https://img.shields.io/badge/Vibe%20Coding-Enabled-ff69b4)](https://github.com/karpathy/vibe-coding)

[English](./README.md) | [中文](./README_CN.md)

</div>

---

## ⚡ What is this?

**Anws** — A **structured workflow framework** for Agentic AI assistants, designed to solve the core pain points of the Vibe Coding era.

> 💡 **TL;DR**: Stop letting AI write spaghetti code. Force it to think like an architect first.

**Works with**: Claude Code, GitHub Copilot, Cursor, Windsurf.

### 🎯 Problems We Solve

| Pain Point             | The Problem                                                 | Our Solution                                                   |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| **Architecture Drift** | AI generates inconsistent patterns across the same codebase | `/genesis` forces PRD & architecture design first              |
| **Spaghetti Code**     | AI lacks project context, writes code that doesn't fit      | Tasks include constraints & acceptance criteria                |
| **Context Amnesia**    | New session = AI forgets all previous decisions             | `AGENTS.md` + versioned docs as persistent memory |
| **Lack of Planning**   | Vibe Coding skips design, creates tech debt                 | Mandatory design-first workflow                                |

---

## 🚀 Quick Start

### Option A — npm CLI (Recommended)

```bash
npm install -g @haaaiawd/anws
cd your-project
anws init
```

> Requires Node.js ≥ 18.

### Option B — GitHub Release

Download the latest `.zip` from [Releases](https://github.com/Haaaiawd/Anws/releases), then copy `.agents/` to your project root.

### 📦 Update Existing Installation

```bash
cd your-project
anws update
```

> `anws update` overwrites all managed workflow/skill files to the latest version while **preserving** your existing `AGENTS.md`.
> If your project still has a legacy `.agent/` directory, the CLI will ask whether to migrate to `.agents/`.

### Your First Project 🐣

> **The easiest way to start**: Just run the `/quickstart` command! The AI will automatically analyze your project state and guide you step-by-step through the entire lifecycle (from `/genesis` to `/forge`).

**Looking for inspiration? Alternative prompt**: "I want to build a web-based macOS simulator, including Dock, top bar, and several system apps. Please start this new project from scratch according to the development process."

### 🔁 Built with Itself (Dogfooding)

Fun fact: **This very CLI tool (`anws`) was built using its own workflows!**
We used the `/genesis` workflow to design the CLI's architecture, and the `/forge` workflow to implement the code. This project serves as a live demonstration of what Anws can achieve.

**Deep Thinking & Architecture Design**: The AI will automatically execute the `/genesis` workflow, thinking deeply about project requirements and producing the PRD and architecture design.
<img src="assets/genesis工作流演示.jpg" width="800" alt="Genesis Workflow">

**Interactive Requirement Alignment**: The AI will ask follow-up questions for ambiguous requirements to ensure the design matches your intuition.
<img src="assets/与人类交互确认细节.jpg" width="800" alt="Human Interaction">

**Autonomous Task Breakdown & Execution**: The AI will autonomously call necessary Skills (e.g., `spec-writer`, `task-planner`, etc.) to complete documentation and task decomposition.
<img src="assets/自主调用skills.jpg" width="800" alt="Skills Execution">

---

## 🗺️ Decision Flowchart

```
                    ┌─────────────────┐
                    │  Where are you? │
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │   New    │      │  Legacy  │      │ Existing │
    │ Project  │      │ Takeover │      │  Change  │
    └────┬─────┘      └────┬─────┘      └────┬─────┘
         │                 │                 │
         ▼                 ▼                 ▼
    /genesis          /probe         Tweak existing task?
         │                 │              /         \
         │                 │             /           \
         └────────┬────────┘     /change       /genesis
                  │            (modify only)  (new tasks)
                  ▼                │            │
           /design-system <--------+------------+
          (optional, recommended)
                  |
                  v
            /challenge
         (design review)
                  |
                  v
             /blueprint
                  |
                  v
            /challenge
          (task review)
                  |
                  v
               /forge
          (code delivery)
```

---

## 🔑 Core Principles

### 1. Versioned Architecture
> Don't "fix" architecture docs. **Evolve** them.

- `genesis/v1` → `genesis/v2` on major changes
- Full traceability of decisions
- No "it was always like this" mystery

### 2. Deep Thinking First
> AI must think before it writes.

- Workflows force multi-step reasoning via `sequentialthinking`
- `[!IMPORTANT]` blocks as guardrails
- No shallow, scan-and-output responses

### 3. Filesystem as Memory
> Chat is ephemeral. Files are eternal.

- `AGENTS.md` = AI's anchor
- Architecture docs = persistent decisions
- New session recovery in 30 seconds

---

## 📋 Workflows

| Command           | Purpose                                                 | Input             | Output                                     |
| ----------------- | ------------------------------------------------------- | ----------------- | ------------------------------------------ |
| **`/quickstart`** | **One-command entry: orchestrates the whole lifecycle** | Auto-detected     | Full pipeline orchestration                |
| `/genesis`        | Start from zero, create PRD & architecture              | Vague idea        | PRD, Architecture, ADRs                    |
| `/scout`          | Analyze legacy codebase risks                           | Existing code     | Risk report, Gap analysis                  |
| `/design-system`  | Detailed design for a system                            | Architecture      | System Design doc                          |
| `/challenge`      | Review Design & Tasks (intelligent detection)           | Full Docs / TASKS | Challenge Report (Graded)                  |
| `/blueprint`      | Break architecture into tasks                           | PRD + Arch        | TASKS.md (WBS)                             |
| `/forge`          | Execute tasks — architecture to code                    | TASKS.md          | Working code, verified                     |
| `/change`         | Tweak existing tasks (no new tasks)                     | Minor tweak       | Updated TASKS + Design files (modify only) |
| `/explore`        | Deep research & brainstorm                              | Topic/Question    | Exploration report                         |
| `/craft`          | Create workflows/skills/prompts                         | Creation request  | Workflow / Skill / Prompt docs             |

---

## 🛠️ Compatibility & Prerequisites

> ⚠️ **Important**: This framework works with any AI coding tool that reads `AGENTS.md` and supports `.agents/` directory structure.

| Environment     |            Status            | Notes                          |
| --------------- | :--------------------------: | ------------------------------ |
| **Windsurf**       |     ✅ Full Support      | Native `.agents/workflows/` + slash commands |
| **Claude Code**    |     ✅ Full Support      | Reads `AGENTS.md` + workflows via instructions |
| **GitHub Copilot** |     ✅ Full Support      | `AGENTS.md` + `.github/instructions/` + skills |
| **Cursor**         |     ✅ Supported        | Via `.cursor/rules/` + `AGENTS.md` |
| **Others**         |     ✅ Compatible       | Any tool that reads `AGENTS.md` |

**How it works**: Anws uses `AGENTS.md` as the universal anchor point. Each tool reads this file to understand project context and workflow locations. The `.agents/` directory contains workflows and skills that can be discovered and executed.

### 🔌 Required: Sequential Thinking MCP Server

This framework uses `sequentialthinking` for deep reasoning. Install it via your tool's MCP Store:

- **Windsurf**: Settings → MCP Servers → Add `sequential-thinking`
- **Claude Code**: Add to `.claude/settings.json` or use MCP installer
- **Cursor**: Settings → MCP → Add `sequential-thinking`
- **Copilot**: Via VS Code extensions

> 💡 Without this, workflows still work, but deep thinking features will be limited.

---

## ⚡ Invoke Workflows

Your AI tool will automatically recognize the intent and trigger the appropriate workflow. You can use it in two ways:

#### ⚡ Method A: Slash Protocol (Explicit)
Directly type the command in the chat or editor to trigger the workflow.
- `/genesis` - Start project creation
- `/probe` - Analyze existing codebase risks
- `/blueprint` - Break down architecture into tasks

#### 🧠 Method B: Intent Protocol (Implicit)
Just speak naturally. Your AI tool will automatically select and run the right workflow.
- *"I want to start a new project for a todo app"* → Triggers `/genesis`
- *"Help me understand this legacy code and its risks"* → Triggers `/probe`
- *"I think there are gaps in this design, challenge it"* → Triggers `/challenge`
- *"The architecture is ready, let's plan the tasks"* → Triggers `/blueprint`
- *"Change the error message on the login page"* → Triggers `/change` (tweak existing task)
- *"I need to add a back-to-top button"* → Triggers `/genesis` (requires new task)

---

## 📁 Project Structure

```
your-project/
├── AGENTS.md          # 🧠 AI's anchor point (universal)
├── .agents/
│   ├── workflows/             # Workflow definitions
│   │   ├── genesis.md
│   │   ├── probe.md
│   │   ├── design-system.md
│   │   ├── challenge.md
│   │   ├── blueprint.md
│   │   ├── forge.md
│   │   ├── change.md
│   │   ├── explore.md
│   │   └── craft.md
│   │
│   └── skills/            # Reusable skills
│       ├── concept-modeler/
│       ├── spec-writer/
│       ├── task-planner/
│       ├── nexus-mapper/     # Codebase knowledge mapping
│       └── ...
│
└── genesis/               # Versioned architecture docs
    ├── v1/
    │   ├── 01_PRD.md
    │   ├── 02_ARCHITECTURE.md
    │   ├── 03_ADR/
    │   ├── 05_TASKS.md
    │   └── 07_CHALLENGE_REPORT.md
    └── v2/                # New version on major changes
```

## 🙌 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## 📜 License

[MIT](LICENSE) © 2026

---

<div align="center">

**Made for architects who code, and AIs who think.**

🧠 *"Good architecture isn't written. It's designed."*

---

## 📦 Integrated: nexus-skills

Anws integrates **[nexus-skills](https://github.com/Haaaiawd/nexus-skills)** for codebase knowledge mapping:

- **nexus-mapper**: Analyzes repositories and generates `.nexus-map/` knowledge bases for AI cold-start
- **nexus-query**: Instant structural queries during active development

The `/probe` workflow leverages nexus-mapper's PROBE protocol for deep codebase analysis, detecting hidden risks, coupling hotspots, and architectural drift.

</div>
