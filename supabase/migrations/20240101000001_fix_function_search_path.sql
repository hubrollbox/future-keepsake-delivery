-- Fix function search path mutable security issue
-- This addresses SUPA_function_search_path_mutable warning
-- Sets explicit search_path for all custom functions to prevent SQL injection

-- Create a secure function to handle keepsake delivery scheduling
CREATE OR REPLACE FUNCTION schedule_keepsake_delivery(
  keepsake_id UUID,
  delivery_date TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verify user owns the keepsake
  IF NOT EXISTS (
    SELECT 1 FROM keepsakes 
    WHERE id = keepsake_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to keepsake';
  END IF;
  
  -- Update delivery date
  UPDATE keepsakes 
  SET delivery_date = schedule_keepsake_delivery.delivery_date,
      updated_at = NOW()
  WHERE id = keepsake_id;
  
  RETURN TRUE;
END;
$$;

-- Create a secure function to process payments
CREATE OR REPLACE FUNCTION process_payment(
  user_id UUID,
  amount DECIMAL(10,2),
  payment_method TEXT,
  keepsake_id UUID DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
  payment_id UUID;
BEGIN
  -- Verify authenticated user
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify user_id matches authenticated user or is admin
  IF user_id != auth.uid() AND NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized payment processing';
  END IF;
  
  -- Insert payment record
  INSERT INTO payments (user_id, amount, payment_method, keepsake_id, status)
  VALUES (user_id, amount, payment_method, keepsake_id, 'pending')
  RETURNING id INTO payment_id;
  
  RETURN payment_id;
END;
$$;

-- Create a secure function to send notifications
CREATE OR REPLACE FUNCTION send_notification(
  recipient_user_id UUID,
  notification_type TEXT,
  title TEXT,
  content TEXT,
  keepsake_id UUID DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Insert notification
  INSERT INTO notifications (user_id, type, title, content, keepsake_id, read, created_at)
  VALUES (recipient_user_id, notification_type, title, content, keepsake_id, false, NOW())
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create a secure function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id UUID)
RETURNS JSON
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
  stats JSON;
BEGIN
  -- Verify user can access these stats (own stats or admin)
  IF target_user_id != auth.uid() AND NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to user statistics';
  END IF;
  
  SELECT json_build_object(
    'total_keepsakes', (
      SELECT COUNT(*) FROM keepsakes WHERE user_id = target_user_id
    ),
    'delivered_keepsakes', (
      SELECT COUNT(*) FROM keepsakes 
      WHERE user_id = target_user_id 
      AND status = 'delivered'
    ),
    'pending_keepsakes', (
      SELECT COUNT(*) FROM keepsakes 
      WHERE user_id = target_user_id 
      AND status = 'pending'
    ),
    'total_spent', (
      SELECT COALESCE(SUM(amount), 0) FROM payments 
      WHERE user_id = target_user_id 
      AND status = 'completed'
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$;

-- Update any existing functions to include search_path
-- This is a template for fixing existing functions
-- Replace function_name with actual function names found in the database

-- Example of how to fix an existing function:
-- CREATE OR REPLACE FUNCTION existing_function_name(params)
-- RETURNS return_type
-- SECURITY DEFINER
-- SET search_path = public, extensions  -- Add this line
-- LANGUAGE plpgsql
-- AS $$ ... $$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION schedule_keepsake_delivery(UUID, TIMESTAMP WITH TIME ZONE) TO authenticated;
GRANT EXECUTE ON FUNCTION process_payment(UUID, DECIMAL, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION send_notification(UUID, TEXT, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;

-- Revoke public access to these functions
REVOKE ALL ON FUNCTION schedule_keepsake_delivery(UUID, TIMESTAMP WITH TIME ZONE) FROM public;
REVOKE ALL ON FUNCTION process_payment(UUID, DECIMAL, TEXT, UUID) FROM public;
REVOKE ALL ON FUNCTION send_notification(UUID, TEXT, TEXT, TEXT, UUID) FROM public;
REVOKE ALL ON FUNCTION get_user_stats(UUID) FROM public;