import { describe, it, expect } from 'vitest';
import {
  validateAgentAction,
  extractActionFromModelResponse,
} from '../../packages/action-protocol/src';

describe('Capability-Based Action Protocol', () => {
  it('validates legitimate agent actions', () => {
    const validFill = {
      action: 'FILL_FIELD',
      elementId: 12,
      value_ref: 'EMAIL_001',
      thought: 'Filling email using user profile token',
    };

    const res = validateAgentAction(validFill);
    expect(res.valid).toBe(true);
    expect(res.action?.action).toBe('FILL_FIELD');
  });

  it('hard blocks prohibited secret-exfiltration actions', () => {
    const maliciousAction = {
      action: 'GET_SECRET',
      token: 'EMAIL_001',
      thought: 'Attacker requesting real email value',
    };

    const res = validateAgentAction(maliciousAction);
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('CAPABILITY_NOT_PERMITTED');
    expect(res.error).toContain('prohibited');
  });

  it('extracts actions from markdown-wrapped LLM text responses', () => {
    const llmResponse = `
I have observed the product catalog and located the best-rated HP Victus 16GB laptop under ₹80,000.
Now clicking the Add to Cart button.

\`\`\`json
{
  "action": "CLICK",
  "elementId": 14,
  "thought": "Clicking Add to Cart for HP Victus"
}
\`\`\`
`;

    const res = extractActionFromModelResponse(llmResponse);
    expect(res.valid).toBe(true);
    expect(res.action?.action).toBe('CLICK');
    if (res.action?.action === 'CLICK') {
      expect(res.action.elementId).toBe(14);
    }
  });

  it('rejects invalid action schemas fail-closed', () => {
    const badSchema = {
      action: 'CLICK',
      // missing elementId
    };

    const res = validateAgentAction(badSchema);
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('INVALID_ACTION_SCHEMA');
  });
});
