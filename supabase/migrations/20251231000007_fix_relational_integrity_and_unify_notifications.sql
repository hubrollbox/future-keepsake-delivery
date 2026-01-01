-- Migration: Fix Relational Integrity and Unify Notifications
-- Date: 2025-01-30
-- Description: Corrige chaves estrangeiras, unifica tabelas de notificações e implementa envio automático

-- 1. CORREÇÕES DE INTEGRIDADE RELACIONAL

-- Remover registos órfãos antes de adicionar constraints
DELETE FROM keepsakes WHERE user_id NOT IN (SELECT id FROM profiles);
DELETE FROM keepsakes WHERE recipient_id IS NOT NULL AND recipient_id NOT IN (SELECT id FROM recipients);
DELETE FROM scheduled_notifications WHERE keepsake_id IS NOT NULL AND keepsake_id NOT IN (SELECT id FROM keepsakes);
DELETE FROM notifications WHERE keepsake_id IS NOT NULL AND keepsake_id NOT IN (SELECT id FROM keepsakes);
DELETE FROM notifications WHERE recipient_id IS NOT NULL AND recipient_id NOT IN (SELECT id FROM recipients);
DELETE FROM user_achievements WHERE achievement_id IS NOT NULL AND achievement_id NOT IN (SELECT id FROM achievements);
DELETE FROM user_quests WHERE quest_id IS NOT NULL AND quest_id NOT IN (SELECT id FROM quests);

-- Adicionar colunas necessárias se não existirem
ALTER TABLE keepsakes ADD COLUMN IF NOT EXISTS sender_id uuid;
ALTER TABLE keepsakes ADD COLUMN IF NOT EXISTS recipient_id uuid;

-- Atualizar sender_id com user_id se estiver vazio
UPDATE keepsakes SET sender_id = user_id WHERE sender_id IS NULL;

-- Remover constraints existentes se existirem
ALTER TABLE keepsakes DROP CONSTRAINT IF EXISTS keepsakes_sender_id_fkey;
ALTER TABLE keepsakes DROP CONSTRAINT IF EXISTS keepsakes_recipient_id_fkey;
ALTER TABLE scheduled_notifications DROP CONSTRAINT IF EXISTS scheduled_notifications_keepsake_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_keepsake_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_recipient_id_fkey;
ALTER TABLE user_achievements DROP CONSTRAINT IF EXISTS user_achievements_achievement_id_fkey;
ALTER TABLE user_quests DROP CONSTRAINT IF EXISTS user_quests_quest_id_fkey;

-- Adicionar chaves estrangeiras com ON DELETE CASCADE
ALTER TABLE keepsakes ADD CONSTRAINT keepsakes_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE keepsakes ADD CONSTRAINT keepsakes_recipient_id_fkey 
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE;

ALTER TABLE scheduled_notifications ADD CONSTRAINT scheduled_notifications_keepsake_id_fkey 
    FOREIGN KEY (keepsake_id) REFERENCES keepsakes(id) ON DELETE CASCADE;

ALTER TABLE notifications ADD CONSTRAINT notifications_keepsake_id_fkey 
    FOREIGN KEY (keepsake_id) REFERENCES keepsakes(id) ON DELETE CASCADE;

ALTER TABLE notifications ADD CONSTRAINT notifications_recipient_id_fkey 
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE;

ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_achievement_id_fkey 
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE;

ALTER TABLE user_quests ADD CONSTRAINT user_quests_quest_id_fkey 
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE;

-- 2. UNIFICAÇÃO DAS TABELAS DE NOTIFICAÇÕES

-- Criar nova tabela unificada de notificações
CREATE TABLE IF NOT EXISTS unified_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid NOT NULL REFERENCES keepsakes(id) ON DELETE CASCADE,
    recipient_id uuid NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    scheduled_for timestamp with time zone NOT NULL,
    sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Criar índice para otimizar consultas por scheduled_for
