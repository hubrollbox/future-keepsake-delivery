
-- Remove the dangerous public access policy for scheduled_notifications
DROP POLICY IF EXISTS "Allow read access to all" ON public.scheduled_notifications;

-- Clean up redundant RLS policies and consolidate them
-- For deliveries table
DROP POLICY IF EXISTS "Deliveries: Admin full access" ON public.deliveries;
DROP POLICY IF EXISTS "Deliveries: Only self" ON public.deliveries;
DROP POLICY IF EXISTS "Admins can do everything on deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Admins can view all deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "User can access own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can delete their own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can insert their own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can update their own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can view their own deliveries" ON public.deliveries;

-- Create consolidated policies for deliveries
CREATE POLICY "Users can manage their own deliveries" ON public.deliveries
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all deliveries" ON public.deliveries
FOR ALL USING (is_admin_user());

-- For messages table
DROP POLICY IF EXISTS "Messages: Admin full access" ON public.messages;
DROP POLICY IF EXISTS "Messages: Only self" ON public.messages;
DROP POLICY IF EXISTS "Admins can do everything on messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can manage their own messages" ON public.messages;

-- Create consolidated policies for messages
CREATE POLICY "Users can manage their own messages" ON public.messages
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all messages" ON public.messages
FOR ALL USING (is_admin_user());

-- For payments table
DROP POLICY IF EXISTS "Payments: Admin full access" ON public.payments;
DROP POLICY IF EXISTS "Payments: Only self" ON public.payments;
DROP POLICY IF EXISTS "Admins can do everything on payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can manage their own payments" ON public.payments;

-- Create consolidated policies for payments
CREATE POLICY "Users can manage their own payments" ON public.payments
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payments" ON public.payments
FOR ALL USING (is_admin_user());

-- For cart_items table
DROP POLICY IF EXISTS "CartItems: Admin full access" ON public.cart_items;
DROP POLICY IF EXISTS "CartItems: Only self" ON public.cart_items;
DROP POLICY IF EXISTS "Admins can do everything on cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart_items" ON public.cart_items;

-- Create consolidated policies for cart_items
CREATE POLICY "Users can manage their own cart_items" ON public.cart_items
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all cart_items" ON public.cart_items
FOR ALL USING (is_admin_user());

-- For notifications table
DROP POLICY IF EXISTS "Notifications: Admin full access" ON public.notifications;
DROP POLICY IF EXISTS "Notifications: Only self" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

-- Create consolidated policies for notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
FOR ALL USING (is_admin_user());

-- For scheduled_notifications table
DROP POLICY IF EXISTS "ScheduledNotifications: Admin full access" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "ScheduledNotifications: Only self" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "Users can view their own scheduled notifications" ON public.scheduled_notifications;

-- Create secure policies for scheduled_notifications
CREATE POLICY "Users can view their own scheduled notifications" ON public.scheduled_notifications
FOR SELECT USING (auth.email() = user_email);

DROP POLICY IF EXISTS "Admins can manage all scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "Admins can manage all scheduled notifications" ON public.scheduled_notifications
FOR ALL USING (is_admin_user());

-- For user_achievements table
DROP POLICY IF EXISTS "UserAchievements: Admin full access" ON public.user_achievements;
DROP POLICY IF EXISTS "UserAchievements: Only self" ON public.user_achievements;
DROP POLICY IF EXISTS "User can access own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;

-- Create consolidated policies for user_achievements
CREATE POLICY "Users can manage their own achievements" ON public.user_achievements
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all achievements" ON public.user_achievements
FOR ALL USING (is_admin_user());

-- For user_quests table
DROP POLICY IF EXISTS "UserQuests: Admin full access" ON public.user_quests;
DROP POLICY IF EXISTS "UserQuests: Only self" ON public.user_quests;
DROP POLICY IF EXISTS "User can access own quests" ON public.user_quests;
DROP POLICY IF EXISTS "Users can update their own quests" ON public.user_quests;
DROP POLICY IF EXISTS "Users can view their own quests" ON public.user_quests;

-- Create consolidated policies for user_quests
CREATE POLICY "Users can manage their own quests" ON public.user_quests
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all quests" ON public.user_quests
FOR ALL USING (is_admin_user());

-- For user_stats table
DROP POLICY IF EXISTS "UserStats: Admin full access" ON public.user_stats;
DROP POLICY IF EXISTS "UserStats: Only self" ON public.user_stats;
DROP POLICY IF EXISTS "User can access own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;

-- Create consolidated policies for user_stats
CREATE POLICY "Users can manage their own stats" ON public.user_stats
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all stats" ON public.user_stats
FOR ALL USING (is_admin_user());

-- Update the security definer functions to be more robust
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

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp;
AS $$
  SELECT COALESCE(role, 'user') 
  FROM public.admin_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;
