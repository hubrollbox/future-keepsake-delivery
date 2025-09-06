-- Fix critical security vulnerability in user_sessions_public table
-- Enable Row Level Security and add proper access policies

-- Enable RLS on the user_sessions_public table
ALTER TABLE public.user_sessions_public ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own session data
CREATE POLICY "users_can_only_access_own_sessions" 
ON public.user_sessions_public 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to access session data for security monitoring
CREATE POLICY "admins_can_access_all_sessions_for_security" 
ON public.user_sessions_public 
FOR SELECT 
USING (is_admin_secure());

-- Add security audit logging for session access
CREATE OR REPLACE FUNCTION public.log_session_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive session data for security monitoring
  PERFORM public.log_security_event(
    auth.uid(),
    TG_OP,
    'user_sessions_public',
    COALESCE(NEW.id::text, OLD.id::text),
    NULL,
    NULL,
    true,
    NULL,
    jsonb_build_object(
      'session_user_id', COALESCE(NEW.user_id, OLD.user_id),
      'ip_address', COALESCE(NEW.ip_address, OLD.ip_address)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

-- Create trigger to log session access
CREATE TRIGGER log_user_session_access
AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.user_sessions_public
FOR EACH ROW EXECUTE FUNCTION public.log_session_access();