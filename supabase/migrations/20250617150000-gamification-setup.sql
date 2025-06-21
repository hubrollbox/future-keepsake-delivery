-- Tabela de conquistas
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de conquistas desbloqueadas por usuário
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements (id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);

-- Tabela de missões
CREATE TABLE quests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target INTEGER NOT NULL,
    reward INTEGER NOT NULL,
    time_limit INTERVAL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de progresso de missões por usuário
CREATE TABLE user_quests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests (id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE (user_id, quest_id)
);

-- Tabela de estatísticas do usuário
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Função para calcular nível com base nos pontos
CREATE FUNCTION calculate_level(points INTEGER) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN (points / 100) + 1;
END;
$$;

-- Ativar Row Level Security
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "User can access their achievements" ON user_achievements
    FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "User can access their quests" ON user_quests
    FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "User can access their stats" ON user_stats
    FOR SELECT USING ((select auth.uid()) = user_id);
