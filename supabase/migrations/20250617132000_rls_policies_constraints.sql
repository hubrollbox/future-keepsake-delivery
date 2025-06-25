-- dialect: postgresql

-- Ativar RLS e adicionar políticas e constraints nas tabelas principais

-- 1. Entregas
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access own deliveries" ON deliveries
  FOR ALL USING (user_id = (select auth.uid()));
ALTER TABLE deliveries
  ADD CONSTRAINT data_futura CHECK (delivery_date >= CURRENT_DATE);

-- 2. Notificações agendadas
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access own notifications" ON scheduled_notifications
  FOR ALL USING (user_id = (select auth.uid()));
CREATE POLICY "User can update own notifications" ON scheduled_notifications
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "User can delete own notifications" ON scheduled_notifications
  FOR DELETE USING (user_id = (select auth.uid()));
ALTER TABLE scheduled_notifications
  ADD CONSTRAINT email_valido_user CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT email_valido CHECK (recipient_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT data_futura_notif CHECK (delivery_date >= CURRENT_DATE);

-- 3. Pagamentos
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access own payments" ON payments
  FOR ALL USING (user_id = (select auth.uid()));
