
-- Habilitar RLS na tabela deliveries
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- Permitir cada utilizador gerir apenas as suas entregas

-- Select
CREATE POLICY "Permitir user ver suas entregas" 
  ON public.deliveries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Insert
CREATE POLICY "Permitir user criar suas entregas"
  ON public.deliveries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update
CREATE POLICY "Permitir user atualizar suas entregas"
  ON public.deliveries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete
CREATE POLICY "Permitir user apagar suas entregas"
  ON public.deliveries
  FOR DELETE
  USING (auth.uid() = user_id);
