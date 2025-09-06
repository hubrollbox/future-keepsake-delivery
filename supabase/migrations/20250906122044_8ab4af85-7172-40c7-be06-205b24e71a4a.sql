-- Fix critical security vulnerability: Secure payments table access
-- The payments table contains sensitive financial data that must be protected

-- First, ensure RLS is enabled on payments table (should already be enabled)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop any potentially insecure policies
DROP POLICY IF EXISTS "User access own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;

-- Create secure policies for payments table
-- Policy 1: Users can only view their own payment records
CREATE POLICY "payments_secure_user_read" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Users can only insert their own payment records
CREATE POLICY "payments_secure_user_insert" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can only update their own payment records
CREATE POLICY "payments_secure_user_update" 
ON public.payments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy 4: Users can only delete their own payment records
CREATE POLICY "payments_secure_user_delete" 
ON public.payments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policy 5: Admins can view all payments for support and monitoring
CREATE POLICY "payments_secure_admin_read" 
ON public.payments 
FOR SELECT 
USING (is_admin_secure());

-- Policy 6: Admins can manage all payments for administrative purposes
CREATE POLICY "payments_secure_admin_manage" 
ON public.payments 
FOR ALL 
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

-- Add security logging for payment access
CREATE OR REPLACE FUNCTION public.log_payment_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive payment data
  PERFORM public.log_security_event(
    auth.uid(),
    TG_OP,
    'payments',
    COALESCE(NEW.id::text, OLD.id::text),
    NULL,
    NULL,
    true,
    NULL,
    jsonb_build_object(
      'amount', COALESCE(NEW.amount, OLD.amount),
      'keepsake_id', COALESCE(NEW.keepsake_id, OLD.keepsake_id),
      'payment_method', COALESCE(NEW.payment_method, OLD.payment_method)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;