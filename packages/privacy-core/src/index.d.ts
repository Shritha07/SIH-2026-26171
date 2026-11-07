import { LocalTokenRegistry } from './token-registry';
import { LocalSecureVault } from './vault-crypto';
import { CanvasRedactionEngine } from './canvas-redactor';
import { CanaryLeakDetector } from './leak-detector';
import type { PIIEntity, PIICategory, SanitizedDOMElement, BoundingBox } from '@privacy-agent/shared-types';
export * from './pii-patterns';
export * from './token-registry';
export * from './vault-crypto';
export * from './canvas-redactor';
export * from './leak-detector';
export interface DetectionOptions {
    profileId?: string;
    enableRegex?: boolean;
    enableDomSemantics?: boolean;
    enableVaultMatching?: boolean;
}
export declare class PIIDetectionEngine {
    private tokenRegistry;
    private vault;
    private redactor;
    private leakDetector;
    constructor(tokenRegistry?: LocalTokenRegistry, vault?: LocalSecureVault);
    getTokenRegistry(): LocalTokenRegistry;
    getVault(): LocalSecureVault;
    getRedactor(): CanvasRedactionEngine;
    getLeakDetector(): CanaryLeakDetector;
    /**
     * Scans an element's DOM attributes to classify whether it represents a sensitive PII input.
     */
    classifyElementDomSemantics(element: {
        tag: string;
        type?: string;
        name?: string;
        id?: string;
        placeholder?: string;
        ariaLabel?: string;
        autocomplete?: string;
        value?: string;
    }): {
        isSensitive: boolean;
        category?: PIICategory;
        confidence: number;
    };
    /**
     * Scans a set of interactive elements and detects all sensitive PII items, assigning local tokens.
     */
    detectAndSanitizeElements(elements: Array<{
        id: number;
        tag: string;
        type?: string;
        name?: string;
        placeholder?: string;
        label?: string;
        value?: string;
        text?: string;
        bbox: BoundingBox;
        isInteractive: boolean;
        attributes?: Record<string, string>;
    }>, options?: DetectionOptions): {
        sanitizedElements: SanitizedDOMElement[];
        detectedEntities: PIIEntity[];
    };
}
//# sourceMappingURL=index.d.ts.map