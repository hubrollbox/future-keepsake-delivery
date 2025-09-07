-- Global RLS hardening for FuturoPresente (public schema)
-- Goal: consistent, minimal, secure access. Users only access own data; admins via is_admin_secure(); no anonymous access.

-- Helper: ensure RLS enabled on all relevant tables
ALTER TABLE IF EXISTS public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.api_request_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.keepsake_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.keepsake_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.keepsakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.warehouse_items ENABLE ROW LEVEL SECURITY;

-- ACHIEVEMENTS (public read, admin manage)
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
DROP POLICY IF EXISTS "Public read access to achievements" ON public.achievements;
CREATE POLICY "achievements_public_read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "achievements_admin_manage" ON public.achievements FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- ADMIN ROLES (admin manage, user read own)
DROP POLICY IF EXISTS "Admins can delete admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can insert admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can manage admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Users can view their own admin role" ON public.admin_roles;
DROP POLICY IF EXISTS "Users can view their own admin status" ON public.admin_roles;
CREATE POLICY "admin_roles_user_read_own" ON public.admin_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admin_roles_admin_manage" ON public.admin_roles FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- API RATE LIMITS (service only)
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.api_rate_limits;
CREATE POLICY "api_rate_limits_service_only" ON public.api_rate_limits FOR ALL USING (false) WITH CHECK (false);

-- API REQUEST LOG (service only)
DROP POLICY IF EXISTS "api_request_log_service_only" ON public.api_request_log;
CREATE POLICY "api_request_log_service_only" ON public.api_request_log FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- CART ITEMS (user owns, admin manage)
DROP POLICY IF EXISTS "Admins can manage all cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "User access own cart items" ON public.cart_items;
CREATE POLICY "cart_items_user_all" ON public.cart_items FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "cart_items_admin_manage" ON public.cart_items FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- DELIVERIES (user owns, admin manage)
DROP POLICY IF EXISTS "Admins can manage all deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Permitir user apagar suas entregas" ON public.deliveries;
DROP POLICY IF EXISTS "Permitir user atualizar suas entregas" ON public.deliveries;
DROP POLICY IF EXISTS "Permitir user criar suas entregas" ON public.deliveries;
DROP POLICY IF EXISTS "Permitir user ver suas entregas" ON public.deliveries;
DROP POLICY IF EXISTS "User access own deliveries" ON public.deliveries;
CREATE POLICY "deliveries_user_all" ON public.deliveries FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "deliveries_admin_manage" ON public.deliveries FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- EXTRAS (public read)
DROP POLICY IF EXISTS "Read extras" ON public.extras;
CREATE POLICY "extras_public_read" ON public.extras FOR SELECT USING (true);

-- KEEPSAKE_EXTRAS (owner via keepsakes)
DROP POLICY IF EXISTS "User owns keepsake extra" ON public.keepsake_extras;
CREATE POLICY "keepsake_extras_user_all" ON public.keepsake_extras FOR ALL USING (
  EXISTS (SELECT 1 FROM public.keepsakes k WHERE k.id = keepsake_id AND k.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.keepsakes k WHERE k.id = keepsake_id AND k.user_id = auth.uid())
);

-- KEEPSAKE_PRODUCTS (owner via keepsakes, admin manage)
DROP POLICY IF EXISTS "Admins can manage all keepsake_products" ON public.keepsake_products;
DROP POLICY IF EXISTS "Users can insert products for their keepsakes" ON public.keepsake_products;
DROP POLICY IF EXISTS "Users can manage products for their keepsakes" ON public.keepsake_products;
DROP POLICY IF EXISTS "Users can view products of their keepsakes" ON public.keepsake_products;
CREATE POLICY "keepsake_products_user_all" ON public.keepsake_products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.keepsakes k WHERE k.id = keepsake_id AND k.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.keepsakes k WHERE k.id = keepsake_id AND k.user_id = auth.uid())
);
CREATE POLICY "keepsake_products_admin_manage" ON public.keepsake_products FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- KEEPSAKES (user owns)
DROP POLICY IF EXISTS "Delete own keepsakes" ON public.keepsakes;
DROP POLICY IF EXISTS "Insert own keepsakes" ON public.keepsakes;
DROP POLICY IF EXISTS "Select own keepsakes" ON public.keepsakes;
DROP POLICY IF EXISTS "Update own keepsakes" ON public.keepsakes;
CREATE POLICY "keepsakes_user_all" ON public.keepsakes FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "keepsakes_admin_manage" ON public.keepsakes FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- NOTIFICATIONS (user owns, admin manage)
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
DROP POLICY IF EXISTS "User access own notifications" ON public.notifications;
CREATE POLICY "notifications_user_all" ON public.notifications FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_admin_manage" ON public.notifications FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- PAYMENTS (user owns, admin manage) — keep hardened version
DROP POLICY IF EXISTS "payments_secure_user_read" ON public.payments;
DROP POLICY IF EXISTS "payments_secure_user_insert" ON public.payments;
DROP POLICY IF EXISTS "payments_secure_user_update" ON public.payments;
DROP POLICY IF EXISTS "payments_secure_user_delete" ON public.payments;
DROP POLICY IF EXISTS "payments_secure_admin_read" ON public.payments;
DROP POLICY IF EXISTS "payments_secure_admin_manage" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
DROP POLICY IF EXISTS "User access own payments" ON public.payments;
CREATE POLICY "payments_user_read" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_user_insert" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payments_user_update" ON public.payments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payments_user_delete" ON public.payments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "payments_admin_read" ON public.payments FOR SELECT USING (is_admin_secure());
CREATE POLICY "payments_admin_manage" ON public.payments FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- PLANS (public read)
DROP POLICY IF EXISTS "Read plans" ON public.plans;
CREATE POLICY "plans_public_read" ON public.plans FOR SELECT USING (true);

