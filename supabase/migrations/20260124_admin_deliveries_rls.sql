-- =====================================================
-- Fix Admin Access to Deliveries and Messages (20260124)
-- =====================================================
-- Issue: Admins couldn't see deliveries or messages in the admin dashboard
-- Cause: RLS policies were blocking access to authenticated users who aren't the delivery owner
-- Solution: Add admin-scoped RLS policies that allow admins to view ALL deliveries

-- Ensure is_admin_secure function exists (created in earlier migration)
-- This function checks if current user has admin role in admin_roles table

-- =====================================================
-- 1. Fix Deliveries Table RLS Policies
-- =====================================================

-- Ensure RLS is enabled on deliveries table
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- Drop existing overly restrictive policies if they exist
DROP POLICY IF EXISTS "deliveries_select_own" ON public.deliveries;
DROP POLICY IF EXISTS "deliveries_insert_own" ON public.deliveries;
DROP POLICY IF EXISTS "deliveries_update_own" ON public.deliveries;
DROP POLICY IF EXISTS "deliveries_delete_own" ON public.deliveries;
DROP POLICY IF EXISTS "deliveries_select_policy" ON public.deliveries;
DROP POLICY IF EXISTS "deliveries_insert_policy" ON public.deliveries;
DROP POLICY IF EXISTS "deliveries_update_policy" ON public.deliveries;
DROP POLICY IF EXISTS "deliveries_delete_policy" ON public.deliveries;

-- SELECT: Users see own deliveries, admins see ALL deliveries
CREATE POLICY "deliveries_read"
ON public.deliveries FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.is_admin_secure()
);

-- INSERT: Users can create their own deliveries, admins can create for anyone
CREATE POLICY "deliveries_write"
ON public.deliveries FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  OR public.is_admin_secure()
);

-- UPDATE: Users can update own deliveries, admins can update any
CREATE POLICY "deliveries_modify"
ON public.deliveries FOR UPDATE
USING (
  auth.uid() = user_id 
  OR public.is_admin_secure()
)
WITH CHECK (
  auth.uid() = user_id 
  OR public.is_admin_secure()
);

-- DELETE: Users can delete own deliveries, admins can delete any
CREATE POLICY "deliveries_remove"
ON public.deliveries FOR DELETE
USING (
  auth.uid() = user_id 
  OR public.is_admin_secure()
);

-- =====================================================
-- 2. Create Admin Helper Function for Deliveries
-- =====================================================

-- This RPC function allows admins to fetch ALL deliveries without RLS filtering
CREATE OR REPLACE FUNCTION public.admin_get_deliveries(
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  type TEXT,
  status TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  keepsake_id UUID,
  location TEXT,
  payment_status TEXT,
  digital_file_url TEXT,
  recipient_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT
    d.id,
    d.user_id,
    d.title,
    d.description,
    d.type,
    d.status,
    d.delivery_date,
    d.created_at,
    d.updated_at,
    d.keepsake_id,
    d.location,
    d.payment_status,
    d.digital_file_url,
    d.recipient_id
  FROM public.deliveries d
  ORDER BY d.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- =====================================================
-- 3. Create Admin Helper Function for Messages Count
-- =====================================================

CREATE OR REPLACE FUNCTION public.admin_get_messages_count()
RETURNS TABLE(total_messages BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT COUNT(*) FROM public.deliveries;
END;
$$;

-- Document the functions
COMMENT ON FUNCTION public.admin_get_deliveries(INT, INT) IS
'Admin-only RPC function to fetch all deliveries. Requires admin role verification via is_admin_secure().';

COMMENT ON FUNCTION public.admin_get_messages_count() IS
'Admin-only RPC function to get total count of all messages/deliveries. Requires admin role.';

COMMENT ON POLICY "deliveries_read" ON public.deliveries IS 
'Users can view their own deliveries. Admins verified by is_admin_secure() can view all.';

COMMENT ON POLICY "deliveries_write" ON public.deliveries IS 
'Users can create their own deliveries. Admins can create for any user.';

COMMENT ON POLICY "deliveries_modify" ON public.deliveries IS 
'Users can update their own deliveries. Admins can update any delivery.';

COMMENT ON POLICY "deliveries_remove" ON public.deliveries IS 
'Users can delete their own deliveries. Admins can delete any delivery.';
