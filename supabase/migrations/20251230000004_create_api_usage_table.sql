-- Criar tabela para controle de uso da API de IA
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    huggingface_requests INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraint para garantir um registro por usuário por dia
    UNIQUE(user_id, date)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON public.api_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON public.api_usage(date);

-- RLS (Row Level Security)
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver seus próprios registros
CREATE POLICY "Users can view own api usage" ON public.api_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Política: usuários podem inserir seus próprios registros
CREATE POLICY "Users can insert own api usage" ON public.api_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: usuários podem atualizar seus próprios registros
CREATE POLICY "Users can update own api usage" ON public.api_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER handle_api_usage_updated_at
    BEFORE UPDATE ON public.api_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Função para limpar registros antigos (opcional, para manutenção)
CREATE OR REPLACE FUNCTION public.cleanup_old_api_usage()
RETURNS void AS $$
BEGIN
    -- Remove registros mais antigos que 90 dias
    DELETE FROM public.api_usage 
    WHERE date < CURRENT_DATE - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE public.api_usage IS 'Tabela para controle de uso diário da API de IA por usuário';
COMMENT ON COLUMN public.api_usage.user_id IS 'ID do usuário que fez as requisições';
COMMENT ON COLUMN public.api_usage.date IS 'Data das requisições (formato YYYY-MM-DD)';
COMMENT ON COLUMN public.api_usage.huggingface_requests IS 'Número de requisições feitas para a API do Hugging Face no dia';