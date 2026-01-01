-- Fix multiple critical RLS vulnerabilities
-- Date: 2025-01-29
-- Description: Fix RLS policies that reference non-existent user_id columns and other security issues

-- =============================================================================
-- CRITICAL SECURITY FIXES FOR MULTIPLE TABLES
-- =============================================================================

-- Enable RLS on all sensitive tables (ensure they are enabled)
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_items ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FIX RECIPIENTS TABLE POLICIES (Critical - contains sensitive personal data)
-- =============================================================================

-- Drop all potentially dangerous policies for recipients
DROP POLICY IF EXISTS "Public read access" ON public.recipients;
DROP POLICY IF EXISTS "Allow read access to all" ON public.recipients;
DROP POLICY IF EXISTS "Users can only see their own recipients" ON public.recipients;
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios destinatários" ON public.recipients;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios destinatários" ON public.recipients;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios destinatários" ON public.recipients;
DROP POLICY IF EXISTS "Administradores podem ver todos os destinatários" ON public.recipients;

-- Create secure policies for recipients (only keepsake owners can access)
CREATE POLICY "recipients_keepsake_owner_access" ON public.recipients
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

-- =============================================================================
-- FIX DELIVERIES TABLE POLICIES
-- =============================================================================

-- Drop potentially dangerous policies for deliveries
DROP POLICY IF EXISTS "Usuários podem ver apenas suas próprias entregas" ON public.deliveries;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias entregas" ON public.deliveries;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias entregas" ON public.deliveries;
DROP POLICY IF EXISTS "Administradores podem ver todas as entregas" ON public.deliveries;
DROP POLICY IF EXISTS "Administradores podem atualizar todas as entregas" ON public.deliveries;

-- Create secure policies for deliveries (deliveries table HAS user_id column)
CREATE POLICY "deliveries_user_access" ON public.deliveries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "deliveries_admin_access" ON public.deliveries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- FIX NOTIFICATIONS TABLE POLICIES
-- =============================================================================

-- Drop potentially dangerous policies for notifications
DROP POLICY IF EXISTS "Usuários podem ver apenas suas próprias notificações" ON public.notifications;
DROP POLICY IF EXISTS "Administradores podem ver todas as notificações" ON public.notifications;

-- Create secure policies for notifications (notifications table HAS user_id column)
CREATE POLICY "notifications_user_access" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "notifications_admin_access" ON public.notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- FIX SCHEDULED_NOTIFICATIONS TABLE POLICIES (CRITICAL)
-- =============================================================================

-- Drop dangerous policies that reference non-existent user_id column
DROP POLICY IF EXISTS "Usuários podem ver apenas suas próprias notificações agendadas" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "Usuários podem inserir suas próprias notificações agendadas" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias notificações agendadas" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "Administradores podem gerenciar todas as notificações agendadas" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "Allow read access to all" ON public.scheduled_notifications;

-- Create secure policies for scheduled_notifications
-- Note: scheduled_notifications table does NOT have user_id column, only user_email
-- We need to match against the authenticated user's email
CREATE POLICY "scheduled_notifications_user_access" ON public.scheduled_notifications
  FOR ALL USING (
    user_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "scheduled_notifications_admin_access" ON public.scheduled_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- FIX WAREHOUSE_ITEMS TABLE POLICIES
-- =============================================================================

-- Drop potentially dangerous policies for warehouse_items
DROP POLICY IF EXISTS "Administradores podem ver todos os itens do armazém" ON public.warehouse_items;
DROP POLICY IF EXISTS "Administradores podem inserir itens no armazém" ON public.warehouse_items;
DROP POLICY IF EXISTS "Administradores podem atualizar itens do armazém" ON public.warehouse_items;
DROP POLICY IF EXISTS "Administradores podem excluir itens do armazém" ON public.warehouse_items;

-- Create secure policies for warehouse_items (admin-only access)
CREATE POLICY "warehouse_items_admin_only" ON public.warehouse_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- VERIFICATION QUERIES (commented out - for manual verification)
-- =============================================================================

-- To verify the fixes work correctly, run these queries as different users:
-- SELECT * FROM public.recipients; -- Should only show user's own recipients
-- SELECT * FROM public.deliveries; -- Should only show user's own deliveries
-- SELECT * FROM public.notifications; -- Should only show user's own notifications
-- SELECT * FROM public.scheduled_notifications; -- Should only show user's own scheduled notifications
-- SELECT * FROM public.warehouse_items; -- Should only work for admins

-- =============================================================================
-- SECURITY AUDIT LOG
-- =============================================================================

-- This migration fixes the following critical vulnerabilities:
-- 1. Recipients table: Fixed policies referencing non-existent user_id column
-- 2. Scheduled_notifications table: Fixed policies referencing non-existent user_id column
-- 3. Multiple tables: Removed dangerous public access policies
-- 4. All tables: Ensured proper RLS enforcement with secure policies

-- IMPACT: This migration prevents unauthorized access to sensitive personal data
-- including names, emails, phone numbers, and addresses in the recipients table.