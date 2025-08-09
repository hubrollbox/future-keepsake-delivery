
-- Phase 1: Critical RLS Policy and Schema Fixes

-- First, make user_id columns NOT NULL where RLS depends on them
ALTER TABLE public.keepsakes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.notifications ALTER COLUMN user_id SET NOT NULL;

-- Clean up duplicate and conflicting RLS policies
-- Remove old duplicate policies first
DROP POLICY IF EXISTS "Deliveries: Admin full access" ON public.deliveries;
DROP POLICY IF EXISTS "Deliveries: Only self" ON public.deliveries;
DROP POLICY IF EXISTS "Messages: Admin full access" ON public.messages;
DROP POLICY IF EXISTS "Messages: Only self" ON public.messages;
DROP POLICY IF EXISTS "Payments: Admin full access" ON public.payments;
DROP POLICY IF EXISTS "Payments: Only self" ON public.payments;
DROP POLICY IF EXISTS "CartItems: Admin full access" ON public.cart_items;
DROP POLICY IF EXISTS "CartItems: Only self" ON public.cart_items;
DROP POLICY IF EXISTS "Notifications: Admin full access" ON public.notifications;
DROP POLICY IF EXISTS "Notifications: Only self" ON public.notifications;
DROP POLICY IF EXISTS "UserAchievements: Admin full access" ON public.user_achievements;
DROP POLICY IF EXISTS "UserAchievements: Only self" ON public.user_achievements;
DROP POLICY IF EXISTS "UserQuests: Admin full access" ON public.user_quests;
DROP POLICY IF EXISTS "UserQuests: Only self" ON public.user_quests;
DROP POLICY IF EXISTS "UserStats: Admin full access" ON public.user_stats;
DROP POLICY IF EXISTS "UserStats: Only self" ON public.user_stats;

-- Remove the dangerous public access policy
DROP POLICY IF EXISTS "Allow read access to all" ON public.scheduled_notifications;

-- Add missing comprehensive RLS policies for recipients table
DROP POLICY IF EXISTS "Users can manage recipients for their keepsakes" ON public.recipients;
CREATE POLICY "Users can manage recipients for their keepsakes" ON public.recipients
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = recipients.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can manage all recipients" ON public.recipients;
CREATE POLICY "Admins can manage all recipients" ON public.recipients
FOR ALL USING (is_admin_user());

-- Add missing comprehensive RLS policies for keepsake_products table
DROP POLICY IF EXISTS "Users can manage products for their keepsakes" ON public.keepsake_products;
CREATE POLICY "Users can manage products for their keepsakes" ON public.keepsake_products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = keepsake_products.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);

-- Add data integrity constraints
ALTER TABLE public.keepsakes DROP CONSTRAINT IF EXISTS keepsakes_delivery_date_check;
ALTER TABLE public.keepsakes ADD CONSTRAINT keepsakes_delivery_date_check 
CHECK (delivery_date >= CURRENT_DATE);

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_delivery_date_check;
ALTER TABLE public.messages ADD CONSTRAINT messages_delivery_date_check 
CHECK (delivery_date >= CURRENT_TIMESTAMP);

ALTER TABLE public.deliveries DROP CONSTRAINT IF EXISTS deliveries_delivery_date_check;
ALTER TABLE public.deliveries ADD CONSTRAINT deliveries_delivery_date_check 
CHECK (delivery_date >= CURRENT_TIMESTAMP) NOT VALID;

-- Add constraint to ensure positive amounts
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_amount_positive;
ALTER TABLE public.payments ADD CONSTRAINT payments_amount_positive 
CHECK (amount > 0);

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_price_positive;
ALTER TABLE public.products ADD CONSTRAINT products_price_positive 
CHECK (price >= 0);

-- Ensure email format validation at database level
ALTER TABLE public.recipients DROP CONSTRAINT IF EXISTS recipients_email_format;
ALTER TABLE public.recipients ADD CONSTRAINT recipients_email_format 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create indexes for better performance on security-critical queries
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_keepsakes_user_id ON public.keepsakes(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_user_id ON public.deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Update the security definer function to be more robust
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;
