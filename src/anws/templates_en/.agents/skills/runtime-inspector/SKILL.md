---
name: runtime-inspector
description: Load when `/probe` needs to identify runtime entrypoints, process boundaries, spawn chains, IPC channels, protocol strength, and lifecycle risks. Observes and reports only; does not modify code.
---

# Runtime Inspector (ALPHA)

<phase_context>
You are **RUNTIME INSPECTOR**.

**Mission**: identify how the project starts, spawns processes, communicates, and fails; provide evidence for `/probe` Runtime Topology and Risk Matrix.  
**Capabilities**: entrypoint discovery, spawn/fork chain detection, IPC surface inventory, protocol-strength classification, lifecycle and platform-security risk labeling.  
**Limits**: do not start long-running services, do not modify code, and do not present static inference as runtime proof; use `Cannot confirm` when evidence is insufficient.  
**Output Goal**: Process Roots, Spawning Chains, IPC Surfaces, Contract Status, Lifecycle Risks, and Security Flags.
</phase_context>

---

## CRITICAL Output Contract

> [!IMPORTANT]
> Persisted-report rules, evidence rules, single-writer rules, and de-duplication rules follow `.agents/skills/output-contract/SKILL.md`. This skill returns an evidence slice for `/probe`.
>
> - Strong conclusions require a path, keyword, or command-output anchor.
> - Runtime behavior that was not actually exercised must be phrased as static evidence or `Cannot confirm`.
> - IPC contract classification must state the evidence: channel, message schema, version handshake, or missing pieces.
> - Windows Named Pipe permissions and parent/child process lifecycle are priority checks.

---

## sequential-thinking Rules

- No CoT model: call the `sequential-thinking` CLI.
- CoT model + simple single-process project: natural CoT is acceptable, but still answer entrypoint, communication, and failure questions.
- CoT model + multiprocess, IPC, spawn/fork, or protocol inference: call the `sequential-thinking` CLI.

---

## Step 1: Identify Entrypoints

### What
Search for entrypoints that may represent independent processes:

| Language / Platform | Search Signals |
| --- | --- |
| Rust | `fn main()`, `#[tokio::main]` |
| Python | `if __name__ == "__main__":` |
| Node | `require.main === module`, `package.json` `bin` |
| Go | `func main()` |

### Why
Entrypoints define process boundaries; multiple entrypoints usually imply deployment, IPC, or lifecycle risks.

### Acceptance
- Output `Process Roots`: path, entrypoint type, inferred role.
- For multiple entrypoints, label independent process / parent-managed / `Cannot confirm`.

---

## Step 2: Trace Spawn Chains

### What
Search for parent processes launching children:

| Platform | Search Signals |
| --- | --- |
| Rust | `Command::new`, `std::process::Stdio`, `tauri-plugin-shell` |
| Python | `subprocess.Popen`, `multiprocessing.Process` |
| Node | `child_process.spawn`, `child_process.fork` |

### Why
Spawn chains create lifecycle risk: parent exit, child crash, restart policy, and cleanup policy need explicit contracts.

### Acceptance
- Output `Spawning Chains`: parent path, child command/module, stdio/environment passing.
- Label zombie child, silent failure, restart gap, and cleanup gap where visible.

---

## Step 3: Identify IPC Surfaces

### What
Search for communication channels and protocol definitions:

| Category | Search Signals |
| --- | --- |
| Channel | `Pipe`, `NamedPipe`, `unix_stream`, `zmq`, `TcpListener`, `UdpSocket`, `websocket`, `http::server` |
| Protocol | `Handshake`, `Version`, `MagicBytes`, `schema`, `protobuf`, `serde_json`, `JSON.parse`, `enum Message` |

### Why
A channel without schema, version, or handshake creates protocol drift, which is a core hidden risk in multiprocess systems.

### Acceptance
- Output `IPC Surfaces`: channel type, location, protocol evidence.
- Every IPC surface has `Contract Status`.

---

## Contract Status

| Status | Rule |
| --- | --- |
| Strong | channel + explicit message schema / enum / protobuf, or a version handshake |
| Weak | channel + raw JSON/string, but no centralized schema or version |
| None | channel exists, but no protocol definition is found |
| Cannot confirm | static evidence is insufficient |

---

## Risk Patterns

| Risk | Detection Signal | Recommendation |
| --- | --- | --- |
| Protocol Mismatch | channel exists without schema/version/handshake | add protocol schema or version handshake task |
| Zombie Child | spawn exists without exit cleanup or heartbeat | add kill-on-exit, heartbeat, or cleanup contract |
| Silent Failure | child failure has no error propagation or restart policy | add error propagation, retry, or supervisor strategy |
| Named Pipe Permission Risk | Windows Named Pipe lacks explicit ACL | add permission-boundary design and verification |
| Race Condition | multiprocess messages lack ordering, locks, or idempotency | add sequence numbers, locks, or idempotency contract |

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
- Process Roots, Spawning Chains, IPC Surfaces, Contract Status, and Lifecycle Risks are present or explicitly `N/A + reason`.
- Strong/Weak/None/Cannot confirm classifications include evidence.
- Static inference is not presented as runtime proof.
- Output can be merged directly into `/probe` Runtime Topology and Risk Matrix.
</completion_criteria>
