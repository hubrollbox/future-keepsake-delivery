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