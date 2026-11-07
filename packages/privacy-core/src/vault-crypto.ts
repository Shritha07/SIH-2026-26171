import type { VaultProfile } from '@privacy-agent/shared-types';

export const DEFAULT_SYNTHETIC_PROFILES: VaultProfile[] = [
  {
    id: 'profile_primary_harish',
    profileName: 'Primary Profile (Harish Kumar)',
    fullName: 'Harish Kumar',
    email: 'harish.kumar@example.com',
    phone: '+91 9876543210',
    address: '42 Silicon Residency, Koramangala 4th Block, Bengaluru, KA 560034',
    dob: '1996-08-15',
    passportNumber: 'Z8942105',
    nationalId: '5489 1209 4381',
    gpa: '3.85',
    resumeFileName: 'Harish_Kumar_Senior_Software_Engineer_Resume.pdf',
    customFields: {
      canarySecret: 'SUPER_SECRET_HARISH_928374',
      experienceYears: '5',
      preferredRole: 'Senior Full Stack Engineer',
      emergencyContact: '+91 9123456789',
    },
  },
  {
    id: 'profile_secondary_priya',
    profileName: 'Secondary Profile (Priya Sharma)',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.org',
    phone: '+91 9811223344',
    address: '15 Lotus Boulevard, Sector 128, Noida, UP 201304',
    dob: '1998-03-22',
    passportNumber: 'P4391028',
    nationalId: '8921 4455 1290',
    gpa: '3.92',
    resumeFileName: 'Priya_Sharma_Frontend_Architect_CV.pdf',
    customFields: {
      canarySecret: 'SUPER_SECRET_PRIYA_746192',
      experienceYears: '4',
      preferredRole: 'Frontend Engineer',
    },
  },
];

export class LocalSecureVault {
  private inMemoryProfiles: Map<string, VaultProfile> = new Map();
  private encryptionKey: CryptoKey | null = null;
  private saltBuffer: ArrayBuffer;

  constructor() {
    const saltBytes = new Uint8Array([12, 84, 99, 21, 105, 44, 76, 201, 14, 55, 33, 90, 111, 230, 49, 19]);
    const ab = new ArrayBuffer(16);
    new Uint8Array(ab).set(saltBytes);
    this.saltBuffer = ab;

    for (const p of DEFAULT_SYNTHETIC_PROFILES) {
      this.inMemoryProfiles.set(p.id, p);
    }
  }

  private async getOrCreateKey(passphrase = 'local-device-session-key-sih-2026'): Promise<CryptoKey> {
    if (this.encryptionKey) return this.encryptionKey;

    const subtle = globalThis.crypto?.subtle;
    if (!subtle) {
      throw new Error('WebCrypto subtle is not available in current environment');
    }

    const enc = new TextEncoder();
    const baseKey = await subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    this.encryptionKey = await subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.saltBuffer,
        iterations: 100000,
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return this.encryptionKey;
  }

  /**
   * Encrypts plaintext string to Base64 encoded AES-GCM ciphertext.
   */
  public async encryptString(plaintext: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const subtle = globalThis.crypto.subtle;

    const ivBuffer = new ArrayBuffer(12);
    new Uint8Array(ivBuffer).set(iv);

    const ciphertext = await subtle.encrypt(
      { name: 'AES-GCM', iv: ivBuffer },
      key,
      enc.encode(plaintext)
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    let binary = '';
    for (let i = 0; i < combined.length; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  }

  /**
   * Decrypts Base64 encoded AES-GCM ciphertext to plaintext.
   */
  public async decryptString(encryptedBase64: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const subtle = globalThis.crypto.subtle;
    const binary = atob(encryptedBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const ivBytes = bytes.slice(0, 12);
    const ciphertextBytes = bytes.slice(12);

    const ivBuffer = new ArrayBuffer(12);
    new Uint8Array(ivBuffer).set(ivBytes);

    const cipherBuffer = new ArrayBuffer(ciphertextBytes.length);
    new Uint8Array(cipherBuffer).set(ciphertextBytes);

    const decrypted = await subtle.decrypt(
      { name: 'AES-GCM', iv: ivBuffer },
      key,
      cipherBuffer
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  }

  public getProfile(id = 'profile_primary_harish'): VaultProfile | undefined {
    return this.inMemoryProfiles.get(id);
  }

  public getAllProfiles(): VaultProfile[] {
    return Array.from(this.inMemoryProfiles.values());
  }

  public saveProfile(profile: VaultProfile): void {
    this.inMemoryProfiles.set(profile.id, profile);
  }
}
