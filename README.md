# Privacy-Preserving Browser Vision Agent

### On-device Visual Perception for Lightweight Browser Agents

**Smart India Hackathon 2026 | Problem Statement 26171**

An autonomous browser agent designed to interact with web applications while keeping sensitive user information under local control.

The system combines browser-side DOM perception, local PII detection and tokenization, capability-based action execution, and LLM-powered task reasoning. Instead of directly exposing sensitive values to the language model, the architecture aims to keep their identification and handling within the browser.

**Core principle: The cloud handles reasoning. The browser retains control of sensitive information.**

---

## 1. Problem & Approach

Browser agents can automate repetitive web tasks, but interacting with real websites often requires access to personal information such as names, email addresses, phone numbers, financial details, and identity information.

Sending this information directly to an external language model introduces privacy and security risks.

This project explores a different approach: separating task reasoning from sensitive data handling.

The browser extension collects relevant page information, processes it through a local privacy layer, and provides sanitized context to the agent. The agent returns structured actions, which are validated and executed locally by the extension.

The objective is to make browser automation useful without treating the language model as the owner of a user's private information.

---

## 2. System Architecture

The system is organized into three main components:

1. **Chrome Extension:** Handles browser interaction, DOM extraction, local privacy processing, and action execution.
2. **Privacy Core:** Provides PII detection, tokenization, redaction utilities, and encrypted local storage.
3. **Agent Gateway & Dashboard:** Handles model communication, task orchestration, telemetry, and demonstration workflows.

### High-Level Architecture

```text
                     USER
                       |
                       v
                Chrome Browser
                       |
                       v
              Chrome Extension
                       |
              DOM Perception Layer
                       |
                       v
              Local Privacy Core
                       |
              PII Detection
              Tokenization
              Sanitization
                       |
                       v
                Sanitized State
                       |
                       v
              Agent Gateway
                       |
                       v
                Gemini API
                       |
                Task Reasoning
                       |
                       v
               Structured Action
                       |
                       v
             Local Action Executor
                       |
                       v
               Browser Interaction
```

The separation between perception, privacy processing, reasoning, and execution makes the system easier to inspect, test, and extend.

---

## 3. Core Components

### 3.1 Browser Perception

The Chrome extension uses a Manifest V3 architecture.

The DOM perception layer extracts relevant interactive elements from the active webpage, including:

- Buttons and links
- Text inputs and text areas
- Dropdowns and selection controls
- Labels and headings
- Element identifiers and accessibility-related attributes
- Element positions and bounding boxes

The extracted information is passed through the local privacy processing layer before being included in the agent's browser-state payload.

The extension also supports local highlighting and browser action execution.

### 3.2 Privacy Core

The privacy core is responsible for identifying and sanitizing sensitive information before browser state is shared with the reasoning service.

Its main components include:

| Component | Responsibility |
|---|---|
| PII Detection Engine | Identifies potentially sensitive information |
| PII Patterns | Defines detection patterns for common personal data |
| Token Registry | Maps sensitive values to opaque references |
| Canvas Redactor | Provides bounding-box-based redaction utilities |
| Leak Detector | Checks for sensitive information in outbound data |
| Secure Vault | Provides encrypted local storage utilities |

### 3.3 PII Detection & Tokenization

The detection layer uses DOM semantics and pattern matching to identify common sensitive information.

Examples include:

- Email addresses
- Phone numbers
- Aadhaar-like identifiers
- PAN-like identifiers
- Credit card numbers
- Dates of birth
- Password-related fields

Detected values can be replaced with opaque references.

Example:

```text
Original value:
shritha@example.com

Sanitized representation:
[EMAIL_001]
```

The token registry maintains the mapping required for local resolution.

The intention is that the language model works with references rather than receiving the underlying sensitive values.

### 3.4 Encrypted Local Storage

The secure vault uses the browser's Web Crypto API and AES-GCM encryption utilities.

Its purpose is to keep sensitive profile information in local storage rather than placing raw values inside the agent's reasoning context.

Encryption, key derivation, and secret lifecycle management are important parts of the security model and require careful configuration before production use.

### 3.5 Capability-Based Action Execution

The action protocol separates what the model can request from what the browser is allowed to execute.

Instead of giving the model unrestricted access to browser data, the extension receives structured actions and resolves them locally.

Example action:

```json
{
  "action": "FILL_FIELD",
  "elementId": "field_001",
  "value": "EMAIL_001"
}
```

The local execution layer is responsible for validating and performing the requested browser operation.

This design provides a foundation for restricting access to sensitive values and preventing arbitrary secret extraction.

---

## 4. Agent Reasoning & Gateway

The project uses a server-side Gemini gateway for task reasoning.

The Chrome extension communicates with the local Next.js application, which handles the model request.

The general workflow is:

```text
User Task
    |
    v
Browser State Extraction
    |
    v
Local Sanitization
    |
    v
Agent Gateway
    |
    v
Gemini Reasoning
    |
    v
Structured Action
    |
    v
Local Validation
    |
    v
Browser Execution
```

Keeping the Gemini API key on the server avoids embedding the key directly into the Chrome extension.

The gateway acts as the communication boundary between the browser extension and the reasoning model.

---

## 5. Demonstration Environment

The project includes a Next.js demonstration platform with five interactive web environments.

| Demo | Workflow |
|---|---|
| E-Commerce | Product discovery, filtering, cart, and checkout |
| Job Applications | Job listings, filtering, and application workflows |
| Flight Booking | Flight search, seat selection, and passenger information |
| Healthcare | Doctor discovery, appointment selection, and patient intake |
| Insurance | Policy comparison, coverage calculations, and applications |

