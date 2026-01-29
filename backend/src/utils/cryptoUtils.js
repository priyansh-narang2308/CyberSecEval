import crypto from 'crypto';

/**
 * CRYPTOGRAPHIC UTILITIES
 * 
 * Implements Hybrid Encryption using RSA (2048-bit) and AES-256-CBC.
 * 
 * SECURITY JUSTIFICATION:
 * 1. Hybrid Encryption: Combines the efficiency of Symmetric Encryption (AES) for bulk data
 *    with the convenience of Asymmetric Encryption (RSA) for secure key exchange.
 * 2. AES-256-CBC: Used for encrypting the actual data (submissions). It is fast and secure.
 *    - CBC (Cipher Block Chaining) mode requires a unique IV for each encryption to ensure
 *      that identical plaintext blocks produce different ciphertext.
 * 3. RSA-2048: Used for encrypting the AES session key.
 *    - Allows the AES key to be stored/transmitted securely.
 *    - Only the server holding the Private Key can decrypt the AES key to access the data.
 */

// Store keys in memory for this active session (In production, Private Key would be in a secure Vault/HSM)
import fs from 'fs';
import path from 'path';

const KEYS_DIR = path.join(process.cwd(), 'keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.pem');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.pem');

let storedPrivateKey = null;
let storedPublicKey = null;

export const generateKeyPair = () => {
    if (storedPrivateKey && storedPublicKey) return;

    if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
        storedPrivateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
        storedPublicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
        console.log('[CRYPTO] Persistent keys loaded from disk.');
        return;
    }

    console.log('[CRYPTO] Generating new 2048-bit RSA Key Pair...');
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    storedPublicKey = publicKey;
    storedPrivateKey = privateKey;

    if (!fs.existsSync(KEYS_DIR)) fs.mkdirSync(KEYS_DIR, { recursive: true });
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
    console.log('[CRYPTO] New keys generated and saved to disk.');
};

export const rotateKeyPair = () => {
    storedPublicKey = null;
    storedPrivateKey = null;
    if (fs.existsSync(PRIVATE_KEY_PATH)) fs.unlinkSync(PRIVATE_KEY_PATH);
    if (fs.existsSync(PUBLIC_KEY_PATH)) fs.unlinkSync(PUBLIC_KEY_PATH);
    generateKeyPair();
    return storedPublicKey;
};

export const getPublicKey = () => {
    if (!storedPublicKey) generateKeyPair();
    return storedPublicKey;
};

// Internal getter for private key (never exposed via API)
const getPrivateKey = () => {
    if (!storedPrivateKey) generateKeyPair();
    return storedPrivateKey;
};

/**
 * 2. SECURE SESSION KEY EXCHANGE & ENCRYPTION
 */

/**
 * Generates a random 32-byte (256-bit) AES Key
 */
export const generateAESKey = () => {
    return crypto.randomBytes(32);
};

/**
 * Encrypts the AES Session Key using the RSA Public Key.
 * This ensures only the holder of the Private Key can use this AES key.
 */
export const encryptSessionKey = (aesKey) => {
    const publicKey = getPublicKey();
    return crypto.publicEncrypt(publicKey, aesKey);
};

/**
 * Decrypts the Encrypted AES Session Key using the RSA Private Key.
 */
export const decryptSessionKey = (encryptedSessionKey) => {
    const privateKey = getPrivateKey();
    const buffer = Buffer.from(encryptedSessionKey, 'base64');
    
    return crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, buffer);
};

/**
 * 3. AES ENCRYPTION UTILITY
 * Encrypts data using AES-256-CBC with a random IV.
 */
export const encryptData = (plainText, aesKey) => {
    const iv = crypto.randomBytes(16); // Generate random 16-byte IV
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        encryptedData: encrypted,
        iv: iv.toString('hex')
    };
};

/**
 * 4. AES DECRYPTION UTILITY
 * Decrypts data using AES-256-CBC.
 */
export const decryptData = (encryptedData, aesKey, ivBase64) => {
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
};

const bufferFromHex = (hexOrBuffer) => {
    if (Buffer.isBuffer(hexOrBuffer)) return hexOrBuffer;
    return Buffer.from(hexOrBuffer, 'hex');
};

/**
 * 5. DIGITAL SIGNATURES (HASHING + SIGNING)
 * 
 * SECURITY JUSTIFICATION:
 * 1. Hashing (SHA-256): Compresses data into a fixed-size string.
 *    - Ensures Integrity: If even one bit of data changes, the hash changes completely.
 *    - One-Way: You cannot reconstruct the data from the hash.
 * 
 * 2. Digital Signature (RSA):
 *    - Uses the Private Key to encrypt the hash.
 *    - Authenticity: Only the holder of the Private Key (Faculty) could have created it.
 *    - Non-Repudiation: The signer cannot deny signing it later.
 *    - Integrity: Verification checks if the decrypted hash matches the re-computed hash of the data.
 * 
 * Difference vs Encryption: 
 * - Encryption hides data (Confidentiality).
 * - Signatures prove who sent it and that it hasn't changed (Authenticity + Integrity).
 */

const canonicalStringify = (obj) => {
    const allKeys = Object.keys(obj).sort();
    return JSON.stringify(obj, allKeys);
};

export const signData = (data) => {
    const privateKey = getPrivateKey();
    const sign = crypto.createSign('SHA256');
    const canonicalData = canonicalStringify(data);
    sign.update(canonicalData);
    const signature = sign.sign(privateKey, 'hex');
    const hash = crypto.createHash('sha256').update(canonicalData).digest('hex');
    return { signature, hash };
};

export const verifySignature = (data, signature) => {
    const publicKey = getPublicKey();
    const verify = crypto.createVerify('SHA256');
    verify.update(canonicalStringify(data));
    return verify.verify(publicKey, signature, 'hex');
};

