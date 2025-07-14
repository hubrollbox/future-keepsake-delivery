
-- Atualizar tabela keepsakes com campos necessários
ALTER TABLE public.keepsakes 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Criar tabela recipients se não existir
CREATE TABLE IF NOT EXISTS public.recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keepsake_id UUID REFERENCES public.keepsakes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  delivery_channel TEXT NOT NULL DEFAULT 'email',
  email TEXT,
  phone TEXT,
  address TEXT,
  channel_cost DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_delivery_channel_fields CHECK (
    (delivery_channel = 'email' AND email IS NOT NULL) OR
    (delivery_channel = 'sms' AND phone IS NOT NULL) OR
    (delivery_channel = 'address' AND address IS NOT NULL) OR
    (delivery_channel NOT IN ('email', 'sms', 'address'))
  )
);

-- Criar tabela extras/products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'digital', 'physical', 'service'
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0 NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela keepsake_products (relação many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keepsake_id UUID REFERENCES public.keepsakes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL, -- Ensure this is consistent with products.price at application level
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir produtos padrão
INSERT INTO public.products (name, type, price, description, icon) VALUES
('Carta Digital Premium', 'digital', 2.50, 'Formatação rica, verificação blockchain, certificado', 'star'),
('Presente Físico Guardado', 'physical', 1.90, 'Armazenamento seguro com controlo climático', 'package'),
('Cápsula Individual', 'physical', 15.00, 'Caixa personalizada para um presente simbólico', 'gift'),
('Cápsula Premium', 'physical', 25.00, 'Com fechadura, maior capacidade e documentação', 'lock'),
('Cápsula Coletiva', 'physical', 49.00, 'Para grupos, com evento de abertura', 'users'),
('Edição de Vídeo Profissional', 'service', 9.90, 'Vídeo editado profissionalmente (até 1 minuto)', 'video'),
('Serviço de Compra', 'service', 5.00, 'Compramos o produto por ti (10% + 5€ mín.)', 'shopping-cart'),
('Entrega Programada', 'service', 6.50, 'Entrega em Portugal Continental na data exacta', 'truck')
ON CONFLICT DO NOTHING;

-- Enable RLS para novas tabelas
ALTER TABLE public.keepsakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keepsake_products ENABLE ROW LEVEL SECURITY;

-- RLS policies para recipients
DROP POLICY IF EXISTS "Users can view recipients of their keepsakes" ON public.recipients;
CREATE POLICY "Users can view recipients of their keepsakes" ON public.recipients
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = recipients.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert recipients for their keepsakes" ON public.recipients;
CREATE POLICY "Users can insert recipients for their keepsakes" ON public.recipients
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = recipients.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);

-- RLS policies para products (todos podem ver)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
FOR SELECT USING (active = true);

-- RLS policies para keepsakes
CREATE POLICY "Users can insert their own keepsakes" ON public.keepsakes
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own keepsakes" ON public.keepsakes
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own keepsakes" ON public.keepsakes
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own keepsakes" ON public.keepsakes
FOR DELETE USING (user_id = auth.uid());

-- RLS policies para keepsake_products
DROP POLICY IF EXISTS "Users can view products of their keepsakes" ON public.keepsake_products;
CREATE POLICY "Users can view products of their keepsakes" ON public.keepsake_products
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = keepsake_products.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert products for their keepsakes" ON public.keepsake_products;
CREATE POLICY "Users can insert products for their keepsakes" ON public.keepsake_products
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.keepsakes 
    WHERE keepsakes.id = keepsake_products.keepsake_id 
    AND keepsakes.user_id = auth.uid()
  )
);

-- Admin policies
DROP POLICY IF EXISTS "Admins can manage all recipients" ON public.recipients;
CREATE POLICY "Admins can manage all recipients" ON public.recipients
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products" ON public.products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage all keepsake_products" ON public.keepsake_products;
CREATE POLICY "Admins can manage all keepsake_products" ON public.keepsake_products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
