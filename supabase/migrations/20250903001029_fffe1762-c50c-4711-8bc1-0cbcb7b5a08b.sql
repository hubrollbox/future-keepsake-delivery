-- Enhanced Recipients Security Policies
-- This migration strengthens security for recipient contact information

-- Drop and recreate all recipients policies with enhanced security
DROP POLICY IF EXISTS "Admins can manage all recipients" ON public.recipients;
DROP POLICY IF EXISTS "Users can insert recipients for their keepsakes" ON public.recipients;
DROP POLICY IF EXISTS "Users can manage recipients for their keepsakes" ON public.recipients;
DROP POLICY IF EXISTS "Users can view recipients of their keepsakes" ON public.recipients;

-- Create enhanced policies with better access control
CREATE POLICY "recipients_secure_admin_access"
ON public.recipients
FOR ALL
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

CREATE POLICY "recipients_secure_user_access"
ON public.recipients
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = recipients.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = recipients.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);

-- Add access logging trigger to recipients table for security monitoring
CREATE TRIGGER recipients_access_log_trigger
AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.recipients
FOR EACH ROW EXECUTE FUNCTION public.log_recipient_access();

-- Add data validation trigger to recipients table 
CREATE TRIGGER recipients_validation_trigger
BEFORE INSERT OR UPDATE ON public.recipients
FOR EACH ROW EXECUTE FUNCTION public.validate_recipient_data();

-- Create secure function to get recipient count for admins
CREATE OR REPLACE FUNCTION public.get_recipient_stats_secure()
RETURNS TABLE(total_recipients bigint, recent_recipients bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Only allow admins to access recipient statistics
  IF NOT is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_recipients,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_recipients
  FROM public.recipients;
END;
$$;