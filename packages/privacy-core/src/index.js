import { PII_PATTERNS, SENSITIVE_DOM_KEYWORDS, SENSITIVE_AUTOCOMPLETE_VALUES } from './pii-patterns';
import { LocalTokenRegistry } from './token-registry';
import { LocalSecureVault } from './vault-crypto';
import { CanvasRedactionEngine } from './canvas-redactor';
import { CanaryLeakDetector } from './leak-detector';
export * from './pii-patterns';
export * from './token-registry';
export * from './vault-crypto';
export * from './canvas-redactor';
export * from './leak-detector';
export class PIIDetectionEngine {
    tokenRegistry;
    vault;
    redactor;
    leakDetector;
    constructor(tokenRegistry, vault) {
        this.tokenRegistry = tokenRegistry || new LocalTokenRegistry();
        this.vault = vault || new LocalSecureVault();
        this.redactor = new CanvasRedactionEngine();
        this.leakDetector = new CanaryLeakDetector(this.vault.getAllProfiles());
    }
    getTokenRegistry() {
        return this.tokenRegistry;
    }
    getVault() {
        return this.vault;
    }
    getRedactor() {
        return this.redactor;
    }
    getLeakDetector() {
        return this.leakDetector;
    }
    /**
     * Scans an element's DOM attributes to classify whether it represents a sensitive PII input.
     */
    classifyElementDomSemantics(element) {
        // 1. Check autocomplete standard attributes
        if (element.autocomplete) {
            const autoVal = element.autocomplete.toLowerCase().trim();
            if (SENSITIVE_AUTOCOMPLETE_VALUES[autoVal]) {
                return {
                    isSensitive: true,
                    category: SENSITIVE_AUTOCOMPLETE_VALUES[autoVal],
                    confidence: 0.99,
                };
            }
        }
        // 2. Check input types
        const type = (element.type || '').toLowerCase();
        if (type === 'email')
            return { isSensitive: true, category: 'EMAIL', confidence: 0.98 };
        if (type === 'tel')
            return { isSensitive: true, category: 'PHONE', confidence: 0.95 };
        if (type === 'password')
            return { isSensitive: true, category: 'SECRET', confidence: 0.99 };
        if (type === 'date')
            return { isSensitive: true, category: 'DOB', confidence: 0.90 };
        // 3. Check name, id, placeholder, label keywords
        const searchString = `${element.name || ''} ${element.id || ''} ${element.placeholder || ''} ${element.ariaLabel || ''}`.toLowerCase();
        for (const [category, keywords] of Object.entries(SENSITIVE_DOM_KEYWORDS)) {
            for (const kw of keywords) {
                const regex = new RegExp(`(?:^|[_-]|\\b)${kw}(?:$|[_-]|\\b)`, 'i');
                if (regex.test(searchString)) {
                    return {
                        isSensitive: true,
                        category,
                        confidence: 0.94,
                    };
                }
            }
        }
        return { isSensitive: false, confidence: 0 };
    }
    /**
     * Scans a set of interactive elements and detects all sensitive PII items, assigning local tokens.
     */
    detectAndSanitizeElements(elements, options = {}) {
        const detectedEntities = [];
        const sanitizedElements = [];
        // Pre-populate tokens from active vault profile
        const profile = this.vault.getProfile(options.profileId || 'profile_primary_harish');
        if (profile && options.enableVaultMatching !== false) {
            if (profile.fullName)
                this.tokenRegistry.registerValue(profile.fullName, 'PERSON', 'User Full Name');
            if (profile.email)
                this.tokenRegistry.registerValue(profile.email, 'EMAIL', 'User Email');
            if (profile.phone)
                this.tokenRegistry.registerValue(profile.phone, 'PHONE', 'User Phone');
            if (profile.address)
                this.tokenRegistry.registerValue(profile.address, 'ADDRESS', 'User Street Address');
            if (profile.dob)
                this.tokenRegistry.registerValue(profile.dob, 'DOB', 'User Date of Birth');
            if (profile.passportNumber)
                this.tokenRegistry.registerValue(profile.passportNumber, 'GOV_ID', 'Passport Number');
            if (profile.nationalId)
                this.tokenRegistry.registerValue(profile.nationalId, 'GOV_ID', 'National ID');
            if (profile.customFields?.canarySecret) {
                this.tokenRegistry.registerValue(profile.customFields.canarySecret, 'SECRET', 'Canary Secret');
            }
        }
        for (const el of elements) {
            let isMasked = false;
            let tokenRef = undefined;
            let sanitizedValue = el.value || '';
            let sanitizedLabel = el.label || el.text || '';
            // 1. Check DOM semantics
            const domCheck = this.classifyElementDomSemantics({
                tag: el.tag,
                type: el.type,
                name: el.name,
                placeholder: el.placeholder,
                ariaLabel: el.label,
                autocomplete: el.attributes?.autocomplete,
                value: el.value,
            });
            if (domCheck.isSensitive && domCheck.category) {
                isMasked = true;
                if (el.value && el.value.trim()) {
                    tokenRef = this.tokenRegistry.registerValue(el.value, domCheck.category, el.name || el.placeholder);
                    sanitizedValue = `[${tokenRef}]`;
                }
                else {
                    tokenRef = `${domCheck.category}_001`;
                }
                detectedEntities.push({
                    id: `entity_${el.id}_${domCheck.category}`,
                    category: domCheck.category,
                    rawValue: el.value || '',
                    token: tokenRef,
                    bbox: el.bbox,
                    confidence: domCheck.confidence,
                    detectionSource: 'DOM_SEMANTICS',
                    elementId: el.id,
                });
            }
            // 2. Check Text / Value regexes if not already classified
            if (!isMasked && (el.value || el.text)) {
                const textToScan = `${el.value || ''} ${el.text || ''}`.trim();
                for (const pattern of PII_PATTERNS) {
                    const matches = textToScan.match(pattern.regex);
                    if (matches && matches.length > 0) {
                        isMasked = true;
                        const matchedValue = matches[0];
                        tokenRef = this.tokenRegistry.registerValue(matchedValue, pattern.category, pattern.name);
                        sanitizedValue = this.tokenRegistry.sanitizeString(sanitizedValue);
                        sanitizedLabel = this.tokenRegistry.sanitizeString(sanitizedLabel);
                        detectedEntities.push({
                            id: `entity_regex_${el.id}_${pattern.category}`,
                            category: pattern.category,
                            rawValue: matchedValue,
                            token: tokenRef,
                            bbox: el.bbox,
                            confidence: pattern.confidence,
                            detectionSource: 'REGEX',
                            elementId: el.id,
                        });
                        break;
                    }
                }
            }
            // 3. Sanitize general text using registry
            sanitizedValue = this.tokenRegistry.sanitizeString(sanitizedValue);
            sanitizedLabel = this.tokenRegistry.sanitizeString(sanitizedLabel);
            sanitizedElements.push({
                id: el.id,
                tag: el.tag,
                type: el.type,
                name: el.name,
                role: el.attributes?.role,
                label: sanitizedLabel,
                placeholder: el.placeholder,
                value: sanitizedValue,
                isMasked,
                tokenRef,
                bbox: el.bbox,
                isInteractive: el.isInteractive,
                attributes: el.attributes,
            });
        }
        return {
            sanitizedElements,
            detectedEntities,
        };
    }
}
//# sourceMappingURL=index.js.map