-- PRODUCTS (public read active, admin manage)
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "products_public_read_active_only" ON public.products;
CREATE POLICY "products_public_read_active" ON public.products FOR SELECT USING ((active = true) AND (stock > 0));
CREATE POLICY "products_admin_manage" ON public.products FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- PROFILES (user owns, admin read/manage secure)
DROP POLICY IF EXISTS "profiles_user_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_read_secure" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_manage_secure" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_secure_admin_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_secure_own_access" ON public.profiles;
CREATE POLICY "profiles_user_read_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_user_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_user_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_user_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_read" ON public.profiles FOR SELECT USING (is_admin_secure() AND auth.uid() IS NOT NULL AND auth.role() = 'authenticated');
CREATE POLICY "profiles_admin_manage" ON public.profiles FOR ALL USING (is_admin_secure() AND auth.uid() IS NOT NULL AND auth.role() = 'authenticated') WITH CHECK (is_admin_secure() AND auth.uid() IS NOT NULL AND auth.role() = 'authenticated');

-- QUESTS (public read, admin manage)
DROP POLICY IF EXISTS "Admins can manage quests" ON public.quests;
DROP POLICY IF EXISTS "Anyone can view quests" ON public.quests;
DROP POLICY IF EXISTS "Public read access to quests" ON public.quests;
CREATE POLICY "quests_public_read" ON public.quests FOR SELECT USING (true);
CREATE POLICY "quests_admin_manage" ON public.quests FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- RATE LIMIT TRACKING (service only)
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limit_tracking;
CREATE POLICY "rate_limit_tracking_service_only" ON public.rate_limit_tracking FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- RECIPIENTS (owner via keepsakes, admin manage)
DROP POLICY IF EXISTS "recipients_secure_admin_access" ON public.recipients;
DROP POLICY IF EXISTS "recipients_secure_user_access" ON public.recipients;
CREATE POLICY "recipients_user_all" ON public.recipients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.keepsakes k WHERE k.id = keepsake_id AND k.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.keepsakes k WHERE k.id = keepsake_id AND k.user_id = auth.uid())
);
CREATE POLICY "recipients_admin_manage" ON public.recipients FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- SCHEDULED NOTIFICATIONS (user read via keepsakes, admin manage)
DROP POLICY IF EXISTS "Admins can manage all scheduled notifications" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "scheduled_notifications_secure_user_access" ON public.scheduled_notifications;
CREATE POLICY "scheduled_notifications_user_read" ON public.scheduled_notifications FOR SELECT USING (
  is_admin_secure() OR EXISTS (SELECT 1 FROM public.keepsakes k WHERE k.id = scheduled_notifications.keepsake_id AND k.user_id = auth.uid())
);
CREATE POLICY "scheduled_notifications_admin_manage" ON public.scheduled_notifications FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- SECURITY AUDIT LOG (admin read, service insert)
DROP POLICY IF EXISTS "security_audit_log_admin_read" ON public.security_audit_log;
DROP POLICY IF EXISTS "security_audit_log_service_insert" ON public.security_audit_log;
CREATE POLICY "security_audit_log_admin_read" ON public.security_audit_log FOR SELECT USING (is_admin_secure());
CREATE POLICY "security_audit_log_service_insert" ON public.security_audit_log FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- SUBSCRIPTIONS (user owns)
DROP POLICY IF EXISTS "User owns subscription" ON public.subscriptions;
CREATE POLICY "subscriptions_user_all" ON public.subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_admin_manage" ON public.subscriptions FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- USER ACHIEVEMENTS (user owns, admin manage)
DROP POLICY IF EXISTS "Admins can manage all achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "User access own data" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can manage their own achievements" ON public.user_achievements;
CREATE POLICY "user_achievements_user_all" ON public.user_achievements FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_achievements_admin_manage" ON public.user_achievements FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- USER QUESTS (user owns, admin manage)
DROP POLICY IF EXISTS "Admins can manage all quests" ON public.user_quests;
DROP POLICY IF EXISTS "User access own data" ON public.user_quests;
DROP POLICY IF EXISTS "Users can manage their own quests" ON public.user_quests;
CREATE POLICY "user_quests_user_all" ON public.user_quests FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_quests_admin_manage" ON public.user_quests FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());

-- USER SESSIONS (user owns; admin read; service insert)
DROP POLICY IF EXISTS "log_session_access_for_security" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_own_access" ON public.user_sessions;
DROP POLICY IF EXISTS "user_sessions_service_insert" ON public.user_sessions;
CREATE POLICY "user_sessions_user_all" ON public.user_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_sessions_admin_read" ON public.user_sessions FOR SELECT USING (is_admin_secure());
CREATE POLICY "user_sessions_service_insert" ON public.user_sessions FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- WAREHOUSE ITEMS (admin only)
DROP POLICY IF EXISTS "Admins can insert warehouse items" ON public.warehouse_items;
DROP POLICY IF EXISTS "Admins can manage warehouse items" ON public.warehouse_items;
DROP POLICY IF EXISTS "Admins can update warehouse items" ON public.warehouse_items;
DROP POLICY IF EXISTS "Admins can view all warehouse items" ON public.warehouse_items;
CREATE POLICY "warehouse_items_admin_manage" ON public.warehouse_items FOR ALL USING (is_admin_secure()) WITH CHECK (is_admin_secure());
