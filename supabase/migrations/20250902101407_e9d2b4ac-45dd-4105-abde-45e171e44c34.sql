-- CRITICAL SECURITY FIXES Migration (v2)
-- This migration addresses multiple critical security vulnerabilities

-- 1. Remove overly permissive policies from profiles table
DROP POLICY IF EXISTS "System can create profiles" ON public.profiles;

-- 2. Create proper admin check function with fixed search_path
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 3. Replace profiles policies with secure versions
CREATE POLICY "profiles_secure_own_access" ON public.profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_secure_admin_access" ON public.profiles
  FOR SELECT USING (is_admin_secure());

-- 4. Fix search_path for existing functions to prevent security warnings
CREATE OR REPLACE FUNCTION public.is_profile_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
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
SET search_path = 'public', 'pg_temp'
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
SET search_path = 'public', 'pg_temp'
AS $$
  SELECT COALESCE(role, 'user') 
  FROM public.admin_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- 5. Clean up duplicate policies to prevent confusion
DROP POLICY IF EXISTS "User access own data" ON public.keepsakes;
DROP POLICY IF EXISTS "User access own keepsakes" ON public.keepsakes;
DROP POLICY IF EXISTS "Users can delete their own keepsakes" ON public.keepsakes;
DROP POLICY IF EXISTS "Users can insert their own keepsakes" ON public.keepsakes;
DROP POLICY IF EXISTS "Users can update their own keepsakes" ON public.keepsakes;
DROP POLICY IF EXISTS "Users can view their own keepsakes" ON public.keepsakes;

DROP POLICY IF EXISTS "User access own data" ON public.recipients;
DROP POLICY IF EXISTS "Strict keepsake ownership check" ON public.recipients;

DROP POLICY IF EXISTS "User access own data" ON public.payments;
DROP POLICY IF EXISTS "Users can manage their own payments" ON public.payments;

DROP POLICY IF EXISTS "User access own data" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart_items" ON public.cart_items;

DROP POLICY IF EXISTS "User access own data" ON public.notifications;
DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;

DROP POLICY IF EXISTS "User access own data" ON public.deliveries;
DROP POLICY IF EXISTS "Users can manage their own deliveries" ON public.deliveries;