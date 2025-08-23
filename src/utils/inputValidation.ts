
// Input validation and sanitization utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (
  value: string,
  fieldName: string,
  rules: ValidationRule
): ValidationResult => {
  const errors: string[] = [];
  const trimmedValue = value.trim();

  // Required check
  if (rules.required && !trimmedValue) {
    errors.push(`${fieldName} é obrigatório`);
    return { isValid: false, errors };
  }

  // Skip other validations if field is empty and not required
  if (!trimmedValue && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // Length validations
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    errors.push(`${fieldName} deve ter pelo menos ${rules.minLength} caracteres`);
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    errors.push(`${fieldName} não pode exceder ${rules.maxLength} caracteres`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    errors.push(`${fieldName} tem formato inválido`);
  }

  // Custom validation
  if (rules.customValidator && !rules.customValidator(trimmedValue)) {
    errors.push(`${fieldName} não passou na validação personalizada`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+=/gi, '')
    // Remove potentially dangerous HTML tags
    .replace(/<(iframe|object|embed|form|input|button|select|textarea)[^>]*>/gi, '');
};

export const sanitizeHTML = (html: string): string => {
  // Basic HTML sanitization - only allow safe tags
  return html.replace(/<(?!\/?(b|i|u)\b)[^>]+>/gi, '');
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-ZÀ-ÿ\s\-'.]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  public isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    // Update the attempts for this key
    this.attempts.set(key, recentAttempts);
    
    // Check if under the limit
    if (recentAttempts.length < maxAttempts) {
      recentAttempts.push(now);
      this.attempts.set(key, recentAttempts);
      return true;
    }
    
    return false;
  }

  public getRemainingTime(key: string, windowMs: number = 60000): number {
    const attempts = this.attempts.get(key);
    if (!attempts || attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remainingTime = windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, remainingTime);
  }
}
