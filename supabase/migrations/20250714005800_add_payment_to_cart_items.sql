-- Adicionar coluna payment_id à tabela cart_items
ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL;

-- Adicionar coluna total_amount à tabela cart_items
ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00;