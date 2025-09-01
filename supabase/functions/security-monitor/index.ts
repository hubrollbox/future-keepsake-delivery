import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rate limiting check
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown';
    
    const endpoint = new URL(req.url).pathname;
    const now = new Date();
    const windowStart = new Date(now.getTime() - (60 * 1000)); // 1 minute window

    // Check current rate limit
    const { data: rateLimitData } = await supabaseClient
      .from('api_rate_limits')
      .select('request_count')
      .eq('client_ip', clientIP)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    // Rate limit: 60 requests per minute
    if (rateLimitData && rateLimitData.request_count >= 60) {
      await supabaseClient
        .from('security_audit_log')
        .insert({
          action: 'rate_limit_exceeded',
          ip_address: clientIP,
          success: false,
          error_message: 'Rate limit exceeded',
          metadata: { endpoint, request_count: rateLimitData.request_count }
        });

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update rate limit counter
    await supabaseClient
      .from('api_rate_limits')
      .upsert({
        client_ip: clientIP,
        endpoint: endpoint,
        request_count: (rateLimitData?.request_count || 0) + 1,
        window_start: windowStart.toISOString()
      }, {
        onConflict: 'client_ip,endpoint,window_start'
      });

    // Process the actual request
    const { action, resource_type, resource_id, metadata } = await req.json();

    // Log security event
    await supabaseClient
      .from('security_audit_log')
      .insert({
        action: action,
        resource_type: resource_type,
        resource_id: resource_id,
        ip_address: clientIP,
        user_agent: req.headers.get('user-agent'),
        success: true,
        metadata: metadata || {}
      });

    return new Response(
      JSON.stringify({ success: true, message: 'Security event logged' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Security monitor error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})