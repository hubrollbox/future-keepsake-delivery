-- Migration: Update send_due_keepsakes function to integrate with email sending
-- Date: 2025-01-30
-- Description: Atualiza a função para chamar o serviço de envio de emails

-- Função atualizada para envio de keepsakes com integração de email
CREATE OR REPLACE FUNCTION send_due_keepsakes()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    keepsake_record RECORD;
    recipient_record RECORD;
    sender_record RECORD;
    email_payload json;
    email_response json;
    processed_count integer := 0;
    failed_count integer := 0;
    result_json json;
BEGIN
    -- Selecionar todas as cápsulas com data de entrega <= agora e status = 'pending'
    FOR keepsake_record IN 
        SELECT k.id, k.title, k.message_content, k.delivery_date, k.sender_id, k.user_id
        FROM keepsakes k
        WHERE k.delivery_date <= CURRENT_DATE 
            AND k.status = 'pending'
        ORDER BY k.delivery_date ASC
    LOOP
        -- Obter dados do remetente
        SELECT p.full_name, p.email INTO sender_record
        FROM profiles p
        WHERE p.id = COALESCE(keepsake_record.sender_id, keepsake_record.user_id);
        
        -- Para cada cápsula, processar todos os destinatários
        FOR recipient_record IN 
            SELECT r.id, r.name, r.email
            FROM recipients r
            WHERE r.keepsake_id = keepsake_record.id
        LOOP
            BEGIN
                -- Preparar payload para envio de email
                email_payload := json_build_object(
                    'keepsake_id', keepsake_record.id,
                    'recipient_email', recipient_record.email,
                    'recipient_name', recipient_record.name,
                    'sender_name', COALESCE(sender_record.full_name, 'Remetente'),
                    'title', keepsake_record.title,
                    'message_content', keepsake_record.message_content,
                    'delivery_date', keepsake_record.delivery_date
                );
                
                -- Chamar função de envio de email
                SELECT content::json INTO email_response
                FROM http((
                    'POST',
                    current_setting('app.supabase_url') || '/functions/v1/send-keepsake-email',
                    ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'))],
                    'application/json',
                    email_payload::text
                ));
                
                -- Verificar se o email foi enviado com sucesso
                IF (email_response->>'success')::boolean = true THEN
                    -- Criar/atualizar notificação unificada como enviada
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
                    ON CONFLICT (keepsake_id, recipient_id) 
                    DO UPDATE SET 
                        status = 'sent',
                        sent_at = now(),
                        updated_at = now();
                    
                    processed_count := processed_count + 1;
                    RAISE NOTICE 'Keepsake % enviado com sucesso para %', keepsake_record.title, recipient_record.email;
                ELSE
                    -- Marcar como falhou
                    INSERT INTO unified_notifications (
                        keepsake_id, 
                        recipient_id, 
                        status, 
                        scheduled_for
                    ) VALUES (
                        keepsake_record.id,
                        recipient_record.id,
                        'failed',
                        keepsake_record.delivery_date::timestamp with time zone
                    )
                    ON CONFLICT (keepsake_id, recipient_id) 
                    DO UPDATE SET 
                        status = 'failed',
                        updated_at = now();
                    
                    failed_count := failed_count + 1;
                    RAISE WARNING 'Falha ao enviar keepsake % para %: %', keepsake_record.title, recipient_record.email, email_response->>'error';
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                -- Em caso de erro, marcar como falhou
                INSERT INTO unified_notifications (
                    keepsake_id, 
                    recipient_id, 
                    status, 
                    scheduled_for
                ) VALUES (
                    keepsake_record.id,
                    recipient_record.id,
                    'failed',
                    keepsake_record.delivery_date::timestamp with time zone
                )
                ON CONFLICT (keepsake_id, recipient_id) 
                DO UPDATE SET 
                    status = 'failed',
                    updated_at = now();
                
                failed_count := failed_count + 1;
                RAISE WARNING 'Erro ao processar keepsake % para %: %', keepsake_record.title, recipient_record.email, SQLERRM;
            END;
        END LOOP;
        
        -- Verificar se todos os destinatários foram processados com sucesso
        IF EXISTS (
            SELECT 1 FROM unified_notifications un
            WHERE un.keepsake_id = keepsake_record.id 
                AND un.status = 'sent'
        ) AND NOT EXISTS (
            SELECT 1 FROM unified_notifications un
            WHERE un.keepsake_id = keepsake_record.id 
                AND un.status IN ('pending', 'failed')
        ) THEN
            -- Atualizar status da keepsake para 'sent' apenas se todos foram enviados
            UPDATE keepsakes 
            SET 
                status = 'sent',
                sent_at = now(),
                updated_at = now()
            WHERE id = keepsake_record.id;
        ELSE
            -- Se houve falhas, manter como 'pending' para nova tentativa
            UPDATE keepsakes 
            SET updated_at = now()
            WHERE id = keepsake_record.id;
        END IF;
        
    END LOOP;
    
    -- Retornar resultado em JSON
    result_json := json_build_object(
        'processed_keepsakes', processed_count,
        'failed_notifications', failed_count,
        'timestamp', now(),
        'status', 'completed'
    );
    
    RAISE NOTICE 'Processamento concluído: % enviados, % falharam', processed_count, failed_count;
    
    RETURN result_json;
