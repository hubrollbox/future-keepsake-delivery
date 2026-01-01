-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Regras de Pontuação (Configurável)
CREATE TABLE IF NOT EXISTS public.point_rules (
    action_type TEXT PRIMARY KEY,
    points INTEGER NOT NULL,
    daily_limit INTEGER DEFAULT NULL, -- NULL = sem limite
    min_interval_seconds INTEGER DEFAULT 0, -- Anti-spam: tempo mínimo entre ações iguais
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir regras iniciais baseadas no pedido
INSERT INTO public.point_rules (action_type, points, daily_limit, min_interval_seconds, description) VALUES
('register', 100, 1, 0, 'Registo inicial'),
('first_blog_visit', 50, 1, 0, 'Primeira visita ao blog'),
('daily_login', 5, 1, 0, 'Login diário'),
('blog_visit', 5, 1, 0, 'Visita ao blog (diária)'),
('content_view', 1, 20, 10, 'Visualização de conteúdo'),
('article_read', 10, 3, 60, 'Leitura completa de artigo'),
('streak_7', 30, 1, 0, 'Semana consecutiva ativa'),
('streak_30', 100, 1, 0, 'Mês consecutivo ativo'),
('streak_90', 150, 1, 0, '90 dias ativo'),
('streak_180', 300, 1, 0, '180 dias ativo'),
('streak_365', 600, 1, 0, '365 dias ativo'),
('like_given', 2, 10, 5, 'Like dado'),
('like_received', 1, 20, 0, 'Like recebido'),
('comment_approved', 15, 5, 30, 'Comentário aprovado'),
('comment_reply', 5, 10, 30, 'Resposta a comentário'),
('share_external', 20, 2, 60, 'Partilha externa validada'),
('click_external', 5, 20, 0, 'Clique externo validado'),
('conversion_new_user', 40, NULL, 0, 'Conversão (novo utilizador)'),
('conversion_active_30', 50, NULL, 0, 'Utilizador convertido ativo 30 dias'),
('conversion_active_90', 100, NULL, 0, 'Utilizador convertido ativo 90 dias'),
('invite_accepted', 50, NULL, 0, 'Convite aceite'),
('invite_active_30', 50, NULL, 0, 'Convite ativo 30 dias'),
('invite_active_90', 100, NULL, 0, 'Convite ativo 90 dias')
ON CONFLICT (action_type) DO UPDATE 
SET points = EXCLUDED.points, 
    daily_limit = EXCLUDED.daily_limit,
    min_interval_seconds = EXCLUDED.min_interval_seconds;

-- 2. Tabela de Estatísticas do Usuário
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    longest_streak INTEGER DEFAULT 0,
    milestones JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Eventos de Pontos (Log Imutável)
CREATE TABLE IF NOT EXISTS public.point_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL REFERENCES public.point_rules(action_type),
    points INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_point_events_user_action_date ON public.point_events(user_id, action_type, created_at);
CREATE INDEX IF NOT EXISTS idx_point_events_created_at ON public.point_events(created_at);

-- 4. Função Segura para Adicionar Pontos (PL/PGSQL)
CREATE OR REPLACE FUNCTION public.add_points(
    p_user_id UUID,
    p_action_type TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com permissões de admin para garantir integridade
AS $$
DECLARE
    v_rule RECORD;
    v_points_to_add INTEGER;
    v_today_count INTEGER;
    v_last_event_time TIMESTAMPTZ;
    v_new_total INTEGER;
    v_current_streak INTEGER;
    v_last_activity DATE;
    v_streak_bonus INTEGER := 0;
    v_streak_message TEXT := '';
BEGIN
    -- 1. Validar Regra
    SELECT * INTO v_rule FROM public.point_rules WHERE action_type = p_action_type AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or inactive action type');
    END IF;

    v_points_to_add := v_rule.points;

    -- 2. Verificar Limites Diários (Anti-Fraude)
    IF v_rule.daily_limit IS NOT NULL THEN
        SELECT COUNT(*) INTO v_today_count 
        FROM public.point_events 
        WHERE user_id = p_user_id 
          AND action_type = p_action_type 
          AND created_at >= CURRENT_DATE; -- Desde meia-noite de hoje

        IF v_today_count >= v_rule.daily_limit THEN
            RETURN jsonb_build_object('success', false, 'message', 'Daily limit reached');
        END IF;
    END IF;

    -- 3. Verificar Intervalo Mínimo (Anti-Spam)
    IF v_rule.min_interval_seconds > 0 THEN
        SELECT created_at INTO v_last_event_time
        FROM public.point_events
        WHERE user_id = p_user_id 
          AND action_type = p_action_type 
        ORDER BY created_at DESC 
        LIMIT 1;

        IF v_last_event_time IS NOT NULL AND (EXTRACT(EPOCH FROM (NOW() - v_last_event_time)) < v_rule.min_interval_seconds) THEN
            RETURN jsonb_build_object('success', false, 'message', 'Too fast');
        END IF;
    END IF;

    -- 4. Lógica de Streak (Apenas para Login Diário ou ações principais)
    -- Atualiza stats se não existir
    INSERT INTO public.user_stats (user_id, last_activity_date)
    VALUES (p_user_id, CURRENT_DATE - INTERVAL '1 day') -- Inicializa para permitir lógica abaixo
    ON CONFLICT (user_id) DO NOTHING;

    IF p_action_type = 'daily_login' OR p_action_type = 'blog_visit' THEN
        SELECT last_activity_date, current_streak INTO v_last_activity, v_current_streak
        FROM public.user_stats
        WHERE user_id = p_user_id;

        IF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
            -- Streak continua
            v_current_streak := v_current_streak + 1;
            
            -- Verificar bônus de streak
            IF v_current_streak = 7 THEN
                PERFORM public.add_points(p_user_id, 'streak_7');
                v_streak_message := ' + Streak 7 days!';
            ELSIF v_current_streak = 30 THEN
                PERFORM public.add_points(p_user_id, 'streak_30');
                v_streak_message := ' + Streak 30 days!';
            ELSIF v_current_streak = 90 THEN
                PERFORM public.add_points(p_user_id, 'streak_90');
            ELSIF v_current_streak = 180 THEN
                PERFORM public.add_points(p_user_id, 'streak_180');
            ELSIF v_current_streak = 365 THEN
                PERFORM public.add_points(p_user_id, 'streak_365');
            END IF;

        ELSIF v_last_activity < CURRENT_DATE - INTERVAL '1 day' THEN
            -- Streak quebrou
            v_current_streak := 1;
        ELSE
            -- Já logou hoje, mantém streak atual (mas a validação daily_limit já deve ter barrado pontos extras de login)
            -- Se chegou aqui, é porque daily_login ainda não foi contado hoje?
            -- Não, a query do daily_limit barra. Mas vamos garantir.
            v_current_streak := v_current_streak; -- No change
        END IF;

        -- Atualizar data de atividade
        UPDATE public.user_stats 
        SET last_activity_date = CURRENT_DATE,
            current_streak = v_current_streak,
            longest_streak = GREATEST(longest_streak, v_current_streak),
            updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;

    -- 5. Inserir Evento
    INSERT INTO public.point_events (user_id, action_type, points, metadata)
    VALUES (p_user_id, p_action_type, v_points_to_add, p_metadata);

    -- 6. Atualizar Total de Pontos
    UPDATE public.user_stats
    SET total_points = total_points + v_points_to_add,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING total_points INTO v_new_total;

    RETURN jsonb_build_object(
        'success', true, 
        'points_added', v_points_to_add, 
        'new_total', v_new_total,
        'message', 'Points added successfully' || v_streak_message
    );
END;
$$;

-- Permissões
ALTER TABLE public.point_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_events ENABLE ROW LEVEL SECURITY;

-- Políticas (Policies)
-- Rules: Todos podem ler
CREATE POLICY "Public read rules" ON public.point_rules FOR SELECT USING (true);

-- User Stats: Usuário vê o seu, Admin vê todos (assumindo role service_role ou admin)
CREATE POLICY "User sees own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);

-- Point Events: Usuário vê os seus
CREATE POLICY "User sees own events" ON public.point_events FOR SELECT USING (auth.uid() = user_id);

-- Apenas a função add_points (SECURITY DEFINER) pode escrever nas tabelas, 
-- então não precisamos de policies de INSERT/UPDATE para usuários normais, 
-- EXCETO se quisermos permitir que o cliente chame o insert diretamente (O QUE NÃO QUEREMOS).
-- Vamos manter fechado para escrita direta via API client e usar RPC.
