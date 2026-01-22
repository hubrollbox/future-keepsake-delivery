import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'
import { corsHeaders } from '../_shared/cors.ts'

// Startup secret validation
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    `Missing required secrets: ${[
      !SUPABASE_URL && "SUPABASE_URL",
      !SUPABASE_SERVICE_ROLE_KEY && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean).join(", ")}`
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Helper to mask IP for logging
function maskIP(ip: string): string {
  if (ip === "unknown") return ip;
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.substring(0, 10) + "***";
}

// Simple cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

// Enhanced input validation and sanitization
function validateKeepsakeId(id: string): boolean {
  // Strict UUID validation - only allow exact format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) return false
  
  // Additional length check
  if (id.length !== 36) return false
  
  return true
}

function sanitizeOutput(data: any): any {
  if (!data) return null
  
  // Remove all sensitive fields
  const sanitized = {
    id: data.id,
    title: data.title?.replace(/[<>\\"'&]/g, ''), // Basic XSS protection
    message: data.message?.replace(/[<>\\"'&]/g, ''),
    delivery_date: data.delivery_date,
    type: data.type,
    created_at: data.created_at
  }
  
  // Remove any null/undefined values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === null || sanitized[key] === undefined) {
      delete sanitized[key]
    }
  })
  
  return sanitized
}

async function getPublicKeepsake(id: string) {
  // Check cache first
  const cached = cache.get(id)
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }

  try {
    // Validate input
    if (!validateKeepsakeId(id)) {
      throw new Error('Invalid keepsake ID format')
    }

    // Query with strict conditions for public access
    const { data, error } = await supabase
      .from('keepsakes')
      .select('id, title, message, delivery_date, type, created_at')
      .eq('id', id)
      .eq('status', 'sent') // Only show already delivered keepsakes
      .eq('is_public', true) // Must be explicitly marked as public
      .lte('delivery_date', new Date().toISOString()) // Only past delivery dates
      .single()

    if (error) {
      console.error('Database error:', error.message)
      return null
    }
    
    const sanitizedData = sanitizeOutput(data)
    
    // Cache the result
    cache.set(id, { data: sanitizedData, timestamp: Date.now() })
    
    return sanitizedData
  } catch (error) {
    console.error('Error fetching keepsake:', error.message)
    return null
  }
}

// Database-backed rate limiting
const RATE_LIMIT = 10 // requests per minute
const RATE_LIMIT_WINDOW = 60000 // 1 minute

async function isRateLimited(ip: string, endpoint: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW)
  
  try {
    // Clean old entries
    await supabase
      .from('rate_limit_tracking')
      .delete()
      .lt('created_at', windowStart.toISOString())
    
    // Get current count for this IP and endpoint
    const { data, error } = await supabase
      .from('rate_limit_tracking')
      .select('request_count')
      .eq('endpoint', endpoint)
      .eq('client_ip', ip)
      .gte('created_at', windowStart.toISOString())
      .single()
    
    if (error && error.code !== 'PGRST116') { // Not found is ok
      console.error('Rate limit check error:', error.message)
      // SECURITY: Fail-closed - deny request on database error
      return true
    }
    
    const currentCount = data?.request_count || 0
    
    if (currentCount >= RATE_LIMIT) {
      return true
    }
    
    // Increment counter
    await supabase
      .from('rate_limit_tracking')
      .upsert({
        endpoint,
        client_ip: ip,
        request_count: currentCount + 1,
        window_start: windowStart.toISOString()
      }, {
        onConflict: 'endpoint,client_ip,window_start'
      })
    
    return false
  } catch (error) {
    console.error('Rate limiting error:', (error as Error).message)
    // SECURITY: Fail-closed - deny request on error
    return true
  }
}

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown'
    if (await isRateLimited(clientIP, 'secure-public-keepsake')) {
      // Log rate limit hit
      await supabase.rpc('log_security_event', {
        p_user_id: null,
        p_action: 'rate_limit_exceeded',
        p_resource_type: 'public_keepsake',
        p_resource_id: null,
        p_ip_address: clientIP,
        p_user_agent: req.headers.get('user-agent'),
        p_success: false,
        p_error_message: 'Rate limit exceeded',
        p_metadata: { endpoint: 'secure-public-keepsake' }
      })
      
      return new Response(
        JSON.stringify({ error: 'Too many requests' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract and validate keepsake ID from URL
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Keepsake ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Fetching public keepsake: ${id} for IP: ${maskIP(clientIP)}`)

    const keepsake = await getPublicKeepsake(id)

    // Log access attempt
    await supabase.rpc('log_security_event', {
      p_user_id: null,
      p_action: 'public_keepsake_access',
      p_resource_type: 'keepsakes',
      p_resource_id: id,
      p_ip_address: clientIP,
      p_user_agent: req.headers.get('user-agent'),
      p_success: !!keepsake,
      p_error_message: keepsake ? null : 'Keepsake not found or not public',
      p_metadata: { endpoint: 'secure-public-keepsake' }
    })

    if (!keepsake) {
      return new Response(
        JSON.stringify({ error: 'Keepsake not found or not publicly available' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ keepsake }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // 5 minute cache
        } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error.message)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
