-- Adicionar coluna product_id à tabela warehouse_items
ALTER TABLE public.warehouse_items
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

-- Adicionar coluna keepsake_id à tabela warehouse_items
ALTER TABLE public.warehouse_items
ADD COLUMN IF NOT EXISTS keepsake_id UUID REFERENCES public.keepsakes(id) ON DELETE SET NULL;

-- Opcional: Adicionar RLS policies para warehouse_items
-- DROP POLICY IF EXISTS "Users can view their own warehouse items" ON public.warehouse_items;
-- CREATE POLICY "Users can view their own warehouse items" ON public.warehouse_items
--   FOR SELECT USING (EXISTS (SELECT 1 FROM public.keepsakes WHERE keepsakes.id = warehouse_items.keepsake_id AND keepsakes.user_id = auth.uid()));

-- DROP POLICY IF EXISTS "Admins can manage all warehouse items" ON public.warehouse_items;
-- CREATE POLICY "Admins can manage all warehouse items" ON public.warehouse_items
--   FOR ALL USING (public.is_admin_user());