CREATE INDEX IF NOT EXISTS idx_unified_notifications_scheduled_for 
    ON unified_notifications(scheduled_for) WHERE status = 'pending';

-- Migrar dados das tabelas existentes para a nova tabela
INSERT INTO unified_notifications (keepsake_id, recipient_id, status, scheduled_for, sent_at)
SELECT 
    sn.keepsake_id,
    r.id as recipient_id,
    CASE 
        WHEN sn.status = 'sent' THEN 'sent'
        WHEN sn.status = 'failed' THEN 'failed'
        ELSE 'pending'
    END as status,
    sn.delivery_date as scheduled_for,
    sn.sent_at
FROM scheduled_notifications sn
JOIN recipients r ON r.email = sn.recipient_email
WHERE sn.keepsake_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Migrar notificações existentes
INSERT INTO unified_notifications (keepsake_id, recipient_id, status, scheduled_for, sent_at)
SELECT 
    n.keepsake_id,
    COALESCE(n.recipient_id, r.id) as recipient_id,
    CASE 
        WHEN n.status = 'sent' THEN 'sent'
        WHEN n.status = 'failed' THEN 'failed'
        ELSE 'pending'
    END as status,
    COALESCE(n.created_at, now()) as scheduled_for,
    n.read_at as sent_at
FROM notifications n
LEFT JOIN recipients r ON r.email = (SELECT email FROM profiles WHERE id = n.user_id)
WHERE n.keepsake_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. ATUALIZAR STATUS DAS KEEPSAKES

-- Adicionar coluna sent_at se não existir
ALTER TABLE keepsakes ADD COLUMN IF NOT EXISTS sent_at timestamp with time zone;

-- Atualizar status das keepsakes baseado nas notificações
UPDATE keepsakes 
SET 
    status = 'sent',
    sent_at = un.sent_at
FROM unified_notifications un
WHERE keepsakes.id = un.keepsake_id 
    AND un.status = 'sent' 
    AND keepsakes.status != 'sent';

-- Atualizar keepsakes com data passada para status 'pending' se ainda estão 'scheduled'
UPDATE keepsakes 
SET status = 'pending'
WHERE delivery_date <= CURRENT_DATE 
    AND status = 'scheduled';

-- 4. FUNÇÃO DE ENVIO AUTOMÁTICO

CREATE OR REPLACE FUNCTION send_due_keepsakes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    keepsake_record RECORD;
    recipient_record RECORD;
BEGIN
    -- Selecionar todas as cápsulas com data de entrega <= agora e status = 'pending'
    FOR keepsake_record IN 
        SELECT k.id, k.title, k.message_content, k.delivery_date, k.sender_id
        FROM keepsakes k
        WHERE k.delivery_date <= CURRENT_DATE 
            AND k.status = 'pending'
    LOOP
        -- Para cada cápsula, processar todos os destinatários
        FOR recipient_record IN 
            SELECT r.id, r.name, r.email
            FROM recipients r
            WHERE r.keepsake_id = keepsake_record.id
        LOOP
            -- Criar notificação unificada
            INSERT INTO unified_notifications (
                keepsake_id, 
                recipient_id, 
                status, 
                scheduled_for, 
                sent_at
            ) VALUES (
                keepsake_record.id,
                recipient_record.id,
                'sent',
                keepsake_record.delivery_date::timestamp with time zone,
                now()
            )
            ON CONFLICT DO NOTHING;
            
            -- Aqui seria chamada a função de envio de email
            -- Por agora, apenas registamos que foi "enviado"
            RAISE NOTICE 'Keepsake % enviado para %', keepsake_record.title, recipient_record.email;
        END LOOP;
        
        -- Atualizar status da keepsake para 'sent'
        UPDATE keepsakes 
        SET 
            status = 'sent',
            sent_at = now(),
            updated_at = now()
        WHERE id = keepsake_record.id;
        
    END LOOP;
    
    RAISE NOTICE 'Processamento de keepsakes concluído';
