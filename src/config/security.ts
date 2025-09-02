// Security configuration for the application

/**
 * Security configuration object that centralizes all security-related settings
 * These settings are loaded from environment variables with secure defaults
 */
export const securityConfig = {
  // Password protection settings
  passwordProtection: {
    enabled: import.meta.env.VITE_ENABLE_PASSWORD_PROTECTION !== 'false',
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Extension security settings
  extensionSecurity: {
    enabled: import.meta.env.VITE_ENABLE_EXTENSION_SECURITY !== 'false',
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']
  },
  
  // Function path security
  functionPathSecurity: {
    enabled: import.meta.env.VITE_SECURE_FUNCTION_PATHS !== 'false',
    validatePaths: true,
    sanitizePaths: true
  },
  
  // Session protection
  sessionProtection: {
    enabled: import.meta.env.VITE_ENABLE_SESSION_PROTECTION !== 'false',
    tokenExpiration: 3600, // 1 hour in seconds
    refreshTokenRotation: true,
    secureCookies: true
  },
  
  // Personal data protection
  personalDataProtection: {
    enabled: import.meta.env.VITE_ENABLE_PERSONAL_DATA_PROTECTION !== 'false',
    encryptSensitiveData: true,
    minimizeDataCollection: true
  },
  
  // Contact information protection
  contactInfoProtection: {
    enabled: import.meta.env.VITE_ENABLE_CONTACT_INFO_PROTECTION !== 'false',
    maskEmailsInLogs: true,
    maskPhonesInLogs: true
  },
  
  // Financial data protection
  financialDataProtection: {
    enabled: import.meta.env.VITE_ENABLE_FINANCIAL_DATA_PROTECTION !== 'false',
    encryptFinancialData: true,
    pciCompliance: true
  }
};

/**
 * Validates a file path to prevent path traversal attacks
 * @param path The file path to validate
 * @returns The sanitized path or null if invalid
 */
export function validateFilePath(path: string): string | null {
  if (!securityConfig.functionPathSecurity.enabled) {
    return path;
  }
  
  // Prevent path traversal attacks
  const normalizedPath = path.replace(/\\/g, '/');
  if (normalizedPath.includes('../') || normalizedPath.includes('..\\')) {
    console.error('Security warning: Path traversal attempt detected', path);
    return null;
  }
  
  return path;
}

/**
 * Validates file extensions against the allowed list
 * @param filename The filename to validate
 * @returns Boolean indicating if the extension is allowed
 */
export function validateFileExtension(filename: string): boolean {
  if (!securityConfig.extensionSecurity.enabled) {
    return true;
  }
  
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return securityConfig.extensionSecurity.allowedExtensions.includes(extension);
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns The sanitized input
 */
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}