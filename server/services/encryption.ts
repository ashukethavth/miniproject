import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { supabaseAdmin } from '../config/supabase';

export interface EncryptionResult {
  encryptedData: Buffer;
  iv: Buffer;
  salt: Buffer;
  keyId: string;
}

export interface DecryptionResult {
  decryptedData: Buffer;
  verified: boolean;
}

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16; // 128 bits
  private static readonly SALT_LENGTH = 32; // 256 bits
  private static readonly TAG_LENGTH = 16; // 128 bits for GCM

  /**
   * Generate a random salt for key derivation
   */
  static generateSalt(): Buffer {
    return crypto.randomBytes(this.SALT_LENGTH);
  }

  /**
   * Generate a random initialization vector
   */
  static generateIV(): Buffer {
    return crypto.randomBytes(this.IV_LENGTH);
  }

  /**
   * Derive encryption key from password using PBKDF2
   */
  static deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, this.KEY_LENGTH, 'sha256');
  }

  /**
   * Generate SHA-256 hash of data
   */
  static generateHash(data: Buffer | string): string {
    const dataBuffer = typeof data === 'string' ? Buffer.from(data) : data;
    return crypto.createHash('sha256').update(dataBuffer).digest('hex');
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  static encryptData(data: Buffer, key: Buffer, iv: Buffer): { encrypted: Buffer; tag: Buffer } {
    // @ts-ignore
    const cipher = crypto.createCipherGCM(this.ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);
    const tag = cipher.getAuthTag();
    return { encrypted, tag };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static decryptData(encryptedData: Buffer, key: Buffer, iv: Buffer, tag: Buffer): Buffer {
    // @ts-ignore
    const decipher = crypto.createDecipherGCM(this.ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);
  }

  /**
   * Encrypt file data with hybrid encryption (AES + RSA/ECC simulation)
   */
  static async encryptFile(
    fileData: Buffer,
    userId: string,
    masterKey: string
  ): Promise<EncryptionResult> {
    try {
      // Generate encryption parameters
      const salt = this.generateSalt();
      const iv = this.generateIV();

      // Derive file encryption key
      const fileKey = this.deriveKey(masterKey, salt);

      // Encrypt file data
      const { encrypted, tag } = this.encryptData(fileData, fileKey, iv);

      // Combine encrypted data with authentication tag
      const encryptedData = Buffer.concat([encrypted, tag]);

      // Encrypt the file key with user's master key for storage
      const encryptedFileKey = CryptoJS.AES.encrypt(
        fileKey.toString('hex'),
        masterKey
      ).toString();

      // Store encryption key metadata
      const { data: keyRecord, error } = await supabaseAdmin
        .from('encryption_keys')
        .insert({
          user_id: userId,
          key_type: 'file',
          encrypted_key: encryptedFileKey,
          key_hash: this.generateHash(fileKey),
          algorithm: this.ALGORITHM
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to store encryption key: ${error.message}`);
      }

      return {
        encryptedData,
        iv,
        salt,
        keyId: keyRecord.id
      };
    } catch (error) {
      throw new Error(`File encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt file data
   */
  static async decryptFile(
    encryptedData: Buffer,
    keyId: string,
    iv: Buffer,
    salt: Buffer,
    masterKey: string
  ): Promise<DecryptionResult> {
    try {
      // Retrieve encryption key
      const { data: keyRecord, error } = await supabaseAdmin
        .from('encryption_keys')
        .select('encrypted_key, key_hash')
        .eq('id', keyId)
        .single();

      if (error || !keyRecord) {
        throw new Error('Encryption key not found');
      }

      // Decrypt file key
      const decryptedKeyHex = CryptoJS.AES.decrypt(
        keyRecord.encrypted_key,
        masterKey
      ).toString(CryptoJS.enc.Utf8);

      const fileKey = Buffer.from(decryptedKeyHex, 'hex');

      // Verify key integrity
      const keyHash = this.generateHash(fileKey);
      const verified = keyHash === keyRecord.key_hash;

      // Separate encrypted data and authentication tag
      const tag = encryptedData.subarray(-this.TAG_LENGTH);
      const data = encryptedData.subarray(0, -this.TAG_LENGTH);

      // Decrypt file data
      const decryptedData = this.decryptData(data, fileKey, iv, tag);

      return {
        decryptedData,
        verified
      };
    } catch (error) {
      throw new Error(`File decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate master key for user
   */
  static generateMasterKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Encrypt master key with user's password
   */
  static encryptMasterKey(masterKey: string, password: string): string {
    return CryptoJS.AES.encrypt(masterKey, password).toString();
  }

  /**
   * Decrypt master key with user's password
   */
  static decryptMasterKey(encryptedMasterKey: string, password: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedMasterKey, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Generate secure share token
   */
  static generateShareToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash password for storage
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Verify password against hash
   */
  static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
    return hash === verifyHash;
  }

  /**
   * Generate recovery codes
   */
  static generateRecoveryCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Generate TOTP secret
   */
  static generateTOTPSecret(): string {
    return crypto.randomBytes(20).toString('base64');
  }
}
