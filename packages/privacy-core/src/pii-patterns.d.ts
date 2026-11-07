import type { PIICategory } from '@privacy-agent/shared-types';
export interface PIIPatternDefinition {
    category: PIICategory;
    name: string;
    regex: RegExp;
    confidence: number;
}
export declare const PII_PATTERNS: PIIPatternDefinition[];
export declare const SENSITIVE_DOM_KEYWORDS: Record<PIICategory, string[]>;
export declare const SENSITIVE_AUTOCOMPLETE_VALUES: Record<string, PIICategory>;
//# sourceMappingURL=pii-patterns.d.ts.map