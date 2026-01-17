import { supabase } from '@/integrations/supabase/client';

export interface HealthCheckResult {
  service: string;
  status: 'ok' | 'error' | 'warning' | 'skipped';
  message: string;
  latency?: number;
  details?: Record<string, unknown>;
}

export interface HealthCheckReport {
  timestamp: string;
  overall: 'healthy' | 'degraded' | 'unhealthy';
  results: HealthCheckResult[];
  summary: {
    total: number;
    ok: number;
    errors: number;
    warnings: number;
    skipped: number;
  };
}

/**
 * Check Supabase database connection
 */
async function checkSupabase(): Promise<HealthCheckResult> {
  const start = performance.now();
  
  try {
    // Simple query to verify connection
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    const latency = Math.round(performance.now() - start);
    
    if (error) {
      // RLS error is OK - it means we connected but auth is working
      if (error.code === 'PGRST301' || error.message.includes('JWT')) {
        return {
          service: 'Supabase Database',
          status: 'ok',
          message: 'Conexão estabelecida (autenticação ativa)',
          latency,
          details: { rlsActive: true }
        };
      }
      
      return {
        service: 'Supabase Database',
        status: 'error',
        message: `Erro de conexão: ${error.message}`,
        latency,
        details: { code: error.code }
      };
    }
    
    return {
      service: 'Supabase Database',
      status: 'ok',
      message: 'Conexão estabelecida com sucesso',
      latency
    };
  } catch (err) {
    return {
      service: 'Supabase Database',
      status: 'error',
      message: `Falha na conexão: ${err instanceof Error ? err.message : 'Unknown error'}`,
      latency: Math.round(performance.now() - start)
    };
  }
}

/**
 * Check Supabase Auth service
 */
async function checkSupabaseAuth(): Promise<HealthCheckResult> {
  const start = performance.now();
  
  try {
    const { error } = await supabase.auth.getSession();
    const latency = Math.round(performance.now() - start);
    
    if (error) {
      return {
        service: 'Supabase Auth',
        status: 'warning',
        message: `Auth check warning: ${error.message}`,
        latency
      };
    }
    
    return {
      service: 'Supabase Auth',
      status: 'ok',
      message: 'Serviço de autenticação operacional',
      latency
    };
  } catch (err) {
    return {
      service: 'Supabase Auth',
      status: 'error',
      message: `Auth service error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      latency: Math.round(performance.now() - start)
    };
  }
}

/**
 * Check Supabase Storage
 */
async function checkSupabaseStorage(): Promise<HealthCheckResult> {
  const start = performance.now();
  
  try {
    const { error } = await supabase.storage.listBuckets();
    const latency = Math.round(performance.now() - start);
    
    if (error) {
      // Permission error is expected without auth
      if (error.message.includes('not authorized') || error.message.includes('permission')) {
        return {
          service: 'Supabase Storage',
          status: 'ok',
          message: 'Storage acessível (requer autenticação para listar)',
          latency
        };
      }
      
      return {
        service: 'Supabase Storage',
        status: 'warning',
        message: `Storage warning: ${error.message}`,
        latency
      };
    }
    
    return {
      service: 'Supabase Storage',
      status: 'ok',
      message: 'Storage operacional',
      latency
    };
  } catch (err) {
    return {
      service: 'Supabase Storage',
      status: 'error',
      message: `Storage error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      latency: Math.round(performance.now() - start)
    };
  }
}

/**
 * Check Stripe configuration (client-side only)
 */
function checkStripeConfig(): HealthCheckResult {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!stripeKey) {
    return {
      service: 'Stripe',
      status: 'skipped',
      message: 'Chave pública não configurada (VITE_STRIPE_PUBLIC_KEY)',
      details: { configured: false }
    };
  }
  
  const isTestKey = stripeKey.startsWith('pk_test_');
  const isLiveKey = stripeKey.startsWith('pk_live_');
  
  if (!isTestKey && !isLiveKey) {
    return {
      service: 'Stripe',
      status: 'error',
      message: 'Chave pública inválida (deve começar com pk_test_ ou pk_live_)',
      details: { keyPrefix: stripeKey.substring(0, 8) }
    };
  }
  
  return {
    service: 'Stripe',
    status: 'ok',
    message: `Configurado em modo ${isTestKey ? 'teste' : 'produção'}`,
    details: { 
      mode: isTestKey ? 'test' : 'live',
      configured: true 
    }
  };
}

/**
 * Check Sentry configuration
 */
