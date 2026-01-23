-- =====================================================
-- Security Fix: Storage Policy + Missing RPC Function
-- =====================================================

-- ISSUE 1: Fix overpermissive digital-files storage policy
-- Current policy allows ANY authenticated user to read ALL files
-- Fixed policy restricts reads to file owner via path-based check

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "digital_files_user_read" ON storage.objects;

-- Create secure policy: user can only read files in their own folder
-- Files must be stored as: {user_id}/filename
CREATE POLICY "digital_files_user_read"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'digital-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Also fix UPDATE and DELETE policies to be owner-scoped
DROP POLICY IF EXISTS "digital_files_user_update" ON storage.objects;
DROP POLICY IF EXISTS "digital_files_user_delete" ON storage.objects;

CREATE POLICY "digital_files_user_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'digital-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "digital_files_user_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'digital-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Ensure INSERT policy is also properly scoped
DROP POLICY IF EXISTS "digital_files_user_insert" ON storage.objects;

CREATE POLICY "digital_files_user_insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'digital-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- ISSUE 2: Add bonus_keepsakes column to profiles
-- =====================================================

-- Add column to track bonus keepsakes awarded through referrals
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bonus_keepsakes INTEGER NOT NULL DEFAULT 0;

-- =====================================================
-- ISSUE 3: Create missing add_bonus_keepsakes RPC function
-- =====================================================

CREATE OR REPLACE FUNCTION public.add_bonus_keepsakes(
  p_user_id uuid,
  p_bonus_amount integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  v_new_total INTEGER;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User ID is required');
  END IF;
  
  IF p_bonus_amount IS NULL OR p_bonus_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Bonus amount must be positive');
  END IF;
  
  -- Update the user's bonus keepsakes count
  UPDATE public.profiles
  SET 
    bonus_keepsakes = COALESCE(bonus_keepsakes, 0) + p_bonus_amount,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING bonus_keepsakes INTO v_new_total;
  
  -- Check if user was found
  IF v_new_total IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found');
  END IF;
  
  -- Log the security event for audit
  PERFORM public.log_security_event(
    p_user_id,
    'bonus_keepsakes_awarded',
    'profiles',
    p_user_id::text,
    NULL,
    NULL,
    true,
    NULL,
    jsonb_build_object('bonus_amount', p_bonus_amount, 'new_total', v_new_total)
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'bonus_added', p_bonus_amount,
    'new_total', v_new_total,
    'message', 'Bonus keepsakes awarded successfully'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.add_bonus_keepsakes(uuid, integer) TO authenticated;