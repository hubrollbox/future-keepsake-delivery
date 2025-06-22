-- Criação da tabela digital_messages
CREATE TABLE IF NOT EXISTS public.digital_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Criação da tabela digital_files
CREATE TABLE IF NOT EXISTS public.digital_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.digital_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_files ENABLE ROW LEVEL SECURITY;

-- Política RLS: Usuário só pode acessar seus próprios registros
CREATE POLICY "Users can view their own digital messages" ON public.digital_messages
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own digital messages" ON public.digital_messages
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own digital messages" ON public.digital_messages
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own digital messages" ON public.digital_messages
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view their own digital files" ON public.digital_files
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own digital files" ON public.digital_files
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own digital files" ON public.digital_files
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own digital files" ON public.digital_files
    FOR DELETE USING (user_id = auth.uid());