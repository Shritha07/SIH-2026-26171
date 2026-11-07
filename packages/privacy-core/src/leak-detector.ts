import { DEFAULT_SYNTHETIC_PROFILES } from './vault-crypto';
import type { VaultProfile } from '@privacy-agent/shared-types';

export interface LeakAuditReport {
  timestamp: number;
  isClean: boolean;
  rawPiiLeaksFound: number;
  leakedItems: Array<{ field: string; canarySample: string }>;
  opaqueTokensFound: string[];
  payloadSizeBytes: number;
}

export class CanaryLeakDetector {
  private knownCanarySecrets: Set<string> = new Set();
  private knownPlaintextValues: Map<string, string> = new Map(); // value -> label

  constructor(profiles: VaultProfile[] = DEFAULT_SYNTHETIC_PROFILES) {
    this.registerProfiles(profiles);
  }

  public registerProfiles(profiles: VaultProfile[]): void {
    for (const p of profiles) {
      if (p.fullName) this.knownPlaintextValues.set(p.fullName.toLowerCase(), `${p.profileName} Full Name`);
      if (p.email) this.knownPlaintextValues.set(p.email.toLowerCase(), `${p.profileName} Email`);
      if (p.phone) this.knownPlaintextValues.set(p.phone.replace(/[\s+-]/g, ''), `${p.profileName} Phone`);
      if (p.passportNumber) this.knownPlaintextValues.set(p.passportNumber.toLowerCase(), `${p.profileName} Passport`);
      if (p.nationalId) this.knownPlaintextValues.set(p.nationalId.replace(/\s/g, ''), `${p.profileName} National ID`);

      if (p.customFields) {
        for (const [k, v] of Object.entries(p.customFields)) {
          if (v && v.length > 3) {
            if (v.startsWith('SUPER_SECRET_')) {
              this.knownCanarySecrets.add(v);
            }
            this.knownPlaintextValues.set(v.toLowerCase(), `${p.profileName} ${k}`);
          }
        }
      }
    }
  }

  /**
   * Deeply scans any payload (string, object, array, or JSON) for sensitive data leakage.
   */
  public auditPayload(payload: unknown): LeakAuditReport {
    const rawString = typeof payload === 'string' ? payload : JSON.stringify(payload || '');
    const lowerString = rawString.toLowerCase();
    const normalizedDigits = rawString.replace(/[\s+-]/g, '');

    const leakedItems: Array<{ field: string; canarySample: string }> = [];
    const tokensFound: Set<string> = new Set();

    // 1. Check Canary Secrets
    for (const secret of this.knownCanarySecrets) {
      if (rawString.includes(secret)) {
        leakedItems.push({ field: 'Canary Secret', canarySample: secret });
      }
    }

    // 2. Check Plaintext Profile values
    for (const [val, label] of this.knownPlaintextValues.entries()) {
      if (val.length >= 4) {
        if (lowerString.includes(val) || (val.match(/^\d+$/) && normalizedDigits.includes(val))) {
          // If it matches an opaque token format (e.g. PERSON_001), it's not a raw leak
          if (!val.startsWith('person_') && !val.startsWith('email_') && !val.startsWith('phone_')) {
            leakedItems.push({ field: label, canarySample: val.slice(0, 3) + '***' });
          }
        }
      }
    }

    // 3. Extract opaque tokens (e.g. PERSON_001, EMAIL_001)
    const tokenRegex = /\b(PERSON|EMAIL|PHONE|ADDRESS|DOB|GOV_ID|FINANCIAL|SECRET)_[0-9]{3}\b/g;
    let match: RegExpExecArray | null;
    while ((match = tokenRegex.exec(rawString)) !== null) {
      tokensFound.add(match[0]);
    }

    return {
      timestamp: Date.now(),
      isClean: leakedItems.length === 0,
      rawPiiLeaksFound: leakedItems.length,
      leakedItems,
      opaqueTokensFound: Array.from(tokensFound),
      payloadSizeBytes: new TextEncoder().encode(rawString).length,
    };
  }
}
