-- Adicionar campo poetry (frase emotiva) à tabela products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS poetry TEXT;

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.products.poetry IS 'Frase emotiva/poética que acompanha o produto, seguindo a identidade da marca Keepla';

-- Remover a coluna category se existir (não está no schema oficial)
ALTER TABLE public.products 
DROP COLUMN IF EXISTS category;