-- Adicionar colunas keepsake_product_id e warehouse_item_id à tabela deliveries
ALTER TABLE public.deliveries
ADD COLUMN IF NOT EXISTS keepsake_product_id UUID REFERENCES public.keepsake_products(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS warehouse_item_id UUID REFERENCES public.warehouse_items(id) ON DELETE SET NULL;

-- Remover a coluna delivery_time da tabela deliveries, se existir
ALTER TABLE public.deliveries
DROP COLUMN IF EXISTS delivery_time;

-- Adicionar coluna product_id à tabela warehouse_items
ALTER TABLE public.warehouse_items
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

-- Adicionar coluna delivery_id à tabela scheduled_notifications
ALTER TABLE public.scheduled_notifications
ADD COLUMN IF NOT EXISTS delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE;

-- Adicionar validação para campos obrigatórios na tabela recipients
-- Esta parte pode exigir uma função ou trigger mais complexa no Supabase/PostgreSQL
-- Exemplo de CHECK constraint (simplificado, pode precisar de mais lógica para múltiplos canais):
ALTER TABLE public.recipients DROP CONSTRAINT IF EXISTS chk_delivery_channel_fields;
ALTER TABLE public.recipients
ADD CONSTRAINT chk_delivery_channel_fields
CHECK (
    (delivery_channel = 'email' AND email IS NOT NULL) OR
    (delivery_channel = 'sms' AND phone IS NOT NULL) OR
    (delivery_channel = 'physical' AND address IS NOT NULL)
);