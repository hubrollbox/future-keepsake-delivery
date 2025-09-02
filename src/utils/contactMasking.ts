/**
 * Utility functions for masking and protecting contact information
 * These functions help ensure recipient contact information is properly protected
 * throughout the application.
 */

import { security } from '@/config/security';

/**
 * Masks an email address for privacy protection
 * @param email The email address to mask
 * @returns The masked email address
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return '';
  
  // Don't mask if protection is disabled in config
  if (!security.contactInfoProtection.enabled || 
      !security.contactInfoProtection.maskEmailsInLogs) {
    return email;
  }
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return '***@***.***';
  
  // Show first character and last character of username, mask the rest
  const maskedUsername = username.length <= 2 
    ? '*'.repeat(username.length)
    : `${username.charAt(0)}${'*'.repeat(username.length - 2)}${username.charAt(username.length - 1)}`;
  
  // Split domain into parts (e.g., example.com -> [example, com])
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return `${maskedUsername}@${'*'.repeat(domain.length)}`;
  
  // Mask domain name but keep TLD visible
  const domainName = domainParts.slice(0, -1).join('.');
  const tld = domainParts[domainParts.length - 1];
  
  const maskedDomain = `${'*'.repeat(Math.min(domainName.length, 3))}${domainName.length > 3 ? '.' : ''}${tld}`;
  
  return `${maskedUsername}@${maskedDomain}`;
}

/**
 * Masks a phone number for privacy protection
 * @param phone The phone number to mask
 * @returns The masked phone number
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Don't mask if protection is disabled in config
  if (!security.contactInfoProtection.enabled || 
      !security.contactInfoProtection.maskPhonesInLogs) {
    return phone;
  }
  
  // Remove non-digit characters for consistent processing
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '*'.repeat(digits.length);
  
  // Keep first 2 and last 2 digits, mask the rest
  return `${digits.substring(0, 2)}${'*'.repeat(digits.length - 4)}${digits.substring(digits.length - 2)}`;
}

/**
 * Masks a physical address for privacy protection
 * @param address The address to mask
 * @returns The masked address
 */
export function maskAddress(address: string | null | undefined): string {
  if (!address) return '';
  
  // Don't mask if protection is disabled in config
  if (!security.contactInfoProtection.enabled) {
    return address;
  }
  
  // Split address into parts by spaces or commas
  const parts = address.split(/[\s,]+/);
  
  // Mask each part except postal codes and country names
  const maskedParts = parts.map(part => {
    // Preserve postal codes (typically numeric or alphanumeric patterns)
    if (/^\d{4}-?\d{3}$/.test(part) || /^\d{5}(-\d{4})?$/.test(part)) {
      return part;
    }
    
    // Preserve country names and common address terms
    const preserveTerms = ['portugal', 'españa', 'spain', 'france', 'frança', 'rua', 'avenida', 'av.', 'r.'];
    if (preserveTerms.includes(part.toLowerCase())) {
      return part;
    }
    
    // Mask other parts
    if (part.length <= 3) return '*'.repeat(part.length);
    return `${part.charAt(0)}${'*'.repeat(part.length - 2)}${part.charAt(part.length - 1)}`;
  });
  
  return maskedParts.join(' ');
}

/**
 * Creates a safe log version of recipient data with sensitive information masked
 * @param recipient The recipient data object
 * @returns A new object with masked sensitive fields
 */
export function createSafeRecipientLog(recipient: any): any {
  if (!recipient) return {};
  
  const safeRecipient = { ...recipient };
  
  // Mask sensitive fields
  if (safeRecipient.email) safeRecipient.email = maskEmail(safeRecipient.email);
  if (safeRecipient.phone) safeRecipient.phone = maskPhone(safeRecipient.phone);
  if (safeRecipient.address) safeRecipient.address = maskAddress(safeRecipient.address);
  if (safeRecipient.street) safeRecipient.street = maskAddress(safeRecipient.street);
  if (safeRecipient.city) safeRecipient.city = maskAddress(safeRecipient.city);
  
  // Don't mask these fields
  // - id: needed for database operations
  // - name: needed for UI display (already masked in other functions)
  // - postal_code: needed for shipping
  // - country: not personally identifiable
  
  return safeRecipient;
}