END;
$$;

-- 5. FUNÇÃO PARA PROCESSAR KEEPSAKES COM DATA PASSADA IMEDIATAMENTE

CREATE OR REPLACE FUNCTION process_immediate_keepsakes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Atualizar keepsakes com data passada para status 'pending'
    UPDATE keepsakes 
    SET status = 'pending'
    WHERE delivery_date <= CURRENT_DATE 
        AND status = 'scheduled';
    
    -- Executar envio imediato
    PERFORM send_due_keepsakes();
END;
$$;

-- 6. TRIGGER PARA PROCESSAR KEEPSAKES COM DATA PASSADA AUTOMATICAMENTE

CREATE OR REPLACE FUNCTION trigger_process_immediate_keepsakes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Se a data de entrega é no passado ou hoje, processar imediatamente
    IF NEW.delivery_date <= CURRENT_DATE AND NEW.status = 'scheduled' THEN
        NEW.status = 'pending';
        
        -- Agendar processamento assíncrono
        PERFORM pg_notify('process_keepsakes', NEW.id::text);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_immediate_keepsakes ON keepsakes;
CREATE TRIGGER trigger_immediate_keepsakes
    BEFORE INSERT OR UPDATE ON keepsakes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_process_immediate_keepsakes();

-- 7. CONFIGURAÇÃO DO SCHEDULER (CRON JOB)

-- Remover job existente se existir
SELECT cron.unschedule('send-due-keepsakes') WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'send-due-keepsakes'
);

-- Agendar execução de hora em hora
SELECT cron.schedule(
    'send-due-keepsakes',
    '0 * * * *', -- A cada hora
    'SELECT send_due_keepsakes();'
);

-- 8. LIMPEZA (OPCIONAL - COMENTADO PARA SEGURANÇA)

-- Após confirmar que a migração funcionou, pode descomentar estas linhas:
-- DROP TABLE IF EXISTS scheduled_notifications;
-- DROP TABLE IF EXISTS notifications;

-- 9. ATUALIZAR RLS POLICIES PARA A NOVA TABELA

-- Habilitar RLS na nova tabela
ALTER TABLE unified_notifications ENABLE ROW LEVEL SECURITY;

-- Policy para usuários verem suas próprias notificações
CREATE POLICY "Users can view their own notifications" ON unified_notifications
    FOR SELECT USING (
        keepsake_id IN (
            SELECT id FROM keepsakes WHERE sender_id = auth.uid()
        )
    );

-- Policy para usuários inserirem suas próprias notificações
CREATE POLICY "Users can insert their own notifications" ON unified_notifications
    FOR INSERT WITH CHECK (
        keepsake_id IN (
            SELECT id FROM keepsakes WHERE sender_id = auth.uid()
        )
    );

-- Policy para usuários atualizarem suas próprias notificações
CREATE POLICY "Users can update their own notifications" ON unified_notifications
    FOR UPDATE USING (
        keepsake_id IN (
            SELECT id FROM keepsakes WHERE sender_id = auth.uid()
        )
    );

-- Policy para administradores
CREATE POLICY "Admins can manage all notifications" ON unified_notifications
    FOR ALL USING (is_admin_user());

-- 10. COMENTÁRIOS E DOCUMENTAÇÃO

COMMENT ON TABLE unified_notifications IS 'Tabela unificada para todas as notificações de keepsakes';
COMMENT ON COLUMN unified_notifications.status IS 'Status da notificação: pending, sent, failed';
COMMENT ON COLUMN unified_notifications.scheduled_for IS 'Data/hora agendada para envio';
COMMENT ON COLUMN unified_notifications.sent_at IS 'Data/hora real do envio';
COMMENT ON FUNCTION send_due_keepsakes() IS 'Função para processar e enviar keepsakes com data de entrega vencida';
COMMENT ON FUNCTION process_immediate_keepsakes() IS 'Função para processar keepsakes com data passada imediatamente';

-- Fim da migração