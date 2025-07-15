-- Adicionar coluna payment_id à tabela cart_items
ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL;

-- total_amount column removed as it can be calculated dynamically (quantity * product_price)