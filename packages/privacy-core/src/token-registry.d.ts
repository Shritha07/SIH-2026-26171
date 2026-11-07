import type { PIICategory, PrivacyToken } from '@privacy-agent/shared-types';
export declare class LocalTokenRegistry {
    private categoryCounters;
    private tokenToValueMap;
    private valueToTokenMap;
    private tokenMetadataMap;
    constructor();
    reset(): void;
    /**
     * Registers a sensitive value and returns its assigned opaque token.
     * If value is already registered under this category, returns the existing token.
     */
    registerValue(rawValue: string, category: PIICategory, label?: string): string;
    /**
     * Resolves a token to its real value locally.
     * NEVER expose this output to external or cloud callers.
     */
    resolveToken(token: string): string | null;
    hasToken(token: string): boolean;
    getTokenMetadata(token: string): PrivacyToken | undefined;
    /**
     * Returns list of all active tokens (opaque IDs + categories only; NO plaintext secrets).
     */
    getActiveTokens(): PrivacyToken[];
    /**
     * Sanitizes a string by replacing all known registered plaintext values with their opaque tokens.
     */
    sanitizeString(input: string): string;
}
//# sourceMappingURL=token-registry.d.ts.map