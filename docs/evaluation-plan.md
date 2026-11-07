# Evaluation & Benchmark Plan
## ISRO SIH Problem 26171: Privacy-Preserving Browser Vision Agent

### 1. Official Evaluation Metrics

The system measures and exports metrics across 6 key dimensions:

```
+------------------------------------+---------------------------------------------------------------+
| METRIC DIMENSION                   | DEFINITION & MEASUREMENT FORMULA                              |
+------------------------------------+---------------------------------------------------------------+
| 1. Visual Context Accuracy         | IoU & classification accuracy of interactive UI elements      |
|                                    | vs Ground Truth DOM/Visual annotations                        |
+------------------------------------+---------------------------------------------------------------+
| 2. PII Detection Precision         | Precision = TP / (TP + FP) across synthetic benchmark forms   |
+------------------------------------+---------------------------------------------------------------+
| 3. PII Detection Recall            | Recall = TP / (TP + FN) across synthetic benchmark forms      |
+------------------------------------+---------------------------------------------------------------+
| 4. Redaction Precision & Safety    | Percentage of sensitive pixels masked; Zero leakage rate      |
|                                    | in transmitted screenshots & DOM payloads                     |
+------------------------------------+---------------------------------------------------------------+
| 5. Client Resource Utilization     | Peak RAM (MB), CPU usage (%), WebGPU/WASM inference time (ms) |
|                                    | and model initialization latency                              |
+------------------------------------+---------------------------------------------------------------+
| 6. End-to-End Latency              | Task latency breakdown:                                       |
|                                    | T_total = T_perception + T_redaction + T_gemini + T_action    |
+------------------------------------+---------------------------------------------------------------+
```

---

### 2. Baseline Comparison Methodology

We compare two distinct execution pipelines across identical multi-step browser tasks:

1. **Baseline Pipeline (Unsanitized Cloud Agent)**:
   - Captures raw full-resolution browser screenshot.
   - Extracts raw unredacted DOM tree.
   - Sends raw context directly to cloud model.
   - Cloud model plans and returns standard actions.

2. **Privacy-Preserving Pipeline (Our System)**:
   - On-device visual perception & DOM parsing.
   - On-device PII detection (multi-signal ensemble).
   - Local tokenization & canvas-level bounding box redaction.
   - Transmits sanitized screenshot & tokenized state only.
   - Capability-based action execution with local token resolution from encrypted vault.

#### Comparison Matrix:
```
+--------------------------+-----------------------+-----------------------------+
| PARAMETER                | UNSANITIZED BASELINE  | PRIVACY-PRESERVING AGENT    |
+--------------------------+-----------------------+-----------------------------+
| Raw PII Transmitted      | Measured (> 0 items)  | 0 items (Empirically tested)|
| Task Success Rate        | Target: ~95%          | Target: ~95%                |
| Client Overhead          | Minimal (< 50ms)      | ~120 - 250ms (Local ML)     |
| E2E Security Invariant   | Fails (Data leaked)   | Maintained (Zero raw leak)  |
+--------------------------+-----------------------+-----------------------------+
```

---

### 3. Automated Benchmark Harness

The project includes an automated evaluation harness in `/evaluation`:
1. `benchmarks/pii_dataset.json`: 100+ annotated synthetic forms containing varying PII combinations (names, emails, phones, addresses, synthetic passport numbers, credit cards).
2. `scripts/run_benchmarks.ts` & `scripts/run_benchmarks.py`: Runs automated accuracy, precision, recall, and latency benchmarks, producing `evaluation/metrics/benchmark_results.json` and a formatted Markdown report.
3. `tests/security/leak_detector.test.ts`: Scans all intercepted network requests during test execution for synthetic test canary values (e.g. `SUPER_SECRET_HARISH_928374`) to verify 0 raw leaks.
