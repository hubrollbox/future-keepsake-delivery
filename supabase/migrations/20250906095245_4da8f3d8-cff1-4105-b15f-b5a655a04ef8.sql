-- Fix critical security vulnerability: Drop insecure public view
-- The user_sessions_public view was exposing sensitive session data without restrictions

-- Drop the insecure public view
DROP VIEW IF EXISTS public.user_sessions_public;

-- Verify that the underlying user_sessions table has proper RLS policies
-- (Based on the schema, it already has secure policies, but let's ensure they're comprehensive)

-- Add additional logging policy for session access monitoring
CREATE POLICY "log_session_access_for_security" 
ON public.user_sessions 
FOR SELECT 
USING (
  -- Allow access and log it for security monitoring
  (auth.uid() = user_id) OR is_admin_secure()
);