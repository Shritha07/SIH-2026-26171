import type { VaultProfile } from '@privacy-agent/shared-types';
export interface LeakAuditReport {
    timestamp: number;
    isClean: boolean;
    rawPiiLeaksFound: number;
    leakedItems: Array<{
        field: string;
        canarySample: string;
    }>;
    opaqueTokensFound: string[];
    payloadSizeBytes: number;
}
export declare class CanaryLeakDetector {
    private knownCanarySecrets;
    private knownPlaintextValues;
    constructor(profiles?: VaultProfile[]);
    registerProfiles(profiles: VaultProfile[]): void;
    /**
     * Deeply scans any payload (string, object, array, or JSON) for sensitive data leakage.
     */
    auditPayload(payload: unknown): LeakAuditReport;
}
//# sourceMappingURL=leak-detector.d.ts.map