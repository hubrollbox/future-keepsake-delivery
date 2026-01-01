-- Fix critical security vulnerabilities in RLS policies
-- Remove any dangerous public access policies

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop any existing dangerous policies
DROP POLICY IF EXISTS "System can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow read access to all" ON public.profiles;
DROP POLICY IF EXISTS "Public read access" ON public.recipients;
DROP POLICY IF EXISTS "Public read access" ON public.payments;

-- SECURE PROFILES TABLE POLICIES
-- Remove all existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create secure policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admin access to profiles (only for authenticated admins)
CREATE POLICY "profiles_admin_access" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- SECURE RECIPIENTS TABLE POLICIES
-- Remove all existing policies
DROP POLICY IF EXISTS "Users can only see their own recipients" ON public.recipients;
DROP POLICY IF EXISTS "Users can manage recipients for their keepsakes" ON public.recipients;
DROP POLICY IF EXISTS "Admins can manage all recipients" ON public.recipients;

-- Create secure policies for recipients (only keepsake owners can access)
CREATE POLICY "recipients_keepsake_owner_only" ON public.recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.keepsakes 
      WHERE keepsakes.id = recipients.keepsake_id 
      AND keepsakes.user_id = auth.uid()
    )
  );

-- Admin access to recipients
CREATE POLICY "recipients_admin_access" ON public.recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- SECURE PAYMENTS TABLE POLICIES
-- Remove all existing policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can manage their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;

-- Create secure policies for payments (users can only see their own)
CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "payments_insert_own" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users cannot update or delete payments for security
-- Only system/admin can update payment status
CREATE POLICY "payments_admin_manage" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add additional security constraints
-- Ensure user_id cannot be NULL for security-critical tables
ALTER TABLE public.profiles ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.payments ALTER COLUMN user_id SET NOT NULL;

-- Add check constraints for data integrity
ALTER TABLE public.payments 
ADD CONSTRAINT payments_amount_positive CHECK (amount > 0);

ALTER TABLE public.payments 
ADD CONSTRAINT payments_status_valid CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));

-- Create audit function for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive data
  INSERT INTO public.audit_log (table_name, operation, user_id, timestamp)
  VALUES (TG_TABLE_NAME, TG_OP, auth.uid(), NOW());
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audit_log (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "audit_log_admin_only" ON public.audit_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

CREATE TRIGGER audit_payments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

CREATE TRIGGER audit_recipients_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.recipients
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();