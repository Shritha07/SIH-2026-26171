import type { VaultProfile } from '@privacy-agent/shared-types';
export declare const DEFAULT_SYNTHETIC_PROFILES: VaultProfile[];
export declare class LocalSecureVault {
    private inMemoryProfiles;
    private encryptionKey;
    private salt;
    constructor();
    private getOrCreateKey;
    /**
     * Encrypts plaintext string to Base64 encoded AES-GCM ciphertext.
     */
    encryptString(plaintext: string): Promise<string>;
    /**
     * Decrypts Base64 encoded AES-GCM ciphertext to plaintext.
     */
    decryptString(encryptedBase64: string): Promise<string>;
    getProfile(id?: string): VaultProfile | undefined;
    getAllProfiles(): VaultProfile[];
    saveProfile(profile: VaultProfile): void;
}
//# sourceMappingURL=vault-crypto.d.ts.map