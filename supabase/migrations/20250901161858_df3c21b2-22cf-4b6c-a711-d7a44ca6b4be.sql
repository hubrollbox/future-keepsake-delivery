-- CRITICAL Security Fixes Migration
-- This migration addresses multiple security vulnerabilities identified in the comprehensive audit

-- 1. Fix infinite recursion in RLS policies by using security definer functions
CREATE OR REPLACE FUNCTION public.is_profile_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$function$;

-- 2. Secure all database functions with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
BEGIN
  RAISE NOTICE 'handle_new_user triggered for user: %', NEW.id;
  RAISE NOTICE 'full_name: %, email: %, avatar_url: %', NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url';
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_points_from_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  achievement_points INTEGER;
BEGIN
  SELECT points INTO achievement_points FROM public.achievements WHERE id = NEW.achievement_id;
  UPDATE public.profiles
  SET total_points = total_points + achievement_points,
      level = public.calculate_level(total_points + achievement_points)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_points_from_quest_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  quest_reward INTEGER;
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    SELECT reward INTO quest_reward FROM public.quests WHERE id = NEW.quest_id;
    UPDATE public.profiles
    SET total_points = total_points + quest_reward,
        level = public.calculate_level(total_points + quest_reward)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. Restrict public access to HTTP extension functions
REVOKE ALL ON FUNCTION public.http(http_request) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.http_get(character varying) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.http_post(character varying, character varying, character varying) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.http_post(character varying, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.http_delete(character varying) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.http_delete(character varying, character varying, character varying) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.http_put(character varying, character varying, character varying) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.http_patch(character varying, character varying, character varying) FROM PUBLIC;

-- Grant only to service role for system functions
GRANT EXECUTE ON FUNCTION public.http(http_request) TO service_role;
GRANT EXECUTE ON FUNCTION public.send_due_deliveries() TO service_role;

-- 4. Add rate limiting table for edge function abuse prevention
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_ip inet NOT NULL,
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(client_ip, endpoint, window_start)
);

-- Enable RLS on rate limiting table
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role can manage rate limits" ON public.api_rate_limits
FOR ALL USING (false);

-- Grant service role permissions
GRANT ALL ON public.api_rate_limits TO service_role;

-- 5. Add user session security table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_accessed timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.user_sessions  
FOR DELETE USING (auth.uid() = user_id);

-- System can insert sessions
CREATE POLICY "System can insert sessions" ON public.user_sessions
FOR INSERT WITH CHECK (true);

-- 6. Add audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  ip_address inet,
  user_agent text,
  success boolean DEFAULT true,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
FOR SELECT USING (is_profile_admin());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.security_audit_log
FOR INSERT WITH CHECK (true);

-- Grant service role permissions
GRANT ALL ON public.security_audit_log TO service_role;

-- 7. Add indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_client_endpoint ON public.api_rate_limits(client_ip, endpoint, window_start);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_action ON public.security_audit_log(user_id, action, created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);

-- 8. Create security monitoring function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id uuid,
  p_action text,
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_success boolean DEFAULT true,
  p_error_message text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, resource_type, resource_id, ip_address, 
    user_agent, success, error_message, metadata
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_ip_address,
    p_user_agent, p_success, p_error_message, p_metadata
  );
END;
$function$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.log_security_event TO authenticated;

-- 9. Update profiles policies to use security definer function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (is_profile_admin());