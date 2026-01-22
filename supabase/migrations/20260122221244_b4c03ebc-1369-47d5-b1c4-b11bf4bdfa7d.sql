-- Fix profiles table RLS policies
-- The issue is that all policies are RESTRICTIVE (PERMISSIVE false)
-- We need at least one PERMISSIVE policy for each operation

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_user_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_manage" ON public.profiles;

-- Re-create policies as PERMISSIVE (default) to ensure proper access control
-- Users can only read their own profile
CREATE POLICY "profiles_user_read_own" ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "profiles_user_insert_own" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "profiles_user_update_own" ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can only delete their own profile
CREATE POLICY "profiles_user_delete_own" ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Admins can read all profiles (for admin dashboard)
CREATE POLICY "profiles_admin_read" ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin_secure());

-- Admins can manage all profiles
CREATE POLICY "profiles_admin_manage" ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());

-- Explicitly deny anonymous access by NOT creating any policies for anon role
-- RLS is already enabled, so with no anon policies, anonymous users cannot access profiles

-- Add a comment explaining the security model
COMMENT ON TABLE public.profiles IS 'User profiles with email addresses. RLS ensures users can only access their own profile. Admin access via is_admin_secure().';