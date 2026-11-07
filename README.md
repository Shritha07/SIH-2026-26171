# Privacy-Preserving Browser Vision Agent
## ISRO Smart India Hackathon Problem Statement 26171: "On-device Visual Perception for Light-weight Browser Agents"

> **"Gemini controls task reasoning; the local device controls sensitive data."**

An autonomous, Chrome-based browser AI agent architecture where lightweight on-device visual perception and local privacy sanitization ensure sensitive user information (PII/secrets) never leaves the user's browser, while Gemini performs high-level task planning and emits capability-based actions resolved locally.

---

## 🌟 Key Innovations & Privacy Guarantees

1. **Strict Local Privacy Boundary**: Client-side multi-signal PII detection (DOM attributes, OCR, regex suites, and on-device vision) identifies sensitive fields before any cloud communication.
2. **Visual & Structural Redaction**: Canvas-level bounding box masking replaces sensitive screen areas with opaque tokens (e.g. `[EMAIL_001]`) on the local device.
3. **Encrypted Local Vault & Tokenization**: Sensitive profiles are encrypted locally with WebCrypto `AES-GCM-256`. Gemini only receives opaque reference IDs.
4. **Capability-Based Action Protocol**: When Gemini commands `FILL_FIELD(elementId, "EMAIL_001")`, the local extension resolves the token internally and fills the browser input directly. Raw secrets are never returned to the model.
5. **Fail-Closed Security Model**: Direct secret extraction attempts (`GET_SECRET`, "What is EMAIL_001?") are rejected with `CAPABILITY_NOT_PERMITTED`. Unknown tokens and pipeline errors fail safely.
6. **Live 3-Panel Observability Dashboard**: Real-time Agent Activity, Privacy Monitor (0 leaks counter), and Outbound Network Monitor with canary verification.
7. **Five Realistic Demo Websites**: Full multi-step web applications spanning E-Commerce, Job Applications, Flight Booking, Clinic Appointments, and Insurance Comparisons.

---

## 📁 Repository Structure

```
privacy-browser-agent/
│
├── apps/
│   ├── extension/               # Chrome Manifest V3 Extension (TypeScript + React)
│   │   ├── src/
│   │   │   ├── background/      # Service worker, session state, agent orchestrator
│   │   │   ├── content/         # DOM extractor, highlight overlays, input injector
│   │   │   ├── perception/      # DOM parser, canvas capture, ONNX Web runtime
│   │   │   ├── privacy/         # PII detector, token mapper, canvas redactor
│   │   │   ├── vault/           # WebCrypto AES-GCM local encrypted storage
│   │   │   ├── actions/         # Capability-based action executor & validator
│   │   │   └── ui/              # Extension popup and floating HUD
│   │   └── manifest.json
│   │
│   └── web/                     # Next.js 14+ Demo Platform & Judge Dashboard
│       ├── app/                 # Next.js App Router (Dashboard, Demos, APIs)
│       │   ├── dashboard/       # 3-Panel Judge Observability Dashboard
│       │   ├── demos/           # 5 Realistic Interactive Demo Environments
│       │   │   ├── ecommerce/   # Laptop store with filters, reviews, cart, checkout
│       │   │   ├── jobs/        # Job portal with listings, filters, multi-step application
│       │   │   ├── flights/     # Airline search, seat selection, passenger KYC
│       │   │   ├── healthcare/  # Clinic doctor search, slot picker, patient intake
│       │   │   └── insurance/   # Policy comparison, coverage calculator, application
│       │   └── api/
│       │       └── gemini/      # Secure Server-side Gemini Gateway (API Key isolation)
│       ├── components/          # Reusable UI widgets & telemetry panels
│       └── lib/                 # Shared utilities, event bus, canary verification
│
├── packages/
│   ├── action-protocol/         # Zod schemas & TypeScript interfaces for actions/events
│   ├── privacy-core/            # PII patterns, tokenizers, redaction canvas math
│   └── shared-types/            # Common domain types across extension & web
│
├── models/
│   └── local/                   # Lightweight ONNX vision models & weights
│
├── evaluation/
│   ├── benchmarks/              # 100+ annotated PII forms & synthetic datasets
│   ├── metrics/                 # Output benchmark metrics & JSON reports
│   └── scripts/                 # Automated benchmark runners (TS & Python)
│
├── tests/
│   ├── unit/                    # Vitest unit tests for tokenizers, vault, action executor
│   ├── security/                # Leak detection, canary scanner, adversarial tests
│   └── e2e/                     # End-to-end multi-step workflow verification
│
├── docs/                        # Complete architecture & security specifications
│   ├── architecture.md
│   ├── threat-model.md
│   ├── action-protocol.md
│   ├── privacy-model.md
│   └── evaluation-plan.md
│
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (Tested on v24.13.1)
- npm 9+
- Google Chrome browser
- Google Gemini API Key

### 2. Installation
```bash
# Clone the repository and install dependencies
git clone <repo-url>
cd cook_it
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` inside `apps/web`:
```bash
cp .env.example apps/web/.env.local
```
Add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Build the Project
```bash
# Build shared packages, demo web app, and Chrome extension
npm run build
```

### 5. Start the Demo Platform & Dashboard
```bash
npm run dev
# Opens at http://localhost:3000
```

### 6. Load the Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `apps/extension/dist` directory.
4. Pin the **Privacy Agent** extension icon.

---

## 🧪 Running Evaluations & Benchmarks

Run the automated evaluation suite:
```bash
# Run unit & security canary tests
npm run test

# Run full PII detection, redaction precision & latency benchmark suite
npm run evaluate
```

---

## 🛡️ Security & Privacy Notice
*This prototype strictly enforces on-device sanitization. The server-side gateway logs show zero occurrences of raw profile data, and all external agent payloads are auditable via the Live Network Monitor.*