These environments provide controlled workflows for demonstrating browser interaction, form handling, and privacy-related scenarios.

---

## 6. Dashboard & Observability

The project includes a dashboard for observing agent activity and system behaviour.

The monitoring interface is intended to make the browser agent's operations easier to inspect.

Key areas include:

- Agent activity and execution status
- Privacy-related events
- Browser interaction telemetry
- Gateway communication
- Evaluation and benchmark information

Observability is particularly important for privacy-focused automation because it allows developers and evaluators to inspect what the agent is doing rather than treating it as a black box.

A displayed zero-leak counter should be interpreted as an observed result of the configured checks, not as proof that every possible privacy leak has been eliminated.

---

## 7. Evaluation & Testing

The repository includes unit tests, security-related tests, and evaluation utilities.

The testing structure is organized around three areas:

| Area | Purpose |
|---|---|
| Unit Testing | Validates individual components and utilities |
| Security Testing | Checks sanitization and sensitive-data leakage scenarios |
| Evaluation | Measures privacy-related behaviour and system performance |

Run the available test suite:

```bash
npm test
```

Run the evaluation scripts:

```bash
npm run evaluate
```

Build the project:

```bash
npm run build
```

Evaluation results should be interpreted according to the actual test coverage and benchmark methodology.

---

## 8. Engineering Decisions

### Local privacy processing

Sensitive data processing is placed inside the browser extension rather than delegated entirely to the cloud.

### DOM-based perception

The extension extracts structured webpage information, making interactive elements easier to identify and operate on.

### Tokenization instead of direct exposure

Opaque references provide a mechanism for separating sensitive values from the agent's reasoning context.

### Server-side model communication

The Gemini API key is kept outside the extension and accessed through the application gateway.

### Structured action execution

The model communicates through defined actions rather than directly manipulating the browser.

### Modular architecture

Perception, privacy processing, action execution, and shared data structures are maintained as separate packages or modules.

---

## 9. Technology Stack

| Layer | Technology |
|---|---|
| Programming Language | TypeScript, JavaScript |
| Browser Extension | Chrome Manifest V3 |
| Extension UI | React |
| Frontend Framework | Next.js |
| Styling | Tailwind CSS |
| Agent Reasoning | Google Gemini API |
| Privacy Processing | Custom TypeScript modules |
| Encryption | Web Crypto API |
| Inference Runtime Dependency | ONNX Runtime Web |
| Testing | Vitest |
| Build Tool | Vite |
| Package Management | npm |

**Implementation note:** ONNX Runtime Web is included as a dependency, but actual ONNX model inference is not yet integrated into the current vision engine.

---

## 10. Repository Structure

```text
SIH-2026-26171/
│
├── apps/
│   ├── extension/
│   │   ├── src/
│   │   │   ├── actions/
│   │   │   ├── background/
│   │   │   ├── content/
│   │   │   ├── perception/
│   │   │   └── ui/
│   │   ├── manifest.json
│   │   └── package.json
│   │
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── api/
│           │   ├── dashboard/
│           │   ├── demos/
│           │   └── evaluation/
│           └── components/
│
├── packages/
│   ├── action-protocol/
│   ├── privacy-core/
│   └── shared-types/
│
├── docs/
│   ├── architecture.md
│   ├── action-protocol.md
│   ├── evaluation-plan.md
│   ├── privacy-model.md
│   └── threat-model.md
│
├── evaluation/
│   ├── benchmarks/
│   ├── metrics/
│   └── scripts/
│
├── tests/
│   ├── unit/
│   └── security/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 11. Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- Google Chrome
- Gemini API key

### Clone the repository

```bash
git clone https://github.com/Shritha07/SIH-2026-26171.git

cd SIH-2026-26171
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create:

```text
apps/web/.env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit this file or expose the key in the browser extension.

### Build the project

```bash
npm run build
```

### Start the application

```bash
npm run dev
```

The local application is available at:

```text
http://localhost:3000
```

### Load the Chrome extension

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable Developer Mode.
4. Select **Load unpacked**.
5. Choose the `apps/extension/dist` directory.
6. Pin the extension to the browser toolbar.

---

## 12. Current Implementation Status & Limitations

The project is being developed incrementally. Some architectural components are implemented, while others still require integration and validation.

| Component | Current status |
|---|---|
| Chrome Manifest V3 extension | Implemented |
| DOM-based perception | Implemented |
| PII detection and tokenization | Implemented |
| Privacy-core utilities | Implemented |
| Encrypted vault utilities | Implemented |
| Structured action execution | Implemented |
| Next.js gateway | Implemented |
| Demonstration websites | Implemented |
| Dashboard and telemetry | Implemented |
| ONNX Runtime dependency | Installed |
| Actual ONNX model inference | Pending |
| Screenshot capture pipeline | Pending |
| Integrated visual element detection | Pending |
| End-to-end privacy verification | Requires further testing |

The current vision engine contains placeholder inference logic. Actual visual perception requires screenshot capture, a compatible trained ONNX model, preprocessing, inference, and integration with the extension.

The privacy model also requires continued security testing, particularly around task prompts, URLs, telemetry, and all outbound payload fields.

These are active engineering areas rather than claims of completed functionality.


## 13. Project Objective

The broader objective is to explore how browser automation can become more privacy-aware without sacrificing useful task reasoning.

By separating local data handling from cloud-based reasoning, the project aims to provide a more controlled architecture for autonomous browser interaction.

The focus is not simply on making a browser agent perform tasks, but on understanding what information it accesses, what information it shares, and what actions it is permitted to perform.

**Smart India Hackathon 2026 — Problem Statement 26171**