END;
$$;

-- Função auxiliar para verificar se a extensão http está disponível
CREATE OR REPLACE FUNCTION check_http_extension()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar se a extensão http está instalada
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http') THEN
        RETURN true;
    ELSE
        RAISE WARNING 'Extensão http não está instalada. Instale com: CREATE EXTENSION IF NOT EXISTS http;';
        RETURN false;
    END IF;
END;
$$;

-- Tentar instalar a extensão http se não estiver instalada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'http') THEN
        CREATE EXTENSION IF NOT EXISTS http;
        RAISE NOTICE 'Extensão http instalada com sucesso';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Não foi possível instalar a extensão http: %', SQLERRM;
END
$$;

-- Função alternativa para ambientes sem extensão http
CREATE OR REPLACE FUNCTION send_due_keepsakes_fallback()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    keepsake_record RECORD;
    recipient_record RECORD;
    processed_count integer := 0;
    result_json json;
BEGIN
    -- Versão simplificada sem envio de email real
    FOR keepsake_record IN 
        SELECT k.id, k.title, k.message_content, k.delivery_date, k.sender_id
        FROM keepsakes k
        WHERE k.delivery_date <= CURRENT_DATE 
            AND k.status = 'pending'
    LOOP
        FOR recipient_record IN 
            SELECT r.id, r.name, r.email
            FROM recipients r
            WHERE r.keepsake_id = keepsake_record.id
        LOOP
            -- Criar notificação como enviada (simulação)
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
            ON CONFLICT (keepsake_id, recipient_id) 
            DO UPDATE SET 
                status = 'sent',
                sent_at = now(),
                updated_at = now();
            
            processed_count := processed_count + 1;
        END LOOP;
        
        -- Atualizar status da keepsake
        UPDATE keepsakes 
        SET 
            status = 'sent',
            sent_at = now(),
            updated_at = now()
        WHERE id = keepsake_record.id;
    END LOOP;
    
    result_json := json_build_object(
        'processed_keepsakes', processed_count,
        'failed_notifications', 0,
        'timestamp', now(),
        'status', 'completed_fallback',
        'note', 'Emails não foram enviados - usando modo fallback'
    );
    
    RETURN result_json;
END;
$$;

-- Comentários
COMMENT ON FUNCTION send_due_keepsakes() IS 'Função principal para envio de keepsakes com integração de email';
COMMENT ON FUNCTION send_due_keepsakes_fallback() IS 'Função alternativa para ambientes sem extensão http';
COMMENT ON FUNCTION check_http_extension() IS 'Verifica se a extensão http está disponível';