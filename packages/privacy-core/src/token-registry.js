export class LocalTokenRegistry {
    categoryCounters = new Map();
    tokenToValueMap = new Map();
    valueToTokenMap = new Map();
    tokenMetadataMap = new Map();
    constructor() {
        this.reset();
    }
    reset() {
        this.categoryCounters.clear();
        this.tokenToValueMap.clear();
        this.valueToTokenMap.clear();
        this.tokenMetadataMap.clear();
    }
    /**
     * Registers a sensitive value and returns its assigned opaque token.
     * If value is already registered under this category, returns the existing token.
     */
    registerValue(rawValue, category, label = '') {
        const trimmed = rawValue.trim();
        if (!trimmed)
            return '';
        const lookupKey = `${category}:::${trimmed}`;
        const existing = this.valueToTokenMap.get(lookupKey);
        if (existing) {
            return existing;
        }
        const currentCount = (this.categoryCounters.get(category) || 0) + 1;
        this.categoryCounters.set(category, currentCount);
        const suffix = String(currentCount).padStart(3, '0');
        const token = `${category}_${suffix}`;
        this.tokenToValueMap.set(token, trimmed);
        this.valueToTokenMap.set(lookupKey, token);
        this.tokenMetadataMap.set(token, {
            token,
            category,
            label: label || `${category} #${currentCount}`,
            createdAt: Date.now(),
        });
        return token;
    }
    /**
     * Resolves a token to its real value locally.
     * NEVER expose this output to external or cloud callers.
     */
    resolveToken(token) {
        return this.tokenToValueMap.get(token) ?? null;
    }
    hasToken(token) {
        return this.tokenToValueMap.has(token);
    }
    getTokenMetadata(token) {
        return this.tokenMetadataMap.get(token);
    }
    /**
     * Returns list of all active tokens (opaque IDs + categories only; NO plaintext secrets).
     */
    getActiveTokens() {
        return Array.from(this.tokenMetadataMap.values());
    }
    /**
     * Sanitizes a string by replacing all known registered plaintext values with their opaque tokens.
     */
    sanitizeString(input) {
        if (!input)
            return input;
        let sanitized = input;
        // Sort registered values by length descending so longer substrings match first
        const registeredValues = Array.from(this.valueToTokenMap.entries()).sort((a, b) => b[0].split(':::')[1].length - a[0].split(':::')[1].length);
        for (const [key, token] of registeredValues) {
            const rawValue = key.split(':::')[1];
            if (rawValue.length > 2 && sanitized.includes(rawValue)) {
                sanitized = sanitized.split(rawValue).join(token);
            }
        }
        return sanitized;
    }
}
//# sourceMappingURL=token-registry.js.map