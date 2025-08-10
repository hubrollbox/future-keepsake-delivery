-- Habilitar RLS em todas as tabelas que ainda não têm
ALTER TABLE IF EXISTS public.keepsakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para keepsakes
CREATE POLICY "Usuários podem ver apenas seus próprios keepsakes" 
  ON public.keepsakes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios keepsakes" 
  ON public.keepsakes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios keepsakes" 
  ON public.keepsakes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem ver todos os keepsakes" 
  ON public.keepsakes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Políticas para deliveries
CREATE POLICY "Usuários podem ver apenas suas próprias entregas" 
  ON public.deliveries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias entregas" 
  ON public.deliveries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias entregas" 
  ON public.deliveries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem ver todas as entregas" 
  ON public.deliveries FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Administradores podem atualizar todas as entregas" 
  ON public.deliveries FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Políticas para recipients
CREATE POLICY "Usuários podem ver apenas seus próprios destinatários" 
  ON public.recipients FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios destinatários" 
  ON public.recipients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios destinatários" 
  ON public.recipients FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem ver todos os destinatários" 
  ON public.recipients FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Políticas para warehouse_items (apenas administradores)
CREATE POLICY "Administradores podem ver todos os itens do armazém" 
  ON public.warehouse_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Administradores podem inserir itens no armazém" 
  ON public.warehouse_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Administradores podem atualizar itens do armazém" 
  ON public.warehouse_items FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Administradores podem excluir itens do armazém" 
  ON public.warehouse_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Políticas para payments
CREATE POLICY "Usuários podem ver apenas seus próprios pagamentos" 
  ON public.payments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios pagamentos" 
  ON public.payments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Administradores podem ver todos os pagamentos" 
  ON public.payments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Políticas para notifications
CREATE POLICY "Usuários podem ver apenas suas próprias notificações" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem marcar suas próprias notificações como lidas" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem ver todas as notificações" 
  ON public.notifications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Políticas para scheduled_notifications
CREATE POLICY "Usuários podem ver apenas suas próprias notificações agendadas" 
  ON public.scheduled_notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias notificações agendadas" 
  ON public.scheduled_notifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias notificações agendadas" 
  ON public.scheduled_notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Administradores podem gerenciar todas as notificações agendadas" 
  ON public.scheduled_notifications FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Criar ou substituir a função is_admin_user() para verificações de administrador mais robustas
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = '', pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

COMMENT ON FUNCTION public.is_admin_user() IS 'Verifica se o usuário atual tem papel de administrador';

-- Atualizar as políticas para usar a função is_admin_user()
DROP POLICY IF EXISTS "Administradores podem ver todos os keepsakes" ON public.keepsakes;
CREATE POLICY "Administradores podem ver todos os keepsakes" 
  ON public.keepsakes FOR SELECT 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem ver todas as entregas" ON public.deliveries;
CREATE POLICY "Administradores podem ver todas as entregas" 
  ON public.deliveries FOR SELECT 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem atualizar todas as entregas" ON public.deliveries;
CREATE POLICY "Administradores podem atualizar todas as entregas" 
  ON public.deliveries FOR UPDATE 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem ver todos os destinatários" ON public.recipients;
CREATE POLICY "Administradores podem ver todos os destinatários" 
  ON public.recipients FOR SELECT 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem ver todos os itens do armazém" ON public.warehouse_items;
CREATE POLICY "Administradores podem ver todos os itens do armazém" 
  ON public.warehouse_items FOR SELECT 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem inserir itens no armazém" ON public.warehouse_items;
CREATE POLICY "Administradores podem inserir itens no armazém" 
  ON public.warehouse_items FOR INSERT 
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem atualizar itens do armazém" ON public.warehouse_items;
CREATE POLICY "Administradores podem atualizar itens do armazém" 
  ON public.warehouse_items FOR UPDATE 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem excluir itens do armazém" ON public.warehouse_items;
CREATE POLICY "Administradores podem excluir itens do armazém" 
  ON public.warehouse_items FOR DELETE 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem ver todos os pagamentos" ON public.payments;
CREATE POLICY "Administradores podem ver todos os pagamentos" 
  ON public.payments FOR SELECT 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem ver todas as notificações" ON public.notifications;
CREATE POLICY "Administradores podem ver todas as notificações" 
  ON public.notifications FOR SELECT 
  USING (public.is_admin_user());

DROP POLICY IF EXISTS "Administradores podem gerenciar todas as notificações agendadas" ON public.scheduled_notifications;
CREATE POLICY "Administradores podem gerenciar todas as notificações agendadas" 
  ON public.scheduled_notifications FOR ALL 
  USING (public.is_admin_user());