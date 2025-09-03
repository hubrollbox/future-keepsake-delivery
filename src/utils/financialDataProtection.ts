/**
 * Utility functions for protecting financial transaction data
 * These functions help ensure financial information is properly secured
 * throughout the application.
 */

import { security } from '@/config/security';
import crypto from 'crypto';

/**
 * Encrypts sensitive financial data
 * @param data The data to encrypt
 * @param key Optional encryption key (defaults to environment variable)
 * @returns The encrypted data as a string
 */
export function encryptFinancialData(data: string, key?: string): string {
  if (!security.financialDataProtection.enabled || 
      !security.financialDataProtection.encryptFinancialData) {
    return data;
  }

  try {
    // Use environment variable if key not provided
    const encryptionKey = key || import.meta.env.VITE_FINANCIAL_DATA_ENCRYPTION_KEY;
    if (!encryptionKey) {
      console.error('No encryption key available for financial data');
      return maskFinancialData(data); // Fallback to masking if no key
    }

    // Create a buffer from the key (must be 32 bytes for AES-256)
    const keyBuffer = crypto.createHash('sha256').update(encryptionKey).digest();
    const iv = crypto.randomBytes(16); // Initialization vector

    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    
    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data (IV needed for decryption)
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Error encrypting financial data:', error);
    return maskFinancialData(data); // Fallback to masking on error
  }
}

/**
 * Decrypts encrypted financial data
 * @param encryptedData The encrypted data string
 * @param key Optional decryption key (defaults to environment variable)
 * @returns The decrypted data or null if decryption fails
 */
export function decryptFinancialData(encryptedData: string, key?: string): string | null {
  if (!security.financialDataProtection.enabled || 
      !security.financialDataProtection.encryptFinancialData) {
    return encryptedData;
  }

  try {
    // Check if data is actually encrypted (should contain IV separator)
    if (!encryptedData.includes(':')) {
      return encryptedData; // Not encrypted or already decrypted
    }

    // Use environment variable if key not provided
    const decryptionKey = key || import.meta.env.VITE_FINANCIAL_DATA_ENCRYPTION_KEY;
    if (!decryptionKey) {
      console.error('No decryption key available for financial data');
      return null;
    }

    // Split IV and encrypted data
    const [ivHex, encryptedHex] = encryptedData.split(':');
    
    // Create buffers
    const iv = Buffer.from(ivHex || '', 'hex');
    const keyBuffer = crypto.createHash('sha256').update(decryptionKey || '').digest();
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedHex || '', 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting financial data:', error);
    return null;
  }
}

/**
 * Masks financial data for display or logging
 * @param data The financial data to mask
 * @returns The masked data
 */
export function maskFinancialData(data: string): string {
  if (!data) return '';
  
  // Don't mask if protection is disabled
  if (!security.financialDataProtection.enabled) {
    return data;
  }
  
  // Handle credit card numbers
  if (isCreditCardNumber(data)) {
    return maskCreditCardNumber(data);
  }
  
  // Handle monetary values
  if (isMonetaryValue(data)) {
    return data; // Don't mask monetary values, just amounts
  }
  
  // Handle transaction IDs
  if (isTransactionId(data)) {
    return maskTransactionId(data);
  }
  
  // Default masking for other financial data
  if (data.length <= 4) return '*'.repeat(data.length);
  return data.substring(0, 2) + '*'.repeat(data.length - 4) + data.substring(data.length - 2);
}

/**
 * Checks if a string appears to be a credit card number
 * @param data The string to check
 * @returns True if the string appears to be a credit card number
 */
function isCreditCardNumber(data: string): boolean {
  // Remove spaces and dashes
  const cleaned = data.replace(/[\s-]/g, '');
  
  // Check if it's a numeric string of appropriate length (most cards are 13-19 digits)
  return /^\d{13,19}$/.test(cleaned);
}

/**
 * Masks a credit card number, showing only the last 4 digits
 * @param cardNumber The credit card number to mask
 * @returns The masked credit card number
 */
function maskCreditCardNumber(cardNumber: string): string {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Keep only last 4 digits visible
  return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
}

/**
 * Checks if a string appears to be a monetary value
 * @param data The string to check
 * @returns True if the string appears to be a monetary value
 */
function isMonetaryValue(data: string): boolean {
  // Match common currency formats (e.g., $123.45, €123,45, 123.45 USD)
  return /^[\$€£¥]?\s?\d+([.,]\d{1,2})?\s?[A-Z]{0,3}$/.test(data);
}

/**
 * Checks if a string appears to be a transaction ID
 * @param data The string to check
 * @returns True if the string appears to be a transaction ID
 */
function isTransactionId(data: string): boolean {
  // Transaction IDs are often alphanumeric and may include hyphens
  // This is a generic pattern - adjust based on your payment processor's format
  return /^[a-zA-Z0-9_-]{10,50}$/.test(data);
}

/**
 * Masks a transaction ID
 * @param transactionId The transaction ID to mask
 * @returns The masked transaction ID
 */
function maskTransactionId(transactionId: string): string {
  if (transactionId.length <= 8) {
    return transactionId.substring(0, 2) + '*'.repeat(transactionId.length - 4) + 
           transactionId.substring(transactionId.length - 2);
  }
  
  // For longer IDs, show first 4 and last 4 characters
  return transactionId.substring(0, 4) + '*'.repeat(transactionId.length - 8) + 
         transactionId.substring(transactionId.length - 4);
}

/**
 * Creates a safe version of payment data for logging
 * @param payment The payment data object
 * @returns A new object with sensitive fields masked or removed
 */
export function createSafePaymentLog(payment: any): any {
  if (!payment) return {};
  
  const safePayment = { ...payment };
  
  // Remove highly sensitive fields entirely
  delete safePayment.card_number;
  delete safePayment.cvv;
  delete safePayment.card_expiry;
  delete safePayment.bank_account;
  delete safePayment.routing_number;
  
  // Mask moderately sensitive fields
  if (safePayment.transaction_id) {
    safePayment.transaction_id = maskTransactionId(safePayment.transaction_id);
  }
  
  if (safePayment.payment_method_id) {
    safePayment.payment_method_id = maskTransactionId(safePayment.payment_method_id);
  }
  
  // Keep non-sensitive fields
  // - id: needed for database operations
  // - amount: monetary value, not sensitive
  // - currency: not sensitive
  // - status: not sensitive
  // - created_at: timestamp, not sensitive
  
  return safePayment;
}