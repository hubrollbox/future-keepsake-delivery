import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

const ALLOWED_ACTIONS = new Set([
  'rate_limit_exceeded',
  'login_attempt',
  'login_success',
  'login_failure',
  'password_reset',
  'suspicious_activity',
  'api_access',
  'admin_action',
]);
const ALLOWED_RESOURCE_TYPES = new Set([
  'user', 'keepsake', 'delivery', 'payment', 'admin', 'auth', 'api', 'system',
]);

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin') ?? undefined);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authenticated user (JWT) to log security events
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userErr } = await authClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const authedUserId = userData.user.id;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const clientIP = req.headers.get('cf-connecting-ip') ||
                     req.headers.get('x-forwarded-for') ||
                     'unknown';

    const endpoint = new URL(req.url).pathname;
    const now = new Date();
    const windowStart = new Date(now.getTime() - (60 * 1000));

    const { data: rateLimitData } = await supabaseClient
      .from('api_rate_limits')
      .select('request_count')
      .eq('client_ip', clientIP)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    if (rateLimitData && rateLimitData.request_count >= 60) {
      await supabaseClient
        .from('security_audit_log')
        .insert({
          user_id: authedUserId,
          action: 'rate_limit_exceeded',
          ip_address: clientIP,
          success: false,
          error_message: 'Rate limit exceeded',
          metadata: { endpoint, request_count: rateLimitData.request_count }
        });

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabaseClient
      .from('api_rate_limits')
      .upsert({
        client_ip: clientIP,
        endpoint: endpoint,
        request_count: (rateLimitData?.request_count || 0) + 1,
        window_start: windowStart.toISOString()
      }, { onConflict: 'client_ip,endpoint,window_start' });

    const body = await req.json().catch(() => ({}));
    const { action, resource_type, resource_id, metadata } = body ?? {};

    // Validate action and resource_type against whitelist
    if (typeof action !== 'string' || !ALLOWED_ACTIONS.has(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (resource_type && (typeof resource_type !== 'string' || !ALLOWED_RESOURCE_TYPES.has(resource_type))) {
      return new Response(
        JSON.stringify({ error: 'Invalid resource_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabaseClient
      .from('security_audit_log')
      .insert({
        user_id: authedUserId,
        action,
        resource_type: resource_type ?? null,
        resource_id: resource_id ? String(resource_id).slice(0, 255) : null,
        ip_address: clientIP,
        user_agent: req.headers.get('user-agent'),
        success: true,
        metadata: metadata && typeof metadata === 'object' ? metadata : {}
      });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Security monitor error');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