function checkSentryConfig(): HealthCheckResult {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!sentryDsn) {
    return {
      service: 'Sentry',
      status: 'skipped',
      message: 'DSN não configurado (opcional)',
      details: { configured: false }
    };
  }
  
  try {
    const url = new URL(sentryDsn);
    if (!url.hostname.includes('sentry')) {
      return {
        service: 'Sentry',
        status: 'warning',
        message: 'DSN pode estar incorreto',
        details: { host: url.hostname }
      };
    }
    
    return {
      service: 'Sentry',
      status: 'ok',
      message: 'Monitorização de erros configurada',
      details: { configured: true }
    };
  } catch {
    return {
      service: 'Sentry',
      status: 'error',
      message: 'DSN inválido',
      details: { configured: false }
    };
  }
}

/**
 * Check Google Analytics configuration
 */
function checkAnalyticsConfig(): HealthCheckResult {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!gaId) {
    return {
      service: 'Google Analytics',
      status: 'skipped',
      message: 'Measurement ID não configurado (opcional)',
      details: { configured: false }
    };
  }
  
  if (!gaId.startsWith('G-')) {
    return {
      service: 'Google Analytics',
      status: 'error',
      message: 'Measurement ID inválido (deve começar com G-)',
      details: { idPrefix: gaId.substring(0, 2) }
    };
  }
  
  return {
    service: 'Google Analytics',
    status: 'ok',
    message: 'Analytics configurado',
    details: { configured: true }
  };
}

/**
 * Check browser/environment capabilities
 */
function checkEnvironment(): HealthCheckResult {
  const details: Record<string, unknown> = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
    localStorage: false,
    sessionStorage: false
  };
  
  try {
    localStorage.setItem('healthcheck_test', 'test');
    localStorage.removeItem('healthcheck_test');
    details.localStorage = true;
  } catch {
    details.localStorage = false;
  }
  
  try {
    sessionStorage.setItem('healthcheck_test', 'test');
    sessionStorage.removeItem('healthcheck_test');
    details.sessionStorage = true;
  } catch {
    details.sessionStorage = false;
  }
  
  if (!navigator.onLine) {
    return {
      service: 'Environment',
      status: 'error',
      message: 'Sem conexão à internet',
      details
    };
  }
  
  if (!details.localStorage || !details.sessionStorage) {
    return {
      service: 'Environment',
      status: 'warning',
      message: 'Storage limitado (cookies de terceiros bloqueados?)',
      details
    };
  }
  
  return {
    service: 'Environment',
    status: 'ok',
    message: 'Ambiente do browser OK',
    details
  };
}

/**
 * Run all health checks and return a comprehensive report
 */
export async function runHealthCheck(): Promise<HealthCheckReport> {
  console.log('🏥 Starting health check...');
  
  const results: HealthCheckResult[] = [];
  
  // Run async checks in parallel
  const [supabaseResult, authResult, storageResult] = await Promise.all([
    checkSupabase(),
    checkSupabaseAuth(),
    checkSupabaseStorage()
  ]);
  
  results.push(supabaseResult, authResult, storageResult);
  
  // Run sync checks
  results.push(
    checkStripeConfig(),
    checkSentryConfig(),
    checkAnalyticsConfig(),
    checkEnvironment()
  );
  
  // Calculate summary
  const summary = {
    total: results.length,
    ok: results.filter(r => r.status === 'ok').length,
    errors: results.filter(r => r.status === 'error').length,
    warnings: results.filter(r => r.status === 'warning').length,
    skipped: results.filter(r => r.status === 'skipped').length
  };
  
  // Determine overall health
  let overall: 'healthy' | 'degraded' | 'unhealthy';
  if (summary.errors > 0) {
    overall = 'unhealthy';
  } else if (summary.warnings > 0) {
    overall = 'degraded';
  } else {
    overall = 'healthy';
  }
  
  const report: HealthCheckReport = {
    timestamp: new Date().toISOString(),
    overall,
    results,
    summary
  };
  
  // Log results
  console.log(`🏥 Health check complete: ${overall.toUpperCase()}`);
  results.forEach(r => {
    const icon = r.status === 'ok' ? '✅' : r.status === 'error' ? '❌' : r.status === 'warning' ? '⚠️' : '⏭️';
    console.log(`${icon} ${r.service}: ${r.message}${r.latency ? ` (${r.latency}ms)` : ''}`);
  });
  
  return report;
}

/**
 * Quick health check - only critical services
 */
export async function quickHealthCheck(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    // RLS errors are acceptable - it means connection works
    return !error || error.code === 'PGRST301';
  } catch {
    return false;
  }
}
