-- Fix critical security vulnerability: Secure profiles table access
-- The profiles table contains sensitive user data that must be protected

-- First, ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing potentially insecure policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_secure_admin_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_secure_own_access" ON public.profiles;

-- Create secure, non-overlapping policies for profiles table

-- Policy 1: Users can view only their own profile
CREATE POLICY "profiles_user_read_own" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can insert only their own profile (for registration)
CREATE POLICY "profiles_user_insert_own" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update only their own profile
CREATE POLICY "profiles_user_update_own" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 4: Users can delete only their own profile
CREATE POLICY "profiles_user_delete_own" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Policy 5: Secure admin read access with strict verification
CREATE POLICY "profiles_admin_read_secure" 
ON public.profiles 
FOR SELECT 
USING (
  is_admin_secure() AND 
  auth.uid() IS NOT NULL AND 
  auth.role() = 'authenticated'
);

-- Policy 6: Secure admin management with strict verification
CREATE POLICY "profiles_admin_manage_secure" 
ON public.profiles 
FOR ALL 
USING (
  is_admin_secure() AND 
  auth.uid() IS NOT NULL AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  is_admin_secure() AND 
  auth.uid() IS NOT NULL AND 
  auth.role() = 'authenticated'
);

-- Add security logging trigger for profile access monitoring
CREATE OR REPLACE FUNCTION public.log_profile_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive profile data
  PERFORM public.log_security_event(
    auth.uid(),
    TG_OP,
    'profiles',
    COALESCE(NEW.id::text, OLD.id::text),
    NULL,
    NULL,
    true,
    NULL,
    jsonb_build_object(
      'profile_email', COALESCE(NEW.email, OLD.email),
      'profile_name', COALESCE(NEW.full_name, OLD.full_name),
      'is_admin_access', is_admin_secure()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for profile access logging
DROP TRIGGER IF EXISTS log_profile_access_trigger ON public.profiles;
CREATE TRIGGER log_profile_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_profile_access();

-- Ensure the is_admin_secure function exists and is properly secured
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
    AND auth.uid() IS NOT NULL
    AND auth.role() = 'authenticated'
  );
$$;