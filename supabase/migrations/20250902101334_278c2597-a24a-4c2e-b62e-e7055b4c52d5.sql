-- CRITICAL SECURITY FIXES Migration
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

-- 4. Ensure all other tables have proper RLS (no public access)
-- Remove any overly permissive policies and ensure user-only access

-- Fix keepsakes policies (ensure no public access)
DROP POLICY IF EXISTS "Select own keepsakes" ON public.keepsakes;
CREATE POLICY "keepsakes_secure_user_access" ON public.keepsakes
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "keepsakes_secure_admin_access" ON public.keepsakes
  FOR ALL USING (is_admin_secure());

-- Fix recipients policies (ensure no public access) 
DROP POLICY IF EXISTS "Users can view recipients of their keepsakes" ON public.recipients;
DROP POLICY IF EXISTS "Users can manage recipients for their keepsakes" ON public.recipients;
DROP POLICY IF EXISTS "Users can insert recipients for their keepsakes" ON public.recipients;
CREATE POLICY "recipients_secure_keepsake_owner_access" ON public.recipients
  FOR ALL USING (
    is_admin_secure() OR 
    EXISTS (
      SELECT 1 FROM public.keepsakes 
      WHERE keepsakes.id = recipients.keepsake_id 
      AND keepsakes.user_id = auth.uid()
    )
  )
  WITH CHECK (
    is_admin_secure() OR 
    EXISTS (
      SELECT 1 FROM public.keepsakes 
      WHERE keepsakes.id = recipients.keepsake_id 
      AND keepsakes.user_id = auth.uid()
    )
  );

-- Fix payments policies (ensure no public access)
DROP POLICY IF EXISTS "User access own payments" ON public.payments;
CREATE POLICY "payments_secure_user_access" ON public.payments
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "payments_secure_admin_access" ON public.payments
  FOR ALL USING (is_admin_secure());

-- Fix cart_items policies (ensure no public access)
DROP POLICY IF EXISTS "User access own cart items" ON public.cart_items;
CREATE POLICY "cart_items_secure_user_access" ON public.cart_items
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cart_items_secure_admin_access" ON public.cart_items
  FOR ALL USING (is_admin_secure());

-- Fix notifications policies (ensure no public access)
DROP POLICY IF EXISTS "User access own notifications" ON public.notifications;
CREATE POLICY "notifications_secure_user_access" ON public.notifications
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_secure_admin_access" ON public.notifications
  FOR ALL USING (is_admin_secure());

-- Fix deliveries policies (ensure no public access)
DROP POLICY IF EXISTS "User access own deliveries" ON public.deliveries;
CREATE POLICY "deliveries_secure_user_access" ON public.deliveries
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "deliveries_secure_admin_access" ON public.deliveries
  FOR ALL USING (is_admin_secure());

-- Fix user_sessions policies (ensure no public access)
CREATE POLICY "user_sessions_secure_user_access" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_sessions_secure_admin_access" ON public.user_sessions
  FOR ALL USING (is_admin_secure());

-- 5. Attach missing security triggers to recipients table
CREATE TRIGGER validate_recipient_data_trigger
  BEFORE INSERT OR UPDATE ON public.recipients
  FOR EACH ROW EXECUTE FUNCTION public.validate_recipient_data();

CREATE TRIGGER log_recipient_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.recipients
  FOR EACH ROW EXECUTE FUNCTION public.log_recipient_access();

-- 6. Fix search_path for existing functions
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

-- 7. Remove duplicate policies (clean up)
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