/**
 * Secure logging utility for Keepla.pt
 * Prevents sensitive data exposure in production logs
 */

interface LogData {
  [key: string]: unknown;
}

/**
 * Sanitizes error objects to remove sensitive information
 */
function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An error occurred';
}

/**
 * Sanitizes data object to remove sensitive fields
 */
function sanitizeData(data: LogData): LogData {
  const sensitiveKeys = [
    'password', 'token', 'apiKey', 'secret', 'email', 
    'phone', 'address', 'creditCard', 'ssn', 'sessionToken'
  ];
  
  const sanitized: LogData = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeData(value as LogData);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Secure logger that only logs detailed information in development
 */
export const logger = {
  /**
   * Log error with sanitized data
   */
  error: (message: string, error?: unknown, data?: LogData) => {
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.error(`[ERROR] ${message}`, error, data);
    } else {
      // Production: log only sanitized information
      console.error(`[ERROR] ${message}`, sanitizeError(error));
    }
  },

  /**
   * Log warning with sanitized data
   */
  warn: (message: string, data?: LogData) => {
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      // Production: log only sanitized information
      console.warn(`[WARN] ${message}`, data ? sanitizeData(data) : undefined);
    }
  },

  /**
   * Log info (development only)
   */
  info: (message: string, data?: LogData) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, data);
    }
  },

  /**
   * Log debug (development only)
   */
  debug: (message: string, data?: LogData) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
};
