// Get allowed origin from environment or use production domain
const getAllowedOrigin = (): string => {
  const envOrigin = Deno.env.get('ALLOWED_ORIGIN');
  if (envOrigin) return envOrigin;
  
  // Production domains
  const allowedDomains = [
    'https://keepla.pt',
    'https://www.keepla.pt',
    'https://future-keepsake-delivery.lovable.app',
  ];
  
  return allowedDomains[0]; // Default to production
};

export const corsHeaders = {
  'Access-Control-Allow-Origin': getAllowedOrigin(),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Dynamic CORS headers based on request origin (for multi-domain support)
export const getCorsHeaders = (requestOrigin?: string): Record<string, string> => {
  const allowedOrigins = [
    'https://keepla.pt',
    'https://www.keepla.pt',
    'https://future-keepsake-delivery.lovable.app',
    'https://id-preview--6b25a51f-592a-44a6-8116-2a0c441ff7cd.lovable.app',
  ];
  
  // Add localhost for development
  if (Deno.env.get('DENO_ENV') === 'development') {
    allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
  }
  
  const origin = requestOrigin && allowedOrigins.includes(requestOrigin) 
    ? requestOrigin 
    : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
};