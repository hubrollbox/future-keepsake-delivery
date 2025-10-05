/**
 * Secure logging utility for Keepla.pt
 * Prevents sensitive data leakage in production logs
 */

const isDev = import.meta.env.DEV;

/**
 * Sanitizes error objects to remove sensitive information
 */
function sanitizeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      // Don't include stack traces in production
      ...(isDev && { stack: error.stack }),
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    const sanitized: Record<string, unknown> = {};
    
    // List of sensitive keys to exclude
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
      'email', // Mask in production
      'phone',
      'address',
      'user_id',
    ];
    
    for (const [key, value] of Object.entries(error)) {
      const lowerKey = key.toLowerCase();
      
      // Skip sensitive fields
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
        continue;
      }
      
      // Include non-sensitive fields
      if (typeof value !== 'function') {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  return { error: String(error) };
}

/**
 * Secure logger that only logs sensitive data in development
 */
export const logger = {
  /**
   * Log errors with automatic sanitization in production
   */
  error: (message: string, error?: unknown) => {
    if (isDev) {
      console.error(message, error);
    } else {
      // In production, log sanitized error
      console.error(message, error ? sanitizeError(error) : undefined);
    }
  },

  /**
   * Log warnings with automatic sanitization in production
   */
  warn: (message: string, data?: unknown) => {
    if (isDev) {
      console.warn(message, data);
    } else {
      console.warn(message, data ? sanitizeError(data) : undefined);
    }
  },

  /**
   * Log info messages (safe for production)
   */
  info: (message: string, data?: Record<string, unknown>) => {
    console.info(message, data);
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, data?: unknown) => {
    if (isDev) {
      console.debug(message, data);
    }
  },
};
