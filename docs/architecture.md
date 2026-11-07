# ISRO SIH Problem 26171: Architecture Specification
## On-device Visual Perception for Light-weight Browser Agents

### 1. Architectural Overview & System Boundary

The core security and architectural invariant of this system is:
**"Gemini controls task reasoning; the local device controls sensitive data."**

```
+---------------------------------------------------------------------------------------------------+
|                                      TRUSTED LOCAL CLIENT ZONE                                    |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                                  CHROME BROWSER (MV3 EXTENSION)                             |  |
|  |                                                                                             |  |
|  |  +-----------------------+     +--------------------------+     +------------------------+  |  |
|  |  |    Active Web Page    | --> | Local Perception Engine  | --> |     Privacy Engine     |  |  |
|  |  |  - DOM Tree           |     | - DOM Semantic Parser    |     | - PII Detector (Regex, |  |  |
|  |  |  - Canvas/Screenshot  |     | - ONNX Web Vision Model  |     |   DOM semantics, OCR)  |  |  |
|  |  |  - Form Inputs        |     | - Interactive Tree Build |     | - Redaction Engine     |  |  |
|  |  +-----------^-----------+     +--------------------------+     | - Tokenizer & Mapper   |  |  |
|  |              |                                                  +-----------+------------+  |  |
|  |              |                                                              |               |  |
|  |              |                                                              v               |  |
|  |  +-----------+-----------+                                      +------------------------+  |  |
|  |  | Local Action Executor |                                      |   Local Secure Vault   |  |  |
|  |  | - Resolves Tokens     | <----------------------------------- | - WebCrypto AES-GCM    |  |  |
|  |  | - Simulates Events    |                                      | - IndexedDB / Storage  |  |  |
|  |  | - Fails Closed        |                                      | - Zero Cloud Sync      |  |  |
|  |  +-----------^-----------+                                      +------------------------+  |  |
|  +--------------|--------------------------------------------------------------|---------------+  |
+-----------------|--------------------------------------------------------------|------------------+
                  |                                                              |
                  | Action Request                                               | Sanitized State ONLY
                  | (e.g. FILL_FIELD value_ref: EMAIL_001)                       | (Masked Screenshot +
                  |                                                              |  Tokenized DOM Tree)
==================|==============================================================|===================
                  |                    NETWORK BOUNDARY                          |
==================|==============================================================|===================
                  |                                                              |
                  |                                                              v
+-----------------+---------------------------------------------------------------------------------+
|                                    UNTRUSTED / CLOUD AGENT ZONE                                   |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                                 SECURE GEMINI PROXY RUNTIME                                 |  |
|  |  - Server-side GEMINI_API_KEY isolation (never bundled in client extension)                 |  |
|  |  - Network Monitor Audit Hook (verifies 0 raw PII occurrences in payloads)                  |  |
|  +----------------------------------------------+----------------------------------------------+  |
|                                                 |                                                 |
|                                                 v                                                 |
|  +---------------------------------------------------------------------------------------------+  |
|  |                                    GEMINI REASONING ENGINE                                  |  |
|  |  - Multimodal Vision-Language Reasoning over Sanitized View                                 |  |
|  |  - Emits Capability-Based Actions (Referencing Tokens e.g. PERSON_001, EMAIL_001)           |  |
|  |  - Zero Knowledge of Plaintext Secrets                                                      |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

### 2. Core Subsystems

#### 2.1 Local Perception Pipeline
1. **DOM Semantics Extractor**: Traverses the active viewport, captures interactable elements (`<input>`, `<button>`, `<a>`, `<select>`, `<textarea>`, custom ARIA widgets), computes bounding rects, and extracts semantic attributes (`type`, `autocomplete`, `aria-label`, `placeholder`, `name`, `id`).
2. **Screenshot & Visual Capture**: Uses `chrome.tabs.captureVisibleTab` to acquire high-fidelity screen frames.
3. **On-Device Vision & OCR Engine**:
   - Executes via **ONNX Runtime Web** (`onnxruntime-web`) utilizing WebGPU acceleration (with fallback to multi-threaded WASM/SIMD).
   - Performs UI element localization, icon/button classification, and bounding box correlation.
   - Integrates local OCR and regex patterns to identify visual text elements not directly exposed in DOM nodes (e.g., rendered canvas, SVG badges, dynamic text).

#### 2.2 Privacy & Sanitization Engine
1. **Multi-Signal PII Detector**:
   - **DOM Attributes**: `autocomplete="email"`, `type="password"`, `name="ssn"`, etc.
   - **Deterministic Patterns**: Validated regex suites for Email, Phone numbers (international and national formats), Physical Addresses, Identification numbers (PAN, Aadhaar, Passport synthetics, Credit Card numbers), and Full Names.
   - **Visual / OCR Matching**: Scans rendered text regions.
2. **Canvas-Level Visual Redaction**:
   - Applies pixel-level bounding box masks (solid block overlay, blur, or token label watermark `[EMAIL_001]`) directly onto the client-side canvas.
   - Sanitized image is exported as a clean PNG/JPEG data URL for the cloud request. Raw image is NEVER sent over the wire.
3. **DOM & Text Sanitizer**:
   - Replaces plaintext values in interactive element representations with opaque tokens (`PERSON_001`, `EMAIL_001`, `PHONE_001`, `ADDRESS_001`, `GOV_ID_001`).

#### 2.3 Local Vault & Tokenization Subsystem
1. **Local Vault**:
   - Stores raw sensitive profiles locally using Web Crypto API (`AES-GCM-256` encryption).
   - Encryption keys remain in browser session memory or secure local storage; never synchronized to any cloud database.
2. **Token Registry**:
   - Maps `TOKEN_ID -> VaultFieldKey`.
   - The mapping is strictly local. Cloud agents only ever see and output `TOKEN_ID`.

#### 2.4 Capability-Based Action Executor
1. **Action Protocol**:
   - Receives structured JSON actions: `NAVIGATE`, `CLICK`, `TYPE`, `FILL_FIELD`, `SELECT`, `SCROLL`, `WAIT`, `FINISH_TASK`.
   - `FILL_FIELD(field_ref, value_ref)`: When `value_ref` is a token (e.g., `EMAIL_001`), the executor queries the local vault, retrieves the real value, and dispatches native browser input events (`input`, `change`, `keydown`, `keyup`, `blur`).
2. **Fail-Closed Security Layer**:
   - Unknown token -> `ERROR: UNKNOWN_VALUE_REFERENCE`.
   - Direct secret query (`GET_SECRET`) -> `ERROR: CAPABILITY_NOT_PERMITTED` (Hard blocked).
   - Insecure origin or invalid DOM target -> `ACTION_BLOCKED`.

#### 2.5 Observability & Judge Dashboard
1. **Agent Activity Panel**: Real-time action trace, task state, step history, and decision reasoning.
2. **Privacy Monitor Panel**: Real-time counter of PII items detected, protected tokens active, visual redaction masks applied, and 0 raw PII leakage confirmations.
3. **Network Monitor Panel**: Real-time audit log of all outbound requests to Gemini, payload inspector with live string-search verification proving 0 raw secrets sent.
4. **Adversarial Demo Suite**: One-click attack scenarios proving unauthorized secret exfiltration is blocked while authorized token actions succeed.
