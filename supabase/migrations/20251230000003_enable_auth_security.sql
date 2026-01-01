-- Enable authentication security features
-- This addresses SUPA_auth_leaked_password_protection warning
-- and implements additional auth security measures

-- Enable leaked password protection
-- This requires Supabase CLI or dashboard configuration
-- The following are SQL equivalents where possible

-- Create a function to validate password strength
CREATE OR REPLACE FUNCTION validate_password_strength(password TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check minimum length (8 characters)
  IF LENGTH(password) < 8 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN FALSE;
  END IF;
  
  -- Check for at least one lowercase letter
  IF password !~ '[a-z]' THEN
    RETURN FALSE;
  END IF;
  
  -- Check for at least one digit
  IF password !~ '[0-9]' THEN
    RETURN FALSE;
  END IF;
  
  -- Check for at least one special character
  IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RETURN FALSE;
  END IF;
  
  -- Check for common weak passwords
  IF LOWER(password) IN (
    'password', 'password123', '123456789', 'qwerty123',
    'admin123', 'welcome123', 'letmein123', 'monkey123'
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Create a trigger function to validate passwords on user creation/update
CREATE OR REPLACE FUNCTION check_password_on_user_create()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function would be called by Supabase Auth
  -- but we can't directly hook into auth.users table
  -- This is more for documentation of the intended behavior
  RETURN NEW;
END;
$$;

-- Create a function to log failed login attempts
CREATE OR REPLACE FUNCTION log_failed_login_attempt(
  user_email TEXT,
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS VOID
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create failed_login_attempts table if it doesn't exist
  CREATE TABLE IF NOT EXISTS failed_login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Enable RLS on the table
  ALTER TABLE failed_login_attempts ENABLE ROW LEVEL SECURITY;
  
  -- Only admins can view failed login attempts
  DROP POLICY IF EXISTS "Admins can view failed login attempts" ON failed_login_attempts;
  CREATE POLICY "Admins can view failed login attempts" ON failed_login_attempts
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role = 'admin'
      )
    );
  
  -- Insert the failed attempt
  INSERT INTO failed_login_attempts (email, ip_address, user_agent)
  VALUES (user_email, ip_address, user_agent);
END;
$$;

-- Create a function to check for suspicious login patterns
CREATE OR REPLACE FUNCTION check_suspicious_login_activity(
  user_email TEXT,
  ip_address INET DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
  recent_failures INTEGER;
  different_ips INTEGER;
BEGIN
  -- Check if failed_login_attempts table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'failed_login_attempts'
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Count recent failed attempts (last 15 minutes)
  SELECT COUNT(*) INTO recent_failures
  FROM failed_login_attempts
  WHERE email = user_email
    AND attempted_at > NOW() - INTERVAL '15 minutes';
  
  -- Count different IP addresses in last hour
  SELECT COUNT(DISTINCT ip_address) INTO different_ips
  FROM failed_login_attempts
  WHERE email = user_email
    AND attempted_at > NOW() - INTERVAL '1 hour'
    AND ip_address IS NOT NULL;
  
  -- Return true if suspicious activity detected
  RETURN (recent_failures >= 5 OR different_ips >= 3);
END;
$$;

-- Create a function to clean up old failed login attempts
CREATE OR REPLACE FUNCTION cleanup_old_failed_attempts()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'failed_login_attempts'
  ) THEN
    RETURN 0;
  END IF;
  
  -- Delete attempts older than 30 days
  DELETE FROM failed_login_attempts
  WHERE attempted_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION validate_password_strength(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION log_failed_login_attempt(TEXT, INET, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_suspicious_login_activity(TEXT, INET) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_failed_attempts() TO authenticated;

-- Create a scheduled job to clean up old failed attempts (if pg_cron is available)
-- This would typically be done through Supabase dashboard or CLI
-- SELECT cron.schedule('cleanup-failed-attempts', '0 2 * * *', 'SELECT cleanup_old_failed_attempts();');

-- Note: The following settings need to be configured through Supabase Dashboard or CLI:
-- 1. Enable "Leaked Password Protection" in Auth settings
-- 2. Set minimum password length to 8
-- 3. Enable "Strong Password" requirements
-- 4. Configure rate limiting for auth endpoints
-- 5. Enable email confirmation
-- 6. Set session timeout appropriately

-- Create a configuration table for auth settings documentation
CREATE TABLE IF NOT EXISTS auth_security_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  requires_dashboard_config BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on auth config
ALTER TABLE auth_security_config ENABLE ROW LEVEL SECURITY;

-- Only admins can manage auth config
CREATE POLICY "Admins can manage auth config" ON auth_security_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- Insert recommended security settings
INSERT INTO auth_security_config (setting_name, setting_value, description, requires_dashboard_config)
VALUES 
  ('leaked_password_protection', 'enabled', 'Prevents users from using passwords found in data breaches', true),
  ('minimum_password_length', '8', 'Minimum required password length', true),
  ('strong_password_policy', 'enabled', 'Requires uppercase, lowercase, number, and special character', true),
  ('email_confirmation', 'enabled', 'Requires email verification before account activation', true),
  ('session_timeout', '24h', 'Maximum session duration before re-authentication required', true),
  ('rate_limiting', 'enabled', 'Limits authentication attempts to prevent brute force attacks', true),
  ('two_factor_auth', 'available', 'Two-factor authentication support for enhanced security', true)
ON CONFLICT (setting_name) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = NOW();