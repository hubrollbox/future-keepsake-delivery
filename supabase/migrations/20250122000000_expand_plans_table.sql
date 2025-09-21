-- Expand plans table with additional fields for comprehensive plan management
ALTER TABLE public.plans 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS duration_months integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update existing plans with default values
UPDATE public.plans 
SET 
  description = CASE 
    WHEN name = 'Free' THEN 'Plano gratuito com funcionalidades básicas'
    WHEN name = 'Premium' THEN 'Plano premium com todas as funcionalidades'
    ELSE 'Plano personalizado'
  END,
  price = CASE 
    WHEN name = 'Free' THEN 0
    WHEN name = 'Premium' THEN 9.99
    ELSE 0
  END,
  features = CASE 
    WHEN name = 'Free' THEN ARRAY['1 cápsula por mês', 'Mensagens básicas', 'Suporte por email']
    WHEN name = 'Premium' THEN ARRAY['Cápsulas ilimitadas', 'Upload de mídia', 'Suporte prioritário', 'Funcionalidades avançadas']
    ELSE ARRAY['Funcionalidades personalizadas']
  END
WHERE description IS NULL;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plans_updated_at_trigger
    BEFORE UPDATE ON public.plans
    FOR EACH ROW
    EXECUTE FUNCTION update_plans_updated_at();