/**
 * Utility functions for protecting financial transaction data
 * These functions help ensure financial information is properly masked
 * throughout the application.
 * 
 * NOTE: Encryption/decryption has been removed from client-side code.
 * All encryption must be done server-side in Edge Functions.
 */

/**
 * Masks financial data for display or logging
 * @param data The financial data to mask
 * @returns The masked data
 */
export function maskFinancialData(data: string): string {
  if (!data) return '';
  
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
 */
function isCreditCardNumber(data: string): boolean {
  const cleaned = data.replace(/[\s-]/g, '');
  return /^\d{13,19}$/.test(cleaned);
}

/**
 * Masks a credit card number, showing only the last 4 digits
 */
function maskCreditCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
}

/**
 * Checks if a string appears to be a monetary value
 */
function isMonetaryValue(data: string): boolean {
  return /^[\$€£¥]?\s?\d+([.,]\d{1,2})?\s?[A-Z]{0,3}$/.test(data);
}

/**
 * Checks if a string appears to be a transaction ID
 */
function isTransactionId(data: string): boolean {
  return /^[a-zA-Z0-9_-]{10,50}$/.test(data);
}

/**
 * Masks a transaction ID
 */
function maskTransactionId(transactionId: string): string {
  if (transactionId.length <= 8) {
    return transactionId.substring(0, 2) + '*'.repeat(transactionId.length - 4) + 
           transactionId.substring(transactionId.length - 2);
  }
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
  
  return safePayment;
}
