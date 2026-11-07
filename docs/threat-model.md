# Threat Model & Security Specification
## ISRO SIH Problem 26171: Privacy-Preserving Browser Vision Agent

### 1. Security Invariant & Trust Boundaries

The system defines two security zones separated by a strict network boundary:
- **Trusted Zone (Local Client)**: Chrome Extension background worker, content scripts, ONNX Web runtime, WebCrypto vault, and local canvas redaction pipeline.
- **Untrusted / Remote Zone (Cloud & Model)**: Gemini API, network transport layer, cloud proxies, and telemetry collectors.

**Core Invariant**: Plaintext PII and sensitive user profile values MUST NOT cross the network boundary into the Untrusted Zone.

---

### 2. Threat Analysis & Mitigations

| Threat ID | Threat Description | Attack Vector / Scenario | System Defense & Mitigation | Outcome / Status |
| :--- | :--- | :--- | :--- | :--- |
| **THREAT-A** | **Cloud Agent Secret Exfiltration** | Cloud agent issues an instruction or payload attempting to read raw secrets: `{"action": "GET_SECRET", "token": "EMAIL_001"}` or asks in reasoning text "What is EMAIL_001?". | Capability-based schema enforces strict allowlist (`NAVIGATE`, `CLICK`, `TYPE`, `FILL_FIELD`, `SELECT`, `SCROLL`, `WAIT`, `FINISH_TASK`). No reading/dumping actions exist in schema. Any unsupported action results in immediate rejection. | **BLOCKED** (`ERROR: CAPABILITY_NOT_PERMITTED`) |
| **THREAT-B** | **PII Detector Under-Detection (False Negatives)** | A non-standard form field or obfuscated label contains PII that escapes basic heuristics. | Multi-signal ensemble detection (DOM semantic tag scan + strict regex suites + OCR visual matching + bounding box context expansion). When uncertainty threshold exceeds tolerance, conservative masking is applied. | **MASKED CONSERVATIVELY** (Fail-safe redaction) |
| **THREAT-C** | **Unknown / Stale Token Request** | Cloud model hallucinates or requests a token not present in the local registry: `{"action": "FILL_FIELD", "value_ref": "INVALID_TOKEN_999"}`. | Local Token Registry verifies existence and cryptographic hash of token before resolution. Unknown tokens are rejected without query execution. | **BLOCKED** (`ERROR: UNKNOWN_VALUE_REFERENCE`) |
| **THREAT-D** | **Extension / Perception Crash** | Background script or ONNX runtime crashes mid-task or fails to process frame. | Fail-closed architecture. Network request to Gemini is aborted if perception/sanitization step does not produce a verified clean state. The agent halts with an explicit error. | **FAIL CLOSED** (No raw data fallback) |
| **THREAT-E** | **Malicious Target Page Token Sniffing** | A malicious website attempts to harvest secrets by mimicking legitimate form inputs or intercepting synthetic autofill events. | The extension validates active tab domain and origin against user intent; values are injected via direct DOM property manipulation rather than clipboard or unvalidated global events. Vault policies restrict token release to active foreground tasks. | **CONTAINED** (Domain-bound execution) |
| **THREAT-F** | **Gemini API Key Theft** | Client-side bundle inspection attempts to extract the Gemini API credentials. | Zero API keys in extension package or client repository. Requests route through a dedicated server-side Next.js route handler (`/api/gemini/agent`) where `GEMINI_API_KEY` is loaded from server environment variables only. | **PROTECTED** (Server runtime isolation) |
| **THREAT-G** | **PII Leakage in Telemetry & Logs** | Debug logs, error traces, or dashboard events accidentally record plaintext secrets. | Strict logging policy: only token IDs (`EMAIL_001`), component names, timestamps, and action types are emitted. Payload sanitizer scrubs all logs. Automated tests scan logs for known synthetic secrets. | **PROTECTED** (Zero raw PII in logs) |

---

### 3. Claim Boundaries (What We Do NOT Claim)

1. We do **not** claim mathematical perfection against all possible visual steganography or zero-day visual obfuscation.
2. We do **not** claim that third-party cloud models provide native zero-knowledge guarantees; our architecture eliminates the need to trust the cloud model by keeping raw data local.
3. Our verified claim is:
   > *"Our prototype enforces a local privacy boundary for the controlled data path and empirically verifies that zero raw test PII is transmitted in monitored Gemini-bound requests."*
