-- Migração de dados de gamificação de user_stats para profiles
-- Primeiro, adicione as colunas total_points e level à tabela profiles, se ainda não existirem.
-- Elas já foram identificadas na tabela profiles, então esta etapa é mais para garantir a idempotência.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_points BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INT DEFAULT 1;

-- Atualize os dados existentes em profiles com base em user_stats, se user_stats existir e tiver dados.
-- Esta parte é comentada porque a existência de user_stats com essas colunas não foi confirmada.
-- Se user_stats for encontrada com total_points e level, descomente e ajuste conforme necessário.
-- UPDATE public.profiles p
-- SET
--    total_points = us.total_points,
--    level = us.level
-- FROM public.user_stats us
-- WHERE p.id = us.user_id;

-- Remova a tabela user_stats, se existir.
-- Antes de remover, certifique-se de que todos os dados relevantes foram migrados ou não são mais necessários.
DROP TABLE IF EXISTS public.user_stats;

-- Opcional: Remova quaisquer funções ou triggers relacionadas a user_stats, se existirem.
-- Exemplo: DROP FUNCTION IF EXISTS public.update_user_stats_on_achievement();

-- Opcional: Remova quaisquer políticas de RLS relacionadas a user_stats, se existirem.
-- Exemplo: DROP POLICY IF EXISTS "User can view own user_stats." ON public.user_stats;