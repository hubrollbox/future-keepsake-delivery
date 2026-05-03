import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin') ?? undefined);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate: require either an admin JWT or a shared cron secret header
    const cronSecret = Deno.env.get('AUDIT_CLEANUP_SECRET');
    const providedSecret = req.headers.get('x-cron-secret');
    const authHeader = req.headers.get('Authorization');

    let authorized = false;

    if (cronSecret && providedSecret && providedSecret === cronSecret) {
      authorized = true;
    } else if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const authClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: userData } = await authClient.auth.getUser(token);
      if (userData?.user) {
        const { data: adminRow } = await authClient
          .from('admin_roles')
          .select('role')
          .eq('user_id', userData.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        if (adminRow) authorized = true;
      }
    }

    if (!authorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Only allow POST requests from authenticated service
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    // Clean up old audit logs (older than 90 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const { data: deletedLogs, error: deleteError } = await supabaseClient
      .from('security_audit_log')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (deleteError) {
      throw deleteError;
    }

    // Clean up old rate limit records (older than 24 hours)
    const rateLimitCutoff = new Date();
    rateLimitCutoff.setHours(rateLimitCutoff.getHours() - 24);

    const { data: deletedRateLimits, error: rateLimitError } = await supabaseClient
      .from('api_rate_limits')
      .delete()
      .lt('created_at', rateLimitCutoff.toISOString());

    if (rateLimitError) {
      throw rateLimitError;
    }

    // Clean up expired user sessions
    const { data: deletedSessions, error: sessionError } = await supabaseClient
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (sessionError) {
      throw sessionError;
    }

    // Log the cleanup operation
    await supabaseClient
      .from('security_audit_log')
      .insert({
        action: 'audit_cleanup',
        resource_type: 'system',
        success: true,
        metadata: {
          deleted_audit_logs: deletedLogs?.length || 0,
          deleted_rate_limits: deletedRateLimits?.length || 0,
          deleted_sessions: deletedSessions?.length || 0,
          cutoff_date: cutoffDate.toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cleanup completed',
        deleted: {
          audit_logs: deletedLogs?.length || 0,
          rate_limits: deletedRateLimits?.length || 0,
          sessions: deletedSessions?.length || 0
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Audit cleanup error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Cleanup failed', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})