import React, { createContext, useContext, useEffect } from 'react';
import { initializeSecurity } from '@/middleware/security';

interface SecurityContextType {
  isSecure: boolean;
}

const SecurityContext = createContext<SecurityContextType>({ isSecure: false });

export const useSecurityContext = () => {
  return useContext(SecurityContext);
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecure, setIsSecure] = React.useState(false);

  useEffect(() => {
    try {
      // Initialize security middleware
      const securityConfig = initializeSecurity();
      
      // Verify HTTPS in production
      if (typeof window !== 'undefined') {
        const isProduction = window.location.hostname !== 'localhost';
        const isHttps = window.location.protocol === 'https:';
        
        if (isProduction && !isHttps) {
          console.warn('Security warning: Application should be served over HTTPS in production');
          // Redirect to HTTPS
          window.location.href = `https://${window.location.host}${window.location.pathname}`;
          return;
        }
      }
      
      setIsSecure(true);
      console.log('Security middleware initialized:', securityConfig);
    } catch (error) {
      console.error('Failed to initialize security:', error);
      setIsSecure(false);
    }
  }, []);

  return (
    <SecurityContext.Provider value={{ isSecure }}>
      {children}
    </SecurityContext.Provider>
  );
};