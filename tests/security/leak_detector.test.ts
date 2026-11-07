import { describe, it, expect } from 'vitest';
import {
  CanaryLeakDetector,
  PIIDetectionEngine,
} from '../../packages/privacy-core/src';

describe('Security & Canary Leak Detector', () => {
  const detector = new CanaryLeakDetector();

  it('detects unmasked canary secrets in raw telemetry or payloads', () => {
    const rawPayloadWithCanary = {
      prompt: 'User profile data',
      rawSecret: 'SUPER_SECRET_HARISH_928374',
      email: 'harish.kumar@example.com',
    };

    const audit = detector.auditPayload(rawPayloadWithCanary);
    expect(audit.isClean).toBe(false);
    expect(audit.rawPiiLeaksFound).toBeGreaterThanOrEqual(1);
    expect(audit.leakedItems.some(item => item.field.includes('Canary') || item.field.includes('Email'))).toBe(true);
  });

  it('verifies 0 raw leaks when sanitized state with opaque tokens is audited', () => {
    const engine = new PIIDetectionEngine();
    const elements = [
      {
        id: 1,
        tag: 'input',
        type: 'email',
        name: 'email',
        value: 'harish.kumar@example.com',
        isInteractive: true,
        bbox: { x: 0, y: 0, width: 100, height: 30 },
      },
      {
        id: 2,
        tag: 'input',
        type: 'tel',
        name: 'phone',
        value: '+91 9876543210',
        isInteractive: true,
        bbox: { x: 0, y: 40, width: 100, height: 30 },
      },
    ];

    const sanitizedResult = engine.detectAndSanitizeElements(elements);
    const sanitizedPayloadToSend = {
      action: 'FILL_FIELD',
      sanitizedElements: sanitizedResult.sanitizedElements,
      activeTokens: engine.getTokenRegistry().getActiveTokens().map(t => t.token),
    };

    const audit = detector.auditPayload(sanitizedPayloadToSend);
    expect(audit.isClean).toBe(true);
    expect(audit.rawPiiLeaksFound).toBe(0);
    expect(audit.opaqueTokensFound).toContain('EMAIL_001');
    expect(audit.opaqueTokensFound).toContain('PHONE_001');
  });
});
