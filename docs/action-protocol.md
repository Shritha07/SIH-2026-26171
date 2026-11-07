# Capability-Based Action Protocol Specification
## ISRO SIH Problem 26171: Privacy-Preserving Browser Agent

### 1. Protocol Philosophy

The action protocol operates strictly under the principle of **least privilege and capability execution**.
The cloud reasoning agent (Gemini) can command browser interactions, but is prohibited from introspecting the contents of private data representations.

---

### 2. State & Action Lifecycle

```
[ Local Perception & Sanitization ]
                |
                v
       (Sanitized State JSON)
  - DOM Elements with numeric IDs & tokenized text
  - Redacted Screenshot (Base64 JPEG/PNG)
  - Available Tokens List: ["PERSON_001", "EMAIL_001", "PHONE_001", "ADDRESS_001"]
                |
                v
        [ Gemini Reasoning ]
                |
                v
        (Agent Action JSON)
  e.g. {"action": "FILL_FIELD", "elementId": 14, "value_ref": "EMAIL_001"}
                |
                v
     [ Local Action Executor ]
  - Verify element exists
  - Resolve "EMAIL_001" from Local Vault -> "harish@example.com"
  - Inject value locally into target DOM input
  - Emit status event to Observability Dashboard
```

---

### 3. Supported Actions

The protocol schema strictly allows only the following action types:

#### 3.1 `NAVIGATE`
Instructs the browser to navigate to a target URL.
```json
{
  "action": "NAVIGATE",
  "url": "http://localhost:3000/demos/ecommerce/cart",
  "thought": "Navigating to checkout page"
}
```

#### 3.2 `CLICK`
Clicks an interactive element by its identified element ID or selector coordinates.
```json
{
  "action": "CLICK",
  "elementId": 12,
  "thought": "Clicking Add to Cart button"
}
```

#### 3.3 `TYPE`
Types non-sensitive, public text into a field (e.g. search queries, filter values).
```json
{
  "action": "TYPE",
  "elementId": 5,
  "text": "HP Victus 16GB",
  "pressEnter": true,
  "thought": "Entering search term in catalog search box"
}
```

#### 3.4 `FILL_FIELD` (Capability Execution with Token)
Fills a sensitive form input using an opaque token reference.
```json
{
  "action": "FILL_FIELD",
  "elementId": 18,
  "value_ref": "EMAIL_001",
  "thought": "Filling customer email using saved user profile"
}
```
*Note: The cloud agent passes `value_ref: "EMAIL_001"`. The local extension resolves `EMAIL_001` to plaintext locally and sets `.value` on the input element without transmitting the value back.*

#### 3.5 `SELECT`
Selects an option from a `<select>` dropdown.
```json
{
  "action": "SELECT",
  "elementId": 9,
  "value": "16GB",
  "thought": "Selecting 16GB RAM filter"
}
```

#### 3.6 `SCROLL`
Scrolls the viewport or target container.
```json
{
  "action": "SCROLL",
  "direction": "down",
  "amount": 400,
  "thought": "Scrolling down to view customer reviews"
}
```

#### 3.7 `WAIT`
Pauses execution for dynamic page loading or async requests to settle.
```json
{
  "action": "WAIT",
  "durationMs": 1000,
  "thought": "Waiting for search results to load"
}
```

#### 3.8 `FINISH_TASK`
Marks the current user objective as successfully completed.
```json
{
  "action": "FINISH_TASK",
  "success": true,
  "summary": "HP Victus 16GB laptop added to cart and checkout address filled.",
  "thought": "Task completed successfully"
}
```

---

### 4. Prohibited Actions (Strictly Blocked by Schema)

The following actions are explicitly absent from the schema and will trigger an immediate security rejection if received:
- `GET_SECRET`
- `READ_VAULT`
- `DUMP_TOKENS`
- `EVAL_SCRIPT`
- `EXPORT_COOKIES`

---

### 5. Error Protocol & Fail-Closed Status Codes

When an action cannot be executed securely, the local executor halts execution and returns one of the following structured error codes:

| Error Code | Reason | Fail-Closed Action |
| :--- | :--- | :--- |
| `CAPABILITY_NOT_PERMITTED` | Prohibited or unrecognized action name attempted | Abort task, log security event |
| `UNKNOWN_VALUE_REFERENCE` | Requested token (e.g. `TOKEN_999`) does not exist in local vault | Abort task, notify dashboard |
| `TARGET_NOT_FOUND` | Target element ID does not match any node in current DOM | Re-capture state, prompt agent |
| `SECURITY_POLICY_VIOLATION`| Attempted cross-origin secret injection | Block execution immediately |
