-- Enable Row Level Security on all tables
-- This migration addresses multiple security vulnerabilities:
-- PUBLIC_USER_DATA, EXPOSED_SENSITIVE_DATA, PUBLIC_PAYMENT_DATA, 
-- EXPOSED_PERSONAL_MESSAGES, PUBLIC_NOTIFICATION_DATA

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Only authenticated users can access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS on recipients table
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;

-- Recipients: Only keepsake owner and admins can access
CREATE POLICY "Keepsake owners can view recipients" ON recipients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM keepsakes k 
      WHERE k.id = recipients.keepsake_id 
      AND k.user_id = auth.uid()
    )
    OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Keepsake owners can insert recipients" ON recipients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM keepsakes k 
      WHERE k.id = recipients.keepsake_id 
      AND k.user_id = auth.uid()
    )
  );

CREATE POLICY "Keepsake owners can update recipients" ON recipients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM keepsakes k 
      WHERE k.id = recipients.keepsake_id 
      AND k.user_id = auth.uid()
    )
  );

-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Payments: Only payment owner and authorized admins
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    user_id = auth.uid()
    OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Enable RLS on keepsakes table
ALTER TABLE keepsakes ENABLE ROW LEVEL SECURITY;

-- Keepsakes: Only message sender and authorized recipients
CREATE POLICY "Senders can view own keepsakes" ON keepsakes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Recipients can view their keepsakes" ON keepsakes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipients r 
      WHERE r.keepsake_id = keepsakes.id 
      AND r.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own keepsakes" ON keepsakes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own keepsakes" ON keepsakes
  FOR UPDATE USING (user_id = auth.uid());

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications: Only notification recipient
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true); -- Allow system to create notifications

-- Remove any existing public access policies
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON recipients;
DROP POLICY IF EXISTS "Enable read access for all users" ON payments;
DROP POLICY IF EXISTS "Enable read access for all users" ON keepsakes;
DROP POLICY IF EXISTS "Enable read access for all users" ON notifications;

-- Add admin override policies for management purposes
CREATE POLICY "Admins can manage all data" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all recipients" ON recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all keepsakes" ON keepsakes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );