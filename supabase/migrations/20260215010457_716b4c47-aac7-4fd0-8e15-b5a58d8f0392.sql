
-- Fix add_bonus_keepsakes: Add admin-only authorization check
CREATE OR REPLACE FUNCTION public.add_bonus_keepsakes(p_user_id uuid, p_bonus_amount integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_new_total INTEGER;
BEGIN
  -- SECURITY: Only admins can award bonus keepsakes
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Validate inputs
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User ID is required');
  END IF;
  
  IF p_bonus_amount IS NULL OR p_bonus_amount <= 0 OR p_bonus_amount > 100 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Bonus amount must be between 1 and 100');
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
    jsonb_build_object('bonus_amount', p_bonus_amount, 'new_total', v_new_total, 'awarded_by', auth.uid())
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'bonus_added', p_bonus_amount,
    'new_total', v_new_total,
    'message', 'Bonus keepsakes awarded successfully'
  );
END;
$function$;
