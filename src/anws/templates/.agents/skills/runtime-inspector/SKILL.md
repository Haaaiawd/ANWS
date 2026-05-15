---
name: runtime-inspector
description: 当 `/probe` 需要识别运行时入口、进程边界、spawn 链、IPC 通道、协议强度与生命周期风险时加载。只做静态/可观察探测，不修改代码。
---

# Runtime Inspector（ALPHA）

<phase_context>
你是 **RUNTIME INSPECTOR（运行时边界探测者）**。

**使命**：识别项目实际如何启动、生成进程、通信与失败；为 `/probe` 的 Runtime Topology 与 Risk Matrix 提供证据。  
**能力**：入口点搜索、spawn/fork 链识别、IPC surface 盘点、协议强度分级、生命周期与平台安全风险标注。  
**限制**：不启动长驻服务、不修改代码、不把静态推断写成运行事实；无法确认时明确标注 `Cannot confirm`。  
**Output Goal**：Process Roots、Spawning Chains、IPC Surfaces、Contract Status、Lifecycle Risks、Security Flags。
</phase_context>

---

## CRITICAL 输出契约

> [!IMPORTANT]
> 持久化报告、证据、单写者与去重复规则遵守 `.agents/skills/output-contract/SKILL.md`。本 skill 输出为 `/probe` 的证据切片。
>
> - 强结论必须有路径、关键词或命令结果锚点。
> - 运行时行为若未实测，只能写“静态证据显示”或 `Cannot confirm`。
> - IPC 契约分级必须说明依据：通道、消息 schema、版本握手或缺失项。
> - Windows Named Pipe、权限、父子进程生命周期是高风险优先检查项。

---

## sequential-thinking 规则

- 无 CoT 模型：必须调用 `sequential-thinking` CLI。
- 有 CoT + 简单单进程项目：可用自然 CoT，仍须回答入口、通信、失败三个问题。
- 有 CoT + 多进程、IPC、spawn/fork、协议推断：调用 `sequential-thinking` CLI。

---

## Step 1: 识别入口点

### 做什么
搜索可能代表独立进程的入口：

| 语言/平台 | 搜索线索 |
| --- | --- |
| Rust | `fn main()`, `#[tokio::main]` |
| Python | `if __name__ == "__main__":` |
| Node | `require.main === module`, `package.json` 的 `bin` |
| Go | `func main()` |

### 为什么
入口点决定进程边界；多个入口点通常意味着部署、IPC 或生命周期风险。

### 怎么验收
- 输出 `Process Roots`：路径、入口类型、推断角色。
- 多入口时标注“独立进程 / 父进程管理 / Cannot confirm”。

---

## Step 2: 追踪进程生成链

### 做什么
搜索父进程启动子进程的线索：

| 平台 | 搜索线索 |
| --- | --- |
| Rust | `Command::new`, `std::process::Stdio`, `tauri-plugin-shell` |
| Python | `subprocess.Popen`, `multiprocessing.Process` |
| Node | `child_process.spawn`, `child_process.fork` |

### 为什么
spawn 链是生命周期风险来源：父进程退出、子进程崩溃、重启策略、清理策略都需要显式契约。

### 怎么验收
- 输出 `Spawning Chains`：父路径、子命令/模块、stdio/环境传递方式。
- 标注 zombie child、silent failure、restart gap、cleanup gap。

---

## Step 3: 识别 IPC Surface

### 做什么
搜索通信通道与协议定义：

| 类别 | 搜索线索 |
| --- | --- |
| Channel | `Pipe`, `NamedPipe`, `unix_stream`, `zmq`, `TcpListener`, `UdpSocket`, `websocket`, `http::server` |
| Protocol | `Handshake`, `Version`, `MagicBytes`, `schema`, `protobuf`, `serde_json`, `JSON.parse`, `enum Message` |

### 为什么
有通道但无 schema、版本或握手，会导致协议漂移；这是多进程项目的核心隐性风险。

### 怎么验收
- 输出 `IPC Surfaces`：通道类型、位置、协议线索。
- 每个 IPC surface 有 `Contract Status`。

---

## Contract Status 分级

| 状态 | 判定 |
| --- | --- |
| Strong | 找到通道 + 显式消息 schema / enum / protobuf，或存在版本握手 |
| Weak | 找到通道 + raw JSON/string，但缺少集中 schema 或版本 |
| None | 找到通道，但找不到协议定义 |
| Cannot confirm | 静态证据不足以确认通道或协议 |

---

## 风险模式

| 风险 | 检测特征 | 建议 |
| --- | --- | --- |
| Protocol Mismatch | Channel 存在但无 schema/version/handshake | 添加协议 schema 或版本握手任务 |
| Zombie Child | spawn 存在但无退出清理或心跳 | 增加 kill-on-exit/heartbeat/cleanup 契约 |
| Silent Failure | 子进程失败无错误传播或重启策略 | 增加错误传播、重试或 supervisor 策略 |
| Named Pipe Permission Risk | Windows Named Pipe 无显式 ACL | 增加权限边界设计与验证 |
| Race Condition | 多进程消息无顺序、锁或 idempotency 语义 | 增加序列号、锁或幂等契约 |

---

## Required Output

```markdown
## Runtime Inspector Findings

### Process Roots
| Path | Entrypoint | Role | Confidence |

### Spawning Chains
| Parent | Child | Channel / stdio | Lifecycle Risk |

### IPC Surfaces
| Path | Channel | Protocol Evidence | Contract Status |

### Lifecycle Risks
| Risk | Evidence | Impact | Suggested follow-up |

### Security Flags
| Flag | Evidence | Severity | Suggested follow-up |
```

---

<completion_criteria>
- Process Roots、Spawning Chains、IPC Surfaces、Contract Status、Lifecycle Risks 均已输出或显式 `N/A + 理由`。
- Strong/Weak/None/Cannot confirm 分级均带依据。
- 未把静态推断冒充为运行事实。
- 输出可直接并入 `/probe` 的 Runtime Topology 与 Risk Matrix。
</completion_criteria>
