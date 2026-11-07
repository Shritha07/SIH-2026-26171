# Privacy Model & Data Sanitization Specification
## ISRO SIH Problem 26171: Privacy-Preserving Browser Vision Agent

### 1. Privacy Boundary & Tokenization Model

The Privacy Model guarantees that real user identifiers and sensitive credentials exist **only** within the user's local browser memory and encrypted storage.

```
+------------------------------------+------------------------------------+
|         REAL LOCAL VALUE           |            OPAQUE TOKEN            |
+------------------------------------+------------------------------------+
| Harish Kumar                       | PERSON_001                         |
| harish.kumar@example.com           | EMAIL_001                          |
| +91 98765 43210                    | PHONE_001                          |
| 42, Silicon Residency, Bengaluru   | ADDRESS_001                        |
| 1995-08-15                         | DOB_001                            |
| A1234567                           | PASSPORT_001                       |
| 3.8 / 4.0 CGPA                     | GPA_001                            |
+------------------------------------+------------------------------------+
```

#### Token Characteristics:
1. **Opaque & Non-Reversible**: A token does not contain an encrypted ciphertext or hash of the original value; it is an arbitrary monotonic or UUID-based index key.
2. **Context-Aware Category**: Prefixes (`PERSON_`, `EMAIL_`, `PHONE_`, `ADDRESS_`, `GOV_ID_`, `FIN_`) preserve semantic meaning so the reasoning agent knows *what kind of information* to place in a field without knowing *what the real value is*.
3. **Session / Task Scoped**: Tokens can be rotated per session or bound to specific test profiles.

---

### 2. Multi-Signal PII Detection Engine

The local detector evaluates four complementary signal layers:

```
                  [ Web Page Viewport ]
                            |
       +--------------------+--------------------+
       |                                         |
       v                                         v
[ DOM Attribute Heuristics ]           [ Visual & Canvas OCR ]
- autocomplete="email|tel|..."         - On-device text bounding
- type="email|password|tel"            - Rendered text recognition
- name / id semantic matches           - Image-embedded badges/labels
       |                                         |
       +--------------------+--------------------+
                            |
                            v
              [ Regex Pattern Classifier ]
              - Email RFC 5322 standard
              - E.164 & Regional phone formats
              - Structured Government & Financial IDs
              - Postal/ZIP & Street address heuristics
                            |
                            v
                 [ Unified PII Entity List ]
```

---

### 3. Canvas-Level Visual Redaction Engine

When a screenshot is captured for cloud visual grounding:
1. Coordinates $(x, y, w, h)$ of all detected PII fields and text regions are mapped to canvas coordinates.
2. A multi-pass canvas redaction is applied:
   - **Solid Dark Masking**: Fills sensitive bounding boxes with `#1E293B` (slate-800) solid rectangle.
   - **Visual Token Watermarking**: Paints the token text (e.g. `[EMAIL_001]`) centered inside the masked box in contrasting monospace font `#38BDF8` (sky-400).
   - **Padding & Context Margin**: Adds a 4px safety dilation border around sensitive bounds to prevent character ascender/descender leakage.
3. The resulting image is encoded as a WebP/JPEG data URL for the cloud model.

```
RAW VIEW (Local Canvas):
+-------------------------------------------------------+
|  Customer Email: harish.kumar@example.com              |
+-------------------------------------------------------+

SANITIZED VIEW (Transmitted to Gemini):
+-------------------------------------------------------+
|  Customer Email: [EMAIL_001]                          |
+-------------------------------------------------------+
```

---

### 4. Local Encrypted Vault (Web Crypto API)

1. **Algorithm**: `AES-GCM-256` with PBKDF2 key derivation (100,000 iterations of SHA-256).
2. **Storage**: Browser `IndexedDB` or `chrome.storage.local`.
3. **Key Isolation**: Vault decryption keys remain exclusively in ephemeral memory during the active session.
4. **Zero Telemetry**: No vault contents or decrypted values are ever attached to analytics, error telemetry, or console logs.
