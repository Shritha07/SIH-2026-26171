import { PII_PATTERNS, SENSITIVE_DOM_KEYWORDS, SENSITIVE_AUTOCOMPLETE_VALUES } from './pii-patterns';
import { LocalTokenRegistry } from './token-registry';
import { LocalSecureVault, DEFAULT_SYNTHETIC_PROFILES } from './vault-crypto';
import { CanvasRedactionEngine } from './canvas-redactor';
import { CanaryLeakDetector } from './leak-detector';
import type { PIIEntity, PIICategory, SanitizedDOMElement, BoundingBox } from '@privacy-agent/shared-types';

export interface DetectionOptions {
  profileId?: string;
  enableRegex?: boolean;
  enableDomSemantics?: boolean;
  enableVaultMatching?: boolean;
}

export class PIIDetectionEngine {
  private tokenRegistry: LocalTokenRegistry;
  private vault: LocalSecureVault;
  private redactor: CanvasRedactionEngine;
  private leakDetector: CanaryLeakDetector;

  constructor(tokenRegistry?: LocalTokenRegistry, vault?: LocalSecureVault) {
    this.tokenRegistry = tokenRegistry || new LocalTokenRegistry();
    this.vault = vault || new LocalSecureVault();
    this.redactor = new CanvasRedactionEngine();
    this.leakDetector = new CanaryLeakDetector(this.vault.getAllProfiles());
  }

  public getTokenRegistry(): LocalTokenRegistry {
    return this.tokenRegistry;
  }

  public getVault(): LocalSecureVault {
    return this.vault;
  }

  public getRedactor(): CanvasRedactionEngine {
    return this.redactor;
  }

  public getLeakDetector(): CanaryLeakDetector {
    return this.leakDetector;
  }

  /**
   * Scans an element's DOM attributes to classify whether it represents a sensitive PII input.
   */
  public classifyElementDomSemantics(element: {
    tag: string;
    type?: string;
    name?: string;
    id?: string;
    placeholder?: string;
    ariaLabel?: string;
    autocomplete?: string;
    value?: string;
  }): { isSensitive: boolean; category?: PIICategory; confidence: number } {
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
    if (type === 'email') return { isSensitive: true, category: 'EMAIL', confidence: 0.98 };
    if (type === 'tel') return { isSensitive: true, category: 'PHONE', confidence: 0.95 };
    if (type === 'password') return { isSensitive: true, category: 'SECRET', confidence: 0.99 };
    if (type === 'date') return { isSensitive: true, category: 'DOB', confidence: 0.90 };

    // 3. Check name, id, placeholder, label keywords
    const searchString = `${element.name || ''} ${element.id || ''} ${element.placeholder || ''} ${element.ariaLabel || ''}`.toLowerCase();

    for (const [category, keywords] of Object.entries(SENSITIVE_DOM_KEYWORDS) as [PIICategory, string[]][]) {
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
  public detectAndSanitizeElements(
    elements: Array<{
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
    }>,
    options: DetectionOptions = {}
  ): {
    sanitizedElements: SanitizedDOMElement[];
    detectedEntities: PIIEntity[];
  } {
    const detectedEntities: PIIEntity[] = [];
    const sanitizedElements: SanitizedDOMElement[] = [];

    const profile = this.vault.getProfile(options.profileId || 'profile_primary_harish');
    if (profile && options.enableVaultMatching !== false) {
      if (profile.fullName) this.tokenRegistry.registerValue(profile.fullName, 'PERSON', 'User Full Name');
      if (profile.email) this.tokenRegistry.registerValue(profile.email, 'EMAIL', 'User Email');
      if (profile.phone) this.tokenRegistry.registerValue(profile.phone, 'PHONE', 'User Phone');
      if (profile.address) this.tokenRegistry.registerValue(profile.address, 'ADDRESS', 'User Street Address');
      if (profile.dob) this.tokenRegistry.registerValue(profile.dob, 'DOB', 'User Date of Birth');
      if (profile.passportNumber) this.tokenRegistry.registerValue(profile.passportNumber, 'GOV_ID', 'Passport Number');
      if (profile.nationalId) this.tokenRegistry.registerValue(profile.nationalId, 'GOV_ID', 'National ID');
      if (profile.customFields?.canarySecret) {
        this.tokenRegistry.registerValue(profile.customFields.canarySecret, 'SECRET', 'Canary Secret');
      }
    }

    for (const el of elements) {
      let isMasked = false;
      let tokenRef: string | undefined = undefined;
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
        } else {
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

      const sanitizedAttributes = el.attributes
        ? Object.fromEntries(
            Object.entries(el.attributes).map(([key, value]) => [
              key,
              this.tokenRegistry.sanitizeString(value),
            ])
          )
        : undefined;

      sanitizedElements.push({
        id: el.id,
        tag: el.tag,
        type: el.type,
        name: el.name ? this.tokenRegistry.sanitizeString(el.name) : undefined,
        role: sanitizedAttributes?.role,
        label: sanitizedLabel,
        placeholder: el.placeholder
          ? this.tokenRegistry.sanitizeString(el.placeholder)
          : undefined,
        value: sanitizedValue,
        isMasked,
        tokenRef,
        bbox: el.bbox,
        isInteractive: el.isInteractive,
        attributes: sanitizedAttributes,
      });
    }

    return {
      sanitizedElements,
      detectedEntities,
    };
  }
}
