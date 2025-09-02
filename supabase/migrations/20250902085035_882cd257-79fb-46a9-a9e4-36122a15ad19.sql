-- Additional security hardening for recipients table
-- Add audit logging for sensitive data access

-- Create function to log recipient access
CREATE OR REPLACE FUNCTION log_recipient_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Log access to sensitive recipient data
  PERFORM log_security_event(
    auth.uid(),
    TG_OP,
    'recipients',
    COALESCE(NEW.id::text, OLD.id::text),
    NULL,
    NULL,
    true,
    NULL,
    jsonb_build_object(
      'recipient_name', COALESCE(NEW.name, OLD.name),
      'keepsake_id', COALESCE(NEW.keepsake_id, OLD.keepsake_id)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for recipient access logging
DROP TRIGGER IF EXISTS audit_recipient_changes ON recipients;
CREATE TRIGGER audit_recipient_changes
  AFTER INSERT OR UPDATE OR DELETE ON recipients
  FOR EACH ROW
  EXECUTE FUNCTION log_recipient_access();

-- Add additional data validation function
CREATE OR REPLACE FUNCTION validate_recipient_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Validate email format
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format for recipient';
  END IF;
  
  -- Validate phone format (basic validation)
  IF NEW.phone IS NOT NULL AND LENGTH(NEW.phone) > 0 AND NEW.phone !~ '^[\+]?[0-9\s\-\(\)]{7,20}$' THEN
    RAISE EXCEPTION 'Invalid phone format for recipient';
  END IF;
  
  -- Ensure required fields
  IF NEW.name IS NULL OR LENGTH(trim(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Recipient name is required';
  END IF;
  
  -- Sanitize name (remove potentially dangerous characters)
  NEW.name = regexp_replace(NEW.name, '[<>\"''&]', '', 'g');
  
  RETURN NEW;
END;
$$;

-- Create trigger for data validation
DROP TRIGGER IF EXISTS validate_recipient_data_trigger ON recipients;
CREATE TRIGGER validate_recipient_data_trigger
  BEFORE INSERT OR UPDATE ON recipients
  FOR EACH ROW
  EXECUTE FUNCTION validate_recipient_data();

-- Add policy to ensure keepsake ownership on INSERT/UPDATE
DROP POLICY IF EXISTS "Strict keepsake ownership check" ON recipients;
CREATE POLICY "Strict keepsake ownership check" 
ON recipients 
FOR ALL
USING (
  -- Allow if admin
  is_admin_user() OR
  -- Allow if user owns the keepsake
  EXISTS (
    SELECT 1 FROM keepsakes 
    WHERE keepsakes.id = recipients.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
)
WITH CHECK (
  -- Allow if admin
  is_admin_user() OR
  -- Allow if user owns the keepsake
  EXISTS (
    SELECT 1 FROM keepsakes 
    WHERE keepsakes.id = recipients.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);