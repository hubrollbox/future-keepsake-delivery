# Security Documentation

## Overview

This document outlines the security measures implemented in the FuturoPresente application to protect user data, prevent common web vulnerabilities, and ensure compliance with security best practices.

## Security Enhancements

### 1. Password Protection

- **Secure Password Generation**: Replaced hardcoded passwords with securely generated random passwords using `crypto.randomBytes`
- **Environment Variable Support**: Added support for environment variables (`DEMO_ADMIN_PASSWORD`, `DEMO_USER_PASSWORD`, `TEST_ADMIN_PASSWORD`, `TEST_USER_PASSWORD`) to securely manage credentials
- **Password Requirements**: Enforced strong password requirements including minimum length, uppercase, lowercase, numbers, and special characters

### 2. Session Token Protection

- **Secure Storage**: Implemented a secure storage mechanism that checks for token expiration
- **HTTPS Enforcement**: Refuses to store tokens in non-HTTPS environments (except localhost)
- **Cookie Security**: Configured Supabase client with secure cookie options including:
  - `secure: true` - Cookies only sent over HTTPS
  - `sameSite: 'strict'` - Prevents CSRF attacks
  - `httpOnly: true` - Prevents JavaScript access to cookies
  - `path: '/'` - Restricts cookie access to specific paths
  - `maxAge: 3600` - Sets token expiration to 1 hour

### 3. Customer Personal Information Protection

- **Data Masking**: Implemented masking for full names and user IDs in admin services
- **Anonymization**: Added helper functions to anonymize user identifiers
- **Minimized Data Collection**: Configured system to collect only necessary personal information

### 4. Recipient Contact Information Protection

- **Email Masking**: Created utility to mask email addresses (e.g., `j***@e*****.com`)
- **Phone Number Masking**: Implemented phone number masking (e.g., `+1******7890`)
- **Address Masking**: Added function to mask physical addresses
- **Safe Logging**: Created `createSafeRecipientLog` function to generate masked versions of recipient data for logging

### 5. Financial Transaction Data Protection

- **Credit Card Masking**: Implemented masking for credit card numbers (e.g., `****-****-****-1234`)
- **Encryption**: Added utilities for encrypting and decrypting sensitive financial data
- **Transaction ID Protection**: Created functions to handle transaction IDs securely
- **Safe Payment Logs**: Implemented `createSafePaymentLog` function to generate masked versions of payment data

### 6. Path Traversal Protection

- **Path Validation**: Enhanced file path validation to prevent path traversal attacks
- **Immutable Paths**: Created immutable copies of paths during validation
- **Pattern Detection**: Added comprehensive checks for path traversal patterns

### 7. Security Middleware

- **Content Security Policy**: Implemented CSP headers to prevent XSS attacks
- **Security Headers**: Added various security headers including:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Route Protection**: Implemented route protection for sensitive and admin routes
- **API Request Logging**: Added safe logging for API requests with sensitive data masking

## Security Configuration

The application uses a centralized security configuration in `src/config/security.ts` that controls various security features:

```typescript
export const security = {
  // Password protection settings
  passwordProtection: {
    enabled: true,
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Extension security settings
  extensionSecurity: {
    enabled: true,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']
  },
  
  // Function path security
  functionPathSecurity: {
    enabled: true,
    validatePaths: true,
    sanitizePaths: true
  },
  
  // Session protection
  sessionProtection: {
    enabled: true,
    tokenExpiration: 3600, // 1 hour in seconds
    refreshTokenRotation: true,
    secureCookies: true
  },
  
  // Personal data protection
  personalDataProtection: {
    enabled: true,
    encryptSensitiveData: true,
    minimizeDataCollection: true
  },
  
  // Contact information protection
  contactInfoProtection: {
    enabled: true,
    maskEmailsInLogs: true,
    maskPhonesInLogs: true
  },
  
  // Financial data protection
  financialDataProtection: {
    enabled: true,
    encryptFinancialData: true,
    pciCompliance: true
  }
};
```

## Security Best Practices

1. **Never hardcode credentials** - Use environment variables for all sensitive information
2. **Validate all user inputs** - Implement strict validation for all user-provided data
3. **Mask sensitive data in logs** - Use the provided masking utilities for all logging
4. **Use HTTPS everywhere** - Enforce HTTPS for all connections
5. **Implement proper authentication** - Use the authentication middleware for protected routes
6. **Regularly update dependencies** - Keep all dependencies up to date to patch security vulnerabilities
7. **Follow the principle of least privilege** - Only grant the minimum necessary permissions

## Security Testing

Regularly test the application for security vulnerabilities using:

1. **Static Analysis**: Run security-focused linters and code analyzers
2. **Dependency Scanning**: Check for vulnerable dependencies
3. **Penetration Testing**: Conduct regular penetration tests
4. **Security Reviews**: Perform code reviews with a security focus

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by contacting the security team at security@futurepresente.example.com. Do not disclose security vulnerabilities publicly until they have been addressed by the team.