import type { PIICategory, PrivacyToken } from '@privacy-agent/shared-types';

export class LocalTokenRegistry {
  private categoryCounters: Map<PIICategory, number> = new Map();
  private tokenToValueMap: Map<string, string> = new Map();
  private valueToTokenMap: Map<string, string> = new Map();
  private tokenMetadataMap: Map<string, PrivacyToken> = new Map();

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.categoryCounters.clear();
    this.tokenToValueMap.clear();
    this.valueToTokenMap.clear();
    this.tokenMetadataMap.clear();
  }

  /**
   * Registers a sensitive value and returns its assigned opaque token.
   * If value is already registered under this category, returns the existing token.
   */
  public registerValue(rawValue: string, category: PIICategory, label = ''): string {
    const trimmed = rawValue.trim();
    if (!trimmed) return '';

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
  public resolveToken(token: string): string | null {
    return this.tokenToValueMap.get(token) ?? null;
  }

  public hasToken(token: string): boolean {
    return this.tokenToValueMap.has(token);
  }

  public getTokenMetadata(token: string): PrivacyToken | undefined {
    return this.tokenMetadataMap.get(token);
  }

  /**
   * Returns list of all active tokens (opaque IDs + categories only; NO plaintext secrets).
   */
  public getActiveTokens(): PrivacyToken[] {
    return Array.from(this.tokenMetadataMap.values());
  }

  /**
   * Sanitizes a string by replacing all known registered plaintext values with their opaque tokens.
   */
  public sanitizeString(input: string): string {
    if (!input) return input;
    let sanitized = input;

    // Sort registered values by length descending so longer substrings match first
    const registeredValues = Array.from(this.valueToTokenMap.entries()).sort(
      (a, b) => b[0].split(':::')[1].length - a[0].split(':::')[1].length
    );

    for (const [key, token] of registeredValues) {
      const rawValue = key.split(':::')[1];
      if (rawValue.length > 2 && sanitized.includes(rawValue)) {
        sanitized = sanitized.split(rawValue).join(token);
      }
    }

    return sanitized;
  }
}
