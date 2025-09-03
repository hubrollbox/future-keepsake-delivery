import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'
import { corsHeaders } from '../_shared/cors.ts'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Simple cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

// Enhanced input validation and sanitization
function validateKeepsakeId(id: string): boolean {
  // UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
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
      .lte('delivery_date', new Date().toISOString()) // Only past delivery dates
      .single()

    if (error) {
      console.error('Database error:', error.message)
      return null
    }

    // Additional security check - only allow if keepsake is truly public
    // This would need to be implemented in your database schema
    // For now, we restrict to sent keepsakes with past delivery dates
    
    const sanitizedData = sanitizeOutput(data)
    
    // Cache the result
    cache.set(id, { data: sanitizedData, timestamp: Date.now() })
    
    return sanitizedData
  } catch (error) {
    console.error('Error fetching keepsake:', error.message)
    return null
  }
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per minute
const RATE_LIMIT_WINDOW = 60000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return true
  }
  
  userLimit.count++
  return false
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
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    if (isRateLimited(clientIP)) {
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

    console.log(`Fetching public keepsake: ${id} for IP: ${clientIP}`)

    const keepsake = await getPublicKeepsake(id)

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
