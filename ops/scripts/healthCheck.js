#!/usr/bin/env node

/**
 * Health Check Script for CI/CD
 * 
 * This script validates service connections before deployment.
 * Run with: node ops/scripts/healthCheck.js
 * 
 * Exit codes:
 *   0 - All checks passed
 *   1 - Critical checks failed
 *   2 - Warnings present but non-critical
 */

const https = require('https');
const http = require('http');

// Configuration
const SUPABASE_URL = "https://mlxmymmoysbtnvcehggn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seG15bW1veXNidG52Y2VoZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM1MzIsImV4cCI6MjA2NTE3OTUzMn0.NWN13hyHErwzxD-9mW3U4v3S5kDBkSt5d0O49Eol90o";

const TIMEOUT = 10000; // 10 seconds

const results = [];
let hasErrors = false;
let hasWarnings = false;

/**
 * Make an HTTP request and return the response
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const start = Date.now();
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: TIMEOUT
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data,
          latency: Date.now() - start
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * Log a check result
 */
function logResult(service, status, message, latency = null) {
  const icon = status === 'ok' ? '✅' : status === 'error' ? '❌' : status === 'warning' ? '⚠️' : '⏭️';
  const latencyStr = latency ? ` (${latency}ms)` : '';
  
  console.log(`${icon} ${service}: ${message}${latencyStr}`);
  
  results.push({ service, status, message, latency });
  
  if (status === 'error') hasErrors = true;
  if (status === 'warning') hasWarnings = true;
}

/**
 * Check Supabase REST API
 */
async function checkSupabaseRest() {
  try {
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.status === 200) {
      logResult('Supabase REST API', 'ok', 'Conexão estabelecida', response.latency);
    } else {
      logResult('Supabase REST API', 'warning', `Status: ${response.status}`, response.latency);
    }
  } catch (error) {
    logResult('Supabase REST API', 'error', `Falha: ${error.message}`);
  }
}

/**
 * Check Supabase Auth API
 */
async function checkSupabaseAuth() {
  try {
    const response = await makeRequest(`${SUPABASE_URL}/auth/v1/health`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    if (response.status === 200) {
      logResult('Supabase Auth', 'ok', 'Serviço de autenticação OK', response.latency);
    } else {
      logResult('Supabase Auth', 'warning', `Status: ${response.status}`, response.latency);
    }
  } catch (error) {
    logResult('Supabase Auth', 'error', `Falha: ${error.message}`);
  }
}

/**
 * Check Supabase Storage API
 */
async function checkSupabaseStorage() {
  try {
    const response = await makeRequest(`${SUPABASE_URL}/storage/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    // 400 is OK - it means the endpoint exists but needs proper request
    if (response.status === 200 || response.status === 400) {
      logResult('Supabase Storage', 'ok', 'Storage acessível', response.latency);
    } else {
      logResult('Supabase Storage', 'warning', `Status: ${response.status}`, response.latency);
    }
  } catch (error) {
    logResult('Supabase Storage', 'error', `Falha: ${error.message}`);
  }
}

/**
 * Check Supabase Edge Functions
 */
async function checkSupabaseFunctions() {
  try {
    // Check if functions endpoint is reachable
    const response = await makeRequest(`${SUPABASE_URL}/functions/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    // 404 is OK - it means the endpoint exists but no function at root
    if (response.status === 200 || response.status === 404) {
      logResult('Supabase Functions', 'ok', 'Edge Functions acessíveis', response.latency);
    } else {
      logResult('Supabase Functions', 'warning', `Status: ${response.status}`, response.latency);
    }
  } catch (error) {
    logResult('Supabase Functions', 'error', `Falha: ${error.message}`);
  }
}

/**
 * Check environment variables
 */
function checkEnvVariables() {
  const vars = [
    { name: 'VITE_STRIPE_PUBLIC_KEY', required: false, prefix: 'pk_' },
    { name: 'VITE_SENTRY_DSN', required: false, prefix: 'https://' },
    { name: 'VITE_GA_MEASUREMENT_ID', required: false, prefix: 'G-' }
  ];
  
  for (const v of vars) {
    const value = process.env[v.name];
    
    if (!value) {
      if (v.required) {
        logResult(`Env: ${v.name}`, 'error', 'Não configurado (obrigatório)');
      } else {
        logResult(`Env: ${v.name}`, 'skipped', 'Não configurado (opcional)');
      }
    } else if (v.prefix && !value.startsWith(v.prefix)) {
      logResult(`Env: ${v.name}`, 'warning', `Formato suspeito (esperado ${v.prefix}...)`);
    } else {
      logResult(`Env: ${v.name}`, 'ok', 'Configurado');
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log('🏥 ═══════════════════════════════════════════════════');
  console.log('🏥  HEALTH CHECK - Keepla Services');
  console.log('🏥 ═══════════════════════════════════════════════════');
  console.log('');
  
  console.log('📡 Verificando serviços Supabase...');
  console.log('');
  
  await Promise.all([
    checkSupabaseRest(),
    checkSupabaseAuth(),
    checkSupabaseStorage(),
    checkSupabaseFunctions()
  ]);
  
  console.log('');
  console.log('🔧 Verificando variáveis de ambiente...');
  console.log('');
  
  checkEnvVariables();
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  
  const summary = {
    total: results.length,
    ok: results.filter(r => r.status === 'ok').length,
    errors: results.filter(r => r.status === 'error').length,
    warnings: results.filter(r => r.status === 'warning').length,
    skipped: results.filter(r => r.status === 'skipped').length
  };
  
  console.log(`📊 Resumo: ${summary.ok} OK | ${summary.errors} Erros | ${summary.warnings} Avisos | ${summary.skipped} Ignorados`);
  
  if (hasErrors) {
    console.log('');
    console.log('❌ HEALTH CHECK FALHOU - Verifique os erros acima');
    console.log('');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('');
    console.log('⚠️  HEALTH CHECK PASSOU COM AVISOS');
    console.log('');
    process.exit(0); // Warnings don't block deployment
  } else {
    console.log('');
    console.log('✅ HEALTH CHECK PASSOU - Todos os serviços operacionais');
    console.log('');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('❌ Health check error:', error);
  process.exit(1);
});
