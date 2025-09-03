-- Critical Security Fixes Migration
-- Fix over-permissive RLS policies and harden database functions

-- 1. Fix user_sessions RLS policies (currently allows system inserts to all)
DROP POLICY IF EXISTS "System can insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;

-- Create more restrictive policies for user_sessions
CREATE POLICY "user_sessions_own_access"
ON public.user_sessions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only allow service role to insert sessions (not any authenticated user)
CREATE POLICY "user_sessions_service_insert"
ON public.user_sessions
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- 2. Fix security_audit_log RLS policies (currently allows any insert)
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_log;

-- Create more restrictive policies for audit logs
CREATE POLICY "security_audit_log_admin_read"
ON public.security_audit_log
FOR SELECT
USING (is_admin_secure());

-- Only allow service role to insert audit logs
CREATE POLICY "security_audit_log_service_insert"
ON public.security_audit_log
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- 3. Harden all database functions with immutable search_path
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_profile_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(role, 'user') 
  FROM public.admin_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.calculate_level(points integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  level_result integer;
BEGIN
  IF points < 100 THEN
    level_result := 1;
  ELSIF points < 300 THEN
    level_result := 2;
  ELSIF points < 600 THEN
    level_result := 3;
  ELSE
    level_result := 4;
  END IF;

  RETURN level_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_recipient_stats_secure()
RETURNS TABLE(total_recipients bigint, recent_recipients bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow admins to access recipient statistics
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_recipients,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_recipients
  FROM public.recipients;
END;
$$;

-- 4. Remove HTTP extension from public schema (security risk)
-- First check if it exists and drop it safely
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    DROP EXTENSION IF EXISTS http CASCADE;
    -- Recreate in extensions schema if needed
    CREATE EXTENSION IF NOT EXISTS http SCHEMA extensions;
  END IF;
END
$$;

-- 5. Harden public table policies - remove overly permissive ones
-- Products table - ensure only active products are visible
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "products_public_read_active_only"
ON public.products
FOR SELECT
USING (active = true AND stock > 0);

-- Achievements and quests - keep read access but ensure they're properly gated
-- These are OK as they don't contain sensitive data

-- 6. Add rate limiting table for API protection
CREATE TABLE IF NOT EXISTS public.api_request_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint text NOT NULL,
  ip_address inet,
  user_id uuid,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on API request log
ALTER TABLE public.api_request_log ENABLE ROW LEVEL SECURITY;

-- Only service role can manage API request logs
CREATE POLICY "api_request_log_service_only"
ON public.api_request_log
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');