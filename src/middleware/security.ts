/**
 * Security middleware for the application
 * Implements various security measures and protections
 */

// Import necessary dependencies for a Vite/React application
import { security, validateFilePath } from '@/config/security';
import { maskEmail, maskPhone, createSafeRecipientLog } from '@/utils/contactMasking';
import { createSafePaymentLog } from '@/utils/financialDataProtection';

/**
 * Initialize security features for the application
 * This function is called when the application starts
 */
export function initializeSecurity() {
  // Apply Content Security Policy
  applyCSP();
  
  // Apply other security headers
  applySecurityHeaders();
  
  // Set up route protection
  setupRouteProtection();
  
  // Log security initialization
  console.info('Security middleware initialized');
  
  // Return security configuration for debugging
  return security;
}

/**
 * Apply Content Security Policy
 */
function applyCSP() {
  // Create a meta element for CSP
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = 
    "default-src 'self'; " +
    "script-src 'self' https://js.stripe.com https://analytics.keepla.pt; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https://keepla-uploads.s3.amazonaws.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.supabase.co https://api.stripe.com; " +
    "frame-src 'self' https://js.stripe.com;";
  
  // Add the meta element to the head
  document.head.appendChild(cspMeta);
}

/**
 * Apply security headers
 * For client-side applications, we can only set some headers via meta tags
 */
function applySecurityHeaders() {
  // X-Content-Type-Options
  const noSniffMeta = document.createElement('meta');
  noSniffMeta.httpEquiv = 'X-Content-Type-Options';
  noSniffMeta.content = 'nosniff';
  document.head.appendChild(noSniffMeta);
  
  // X-Frame-Options
  const frameOptionsMeta = document.createElement('meta');
  frameOptionsMeta.httpEquiv = 'X-Frame-Options';
  frameOptionsMeta.content = 'DENY';
  document.head.appendChild(frameOptionsMeta);
  
  // X-XSS-Protection
  const xssMeta = document.createElement('meta');
  xssMeta.httpEquiv = 'X-XSS-Protection';
  xssMeta.content = '1; mode=block';
  document.head.appendChild(xssMeta);
  
  // Referrer-Policy
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = 'strict-origin-when-cross-origin';
  document.head.appendChild(referrerMeta);
}

/**
 * Set up route protection using React Router
 */
function setupRouteProtection() {
  // This function will be called by the AuthProvider component
  // to check if the user is authenticated before rendering protected routes
  // The actual implementation is in the AuthProvider component
  console.info('Route protection initialized');
}

/**
 * Check if a path contains path traversal patterns
 * This is used by the validateFilePath function
 */
export function containsPathTraversal(path: string): boolean {
  const pathTraversalPatterns = [
    '../', '..\\', '/..',
    '%2e%2e%2f', '%2e%2e/', '..%2f',
    '%2e%2e%5c', '%2e%2e\\', '..%5c',
    '..%255c', '..%c0%af', '..%c1%9c'
  ];
  
  return pathTraversalPatterns.some(pattern => path.includes(pattern));
}

/**
 * Check if a route is protected and requires authentication
 * This is used by the AuthProvider component
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/create-keepsake',
    '/edit-keepsake',
    '/checkout',
    '/api/user/',
    '/api/keepsakes/',
    '/api/payments/'
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if a route is an admin route
 * This is used by the AuthProvider component
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

/**
 * Mask sensitive data in logs
 */
export function maskSensitiveData(data: string): string {
  if (!data) return '';
  
  // Apply different masking based on data type
  if (isEmailAddress(data)) {
    return maskEmail(data);
  }
  
  if (isPhoneNumber(data)) {
    return maskPhone(data);
  }
  
  // Default masking for other sensitive data
  if (data.length <= 4) return '*'.repeat(data.length);
  return data.substring(0, 2) + '*'.repeat(data.length - 4) + data.substring(data.length - 2);
}

/**
 * Check if a string is an email address
 */
export function isEmailAddress(data: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
}

/**
 * Check if a string is a phone number
 */
export function isPhoneNumber(data: string): boolean {
  // Simple regex for international phone numbers
  return /^\+?[\d\s-()]{7,20}$/.test(data);
}

/**
 * Validate file paths in API requests
 * @param filePath The file path to validate
 * @returns Boolean indicating if the path is valid
 */
export function validateApiFilePath(filePath: string): boolean {
  if (!filePath) return false;
  
  // Use the validateFilePath function from config/security
  const validatedPath = validateFilePath(filePath);
  
  if (!validatedPath) {
    console.error(`Security alert: Invalid file path in request: ${maskSensitiveData(filePath)}`);
    return false;
  }
  
  return true;
}

/**
 * Create a safe log for API requests
 * @param url The URL of the request
 * @param body The body of the request
 * @returns A safe log object with sensitive data masked
 */
export function createSafeApiLog(url: string, body: any): object {
  // Create a safe copy of the URL
  const safeUrl = url.replace(/([?&](token|key|password|secret)=)[^&]+/gi, '$1***');
  
  // Create a safe copy of the body
  let safeBody = {};
  
  if (body) {
    try {
      // If body is a string, try to parse it as JSON
      const bodyObj = typeof body === 'string' ? JSON.parse(body) : body;
      
      // Mask sensitive fields in the body
      safeBody = Object.entries(bodyObj).reduce((acc, [key, value]) => {
        // Check if the field is sensitive
        const isSensitive = [
          'password', 'token', 'secret', 'key', 'credit', 'card',
          'cvv', 'cvc', 'pin', 'ssn', 'social', 'auth'
        ].some(term => key.toLowerCase().includes(term));
        
        // Mask sensitive fields
        acc[key] = isSensitive ? '***' : value;
        
        // Recursively mask nested objects
        if (typeof value === 'object' && value !== null) {
          acc[key] = createSafeApiLog('', value);
        }
        
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      // If parsing fails, just mask the entire body
      safeBody = { masked: true };
    }
  }
  
  return { url: safeUrl, body: safeBody };
}