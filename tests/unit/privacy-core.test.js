import { describe, it, expect, beforeEach } from 'vitest';
import { LocalTokenRegistry, LocalSecureVault, PIIDetectionEngine, } from '../../packages/privacy-core/src';
describe('LocalTokenRegistry', () => {
    let registry;
    beforeEach(() => {
        registry = new LocalTokenRegistry();
    });
    it('assigns opaque sequential tokens for sensitive categories', () => {
        const token1 = registry.registerValue('harish.kumar@example.com', 'EMAIL');
        const token2 = registry.registerValue('priya.sharma@example.org', 'EMAIL');
        const token3 = registry.registerValue('+91 9876543210', 'PHONE');
        expect(token1).toBe('EMAIL_001');
        expect(token2).toBe('EMAIL_002');
        expect(token3).toBe('PHONE_001');
    });
    it('reuses existing token for identical value within same category', () => {
        const token1 = registry.registerValue('harish.kumar@example.com', 'EMAIL');
        const token2 = registry.registerValue('harish.kumar@example.com', 'EMAIL');
        expect(token1).toBe(token2);
    });
    it('resolves tokens locally without exposing mapping to cloud', () => {
        const token = registry.registerValue('Harish Kumar', 'PERSON');
        expect(registry.resolveToken(token)).toBe('Harish Kumar');
        expect(registry.resolveToken('UNKNOWN_TOKEN')).toBeNull();
    });
    it('sanitizes strings by replacing plaintext with opaque tokens', () => {
        registry.registerValue('harish.kumar@example.com', 'EMAIL');
        registry.registerValue('Harish Kumar', 'PERSON');
        const input = 'Sending invoice to Harish Kumar at harish.kumar@example.com for processing.';
        const sanitized = registry.sanitizeString(input);
        expect(sanitized).toBe('Sending invoice to PERSON_001 at EMAIL_001 for processing.');
        expect(sanitized).not.toContain('Harish Kumar');
        expect(sanitized).not.toContain('harish.kumar@example.com');
    });
});
describe('LocalSecureVault & WebCrypto', () => {
    let vault;
    beforeEach(() => {
        vault = new LocalSecureVault();
    });
    it('encrypts and decrypts strings with AES-GCM-256', async () => {
        const plaintext = 'SuperSensitivePassword123!';
        const ciphertextBase64 = await vault.encryptString(plaintext);
        expect(ciphertextBase64).not.toBe(plaintext);
        expect(typeof ciphertextBase64).toBe('string');
        const decrypted = await vault.decryptString(ciphertextBase64);
        expect(decrypted).toBe(plaintext);
    });
    it('retrieves default synthetic profiles with zero cloud sync', () => {
        const profile = vault.getProfile('profile_primary_harish');
        expect(profile).toBeDefined();
        expect(profile?.fullName).toBe('Harish Kumar');
        expect(profile?.customFields?.canarySecret).toBe('SUPER_SECRET_HARISH_928374');
    });
});
describe('PIIDetectionEngine', () => {
    let engine;
    beforeEach(() => {
        engine = new PIIDetectionEngine();
    });
    it('classifies DOM elements based on autocomplete, type, and semantic names', () => {
        const emailCheck = engine.classifyElementDomSemantics({
            tag: 'input',
            type: 'email',
            name: 'user_email',
            placeholder: 'Enter your email',
        });
        expect(emailCheck.isSensitive).toBe(true);
        expect(emailCheck.category).toBe('EMAIL');
        const phoneCheck = engine.classifyElementDomSemantics({
            tag: 'input',
            type: 'tel',
            name: 'mobile_no',
            autocomplete: 'tel',
        });
        expect(phoneCheck.isSensitive).toBe(true);
        expect(phoneCheck.category).toBe('PHONE');
        const regularInput = engine.classifyElementDomSemantics({
            tag: 'input',
            type: 'text',
            name: 'search_query',
            placeholder: 'Search laptops...',
        });
        expect(regularInput.isSensitive).toBe(false);
    });
    it('detects and redacts sensitive elements while preserving public ones', () => {
        const testElements = [
            {
                id: 1,
                tag: 'input',
                type: 'text',
                name: 'search',
                placeholder: 'Search HP laptops',
                value: 'HP Victus 16GB',
                isInteractive: true,
                bbox: { x: 100, y: 100, width: 200, height: 40 },
            },
            {
                id: 2,
                tag: 'input',
                type: 'email',
                name: 'email',
                placeholder: 'Enter email',
                value: 'harish.kumar@example.com',
                isInteractive: true,
                bbox: { x: 100, y: 160, width: 200, height: 40 },
            },
        ];
        const result = engine.detectAndSanitizeElements(testElements);
        expect(result.sanitizedElements).toHaveLength(2);
        const searchElem = result.sanitizedElements[0];
        expect(searchElem.isMasked).toBe(false);
        expect(searchElem.value).toBe('HP Victus 16GB');
        const emailElem = result.sanitizedElements[1];
        expect(emailElem.isMasked).toBe(true);
        expect(emailElem.tokenRef).toBe('EMAIL_001');
        expect(emailElem.value).toBe('[EMAIL_001]');
        expect(result.detectedEntities).toHaveLength(1);
        expect(result.detectedEntities[0].category).toBe('EMAIL');
    });
});
//# sourceMappingURL=privacy-core.test.js.map