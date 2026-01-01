-- Migration: Create Tests for Keepsake Functionality
-- Date: 2025-01-30
-- Description: Testes para validar funcionalidades de keepsakes e notificações

-- 1. FUNÇÃO DE TESTE PRINCIPAL
CREATE OR REPLACE FUNCTION run_keepsake_tests()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    test_results json[];
    test_result json;
    test_user_id uuid;
    test_keepsake_id uuid;
    test_recipient_id uuid;
    test_profile_id uuid;
    total_tests integer := 0;
    passed_tests integer := 0;
BEGIN
    -- Inicializar array de resultados
    test_results := ARRAY[]::json[];
    
    -- TESTE 1: Criar cápsula com data no passado → envio imediato
    BEGIN
        total_tests := total_tests + 1;
        
        -- Criar perfil de teste
        INSERT INTO profiles (id, full_name, email, created_at)
        VALUES (gen_random_uuid(), 'Teste User', 'teste@example.com', now())
        RETURNING id INTO test_user_id;
        
        -- Criar cápsula com data no passado
        INSERT INTO keepsakes (id, user_id, sender_id, title, message_content, delivery_date, status, created_at)
        VALUES (
            gen_random_uuid(), 
            test_user_id, 
            test_user_id, 
            'Teste Passado', 
            'Mensagem de teste com data passada', 
            CURRENT_DATE - INTERVAL '1 day', 
            'scheduled', 
            now()
        )
        RETURNING id INTO test_keepsake_id;
        
        -- Criar destinatário
        INSERT INTO recipients (id, keepsake_id, name, email, created_at)
        VALUES (
            gen_random_uuid(),
            test_keepsake_id,
            'Destinatário Teste',
            'destinatario@example.com',
            now()
        )
        RETURNING id INTO test_recipient_id;
        
        -- Executar função de processamento
        PERFORM process_immediate_keepsakes();
        
        -- Verificar se status mudou para 'pending' ou 'sent'
        IF EXISTS (
            SELECT 1 FROM keepsakes 
            WHERE id = test_keepsake_id 
                AND status IN ('pending', 'sent')
        ) THEN
            test_result := json_build_object(
                'test_name', 'Cápsula com data passada',
                'status', 'PASSED',
                'message', 'Cápsula processada corretamente'
            );
            passed_tests := passed_tests + 1;
        ELSE
            test_result := json_build_object(
                'test_name', 'Cápsula com data passada',
                'status', 'FAILED',
                'message', 'Cápsula não foi processada'
            );
        END IF;
        
        test_results := test_results || test_result;
        
    EXCEPTION WHEN OTHERS THEN
        test_result := json_build_object(
            'test_name', 'Cápsula com data passada',
            'status', 'ERROR',
            'message', SQLERRM
        );
        test_results := test_results || test_result;
    END;
    
    -- TESTE 2: Criar cápsula com data futura → deve ficar agendada
    BEGIN
        total_tests := total_tests + 1;
        
        -- Criar cápsula com data futura
        INSERT INTO keepsakes (id, user_id, sender_id, title, message_content, delivery_date, status, created_at)
        VALUES (
            gen_random_uuid(), 
            test_user_id, 
            test_user_id, 
            'Teste Futuro', 
            'Mensagem de teste com data futura', 
            CURRENT_DATE + INTERVAL '7 days', 
            'scheduled', 
            now()
        )
        RETURNING id INTO test_keepsake_id;
        
        -- Criar destinatário
        INSERT INTO recipients (id, keepsake_id, name, email, created_at)
        VALUES (
            gen_random_uuid(),
            test_keepsake_id,
            'Destinatário Futuro',
            'futuro@example.com',
            now()
        );
        
        -- Executar função de processamento
        PERFORM process_immediate_keepsakes();
        
        -- Verificar se status permanece 'scheduled'
        IF EXISTS (
            SELECT 1 FROM keepsakes 
            WHERE id = test_keepsake_id 
                AND status = 'scheduled'
        ) THEN
            test_result := json_build_object(
                'test_name', 'Cápsula com data futura',
                'status', 'PASSED',
                'message', 'Cápsula permanece agendada corretamente'
            );
            passed_tests := passed_tests + 1;
        ELSE
            test_result := json_build_object(
                'test_name', 'Cápsula com data futura',
                'status', 'FAILED',
                'message', 'Cápsula não deveria ter sido processada'
            );
        END IF;
        
        test_results := test_results || test_result;
        
    EXCEPTION WHEN OTHERS THEN
        test_result := json_build_object(
            'test_name', 'Cápsula com data futura',
            'status', 'ERROR',
            'message', SQLERRM
        );
        test_results := test_results || test_result;
    END;
    
    -- TESTE 3: Apagar perfil → keepsakes e notificações associadas são removidas
    BEGIN
        total_tests := total_tests + 1;
        
        -- Criar novo perfil para teste de deleção
        INSERT INTO profiles (id, full_name, email, created_at)
        VALUES (gen_random_uuid(), 'Perfil Delete', 'delete@example.com', now())
        RETURNING id INTO test_profile_id;
        
        -- Criar cápsula associada
        INSERT INTO keepsakes (id, user_id, sender_id, title, message_content, delivery_date, status, created_at)
        VALUES (
            gen_random_uuid(), 
            test_profile_id, 
            test_profile_id, 
            'Teste Delete', 
            'Mensagem para teste de deleção', 
            CURRENT_DATE, 
            'pending', 
            now()
        )
        RETURNING id INTO test_keepsake_id;
        
        -- Criar destinatário
        INSERT INTO recipients (id, keepsake_id, name, email, created_at)
        VALUES (
            gen_random_uuid(),
            test_keepsake_id,
            'Destinatário Delete',
            'delete-dest@example.com',
            now()
        )
        RETURNING id INTO test_recipient_id;
        
        -- Criar notificação
        INSERT INTO unified_notifications (keepsake_id, recipient_id, status, scheduled_for)
        VALUES (test_keepsake_id, test_recipient_id, 'pending', now());
        
        -- Deletar perfil (deve cascatear)
        DELETE FROM profiles WHERE id = test_profile_id;
        
        -- Verificar se keepsakes e notificações foram removidas
        IF NOT EXISTS (SELECT 1 FROM keepsakes WHERE id = test_keepsake_id)
           AND NOT EXISTS (SELECT 1 FROM unified_notifications WHERE keepsake_id = test_keepsake_id) THEN
            test_result := json_build_object(
                'test_name', 'Deleção em cascata',
                'status', 'PASSED',
                'message', 'Keepsakes e notificações removidas corretamente'
            );
            passed_tests := passed_tests + 1;
        ELSE
            test_result := json_build_object(
                'test_name', 'Deleção em cascata',
                'status', 'FAILED',
                'message', 'Registros não foram removidos em cascata'
            );
        END IF;
        
        test_results := test_results || test_result;
        
    EXCEPTION WHEN OTHERS THEN
        test_result := json_build_object(
            'test_name', 'Deleção em cascata',
            'status', 'ERROR',
            'message', SQLERRM
        );
        test_results := test_results || test_result;
    END;
    
    -- TESTE 4: Garantir que nenhuma cápsula com data passada fica em pending
    BEGIN
        total_tests := total_tests + 1;
        
        -- Criar cápsula com data passada e status pending
        INSERT INTO keepsakes (id, user_id, sender_id, title, message_content, delivery_date, status, created_at)
        VALUES (
            gen_random_uuid(), 
            test_user_id, 
            test_user_id, 
            'Teste Pending Passado', 
            'Não deve ficar pending', 
            CURRENT_DATE - INTERVAL '2 days', 
            'pending', 
            now()
        )
        RETURNING id INTO test_keepsake_id;
        
        -- Criar destinatário
        INSERT INTO recipients (id, keepsake_id, name, email, created_at)
        VALUES (
            gen_random_uuid(),
            test_keepsake_id,
            'Destinatário Pending',
            'pending@example.com',
            now()
        );
        
        -- Executar função de envio
        PERFORM send_due_keepsakes_fallback();
        
        -- Verificar se não há cápsulas pending com data passada
        IF NOT EXISTS (
            SELECT 1 FROM keepsakes 
            WHERE delivery_date < CURRENT_DATE 
                AND status = 'pending'
        ) THEN
            test_result := json_build_object(
                'test_name', 'Sem pending com data passada',
                'status', 'PASSED',
                'message', 'Nenhuma cápsula pending com data passada encontrada'
            );
            passed_tests := passed_tests + 1;
        ELSE
            test_result := json_build_object(
                'test_name', 'Sem pending com data passada',
                'status', 'FAILED',
                'message', 'Existem cápsulas pending com data passada'
            );
        END IF;
        
        test_results := test_results || test_result;
        
    EXCEPTION WHEN OTHERS THEN
        test_result := json_build_object(
            'test_name', 'Sem pending com data passada',
            'status', 'ERROR',
            'message', SQLERRM
        );
        test_results := test_results || test_result;
    END;
    
    -- TESTE 5: Verificar integridade das chaves estrangeiras
    BEGIN
        total_tests := total_tests + 1;
        
        -- Tentar inserir keepsake com sender_id inválido (deve falhar)
        BEGIN
            INSERT INTO keepsakes (id, user_id, sender_id, title, message_content, delivery_date, status)
            VALUES (
                gen_random_uuid(), 
                test_user_id, 
                gen_random_uuid(), -- ID inválido
                'Teste FK', 
                'Deve falhar', 
                CURRENT_DATE, 
                'scheduled'
            );
            
            -- Se chegou aqui, o teste falhou
            test_result := json_build_object(
                'test_name', 'Integridade chaves estrangeiras',
                'status', 'FAILED',
                'message', 'Constraint de FK não está funcionando'
            );
            
        EXCEPTION WHEN foreign_key_violation THEN
            -- Esperado - constraint funcionando
            test_result := json_build_object(
                'test_name', 'Integridade chaves estrangeiras',
                'status', 'PASSED',
                'message', 'Constraints de FK funcionando corretamente'
            );
            passed_tests := passed_tests + 1;
        END;
        
        test_results := test_results || test_result;
        
    EXCEPTION WHEN OTHERS THEN
        test_result := json_build_object(
            'test_name', 'Integridade chaves estrangeiras',
            'status', 'ERROR',
            'message', SQLERRM
        );
        test_results := test_results || test_result;
    END;
    
    -- Limpeza dos dados de teste
    BEGIN
        DELETE FROM profiles WHERE email LIKE '%@example.com';
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erros de limpeza
        NULL;
    END;
    
    -- Retornar resultados
    RETURN json_build_object(
        'total_tests', total_tests,
        'passed_tests', passed_tests,
        'failed_tests', total_tests - passed_tests,
        'success_rate', ROUND((passed_tests::decimal / total_tests::decimal) * 100, 2),
        'timestamp', now(),
        'results', array_to_json(test_results)
    );
END;
$$;

-- 2. FUNÇÃO PARA TESTE DE PERFORMANCE
CREATE OR REPLACE FUNCTION test_keepsake_performance()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    duration_ms integer;
    test_user_id uuid;
    i integer;
BEGIN
    -- Criar usuário de teste
    INSERT INTO profiles (id, full_name, email, created_at)
    VALUES (gen_random_uuid(), 'Performance Test', 'perf@example.com', now())
    RETURNING id INTO test_user_id;
    
    start_time := clock_timestamp();
    
    -- Criar 100 keepsakes com data passada
    FOR i IN 1..100 LOOP
        INSERT INTO keepsakes (id, user_id, sender_id, title, message_content, delivery_date, status, created_at)
        VALUES (
            gen_random_uuid(), 
            test_user_id, 
            test_user_id, 
            'Performance Test ' || i, 
            'Mensagem de teste de performance número ' || i, 
            CURRENT_DATE - INTERVAL '1 day', 
            'pending', 
            now()
        );
        
        -- Criar destinatário para cada keepsake
        INSERT INTO recipients (keepsake_id, name, email, created_at)
        SELECT k.id, 'Destinatário ' || i, 'dest' || i || '@example.com', now()
        FROM keepsakes k 
        WHERE k.title = 'Performance Test ' || i;
    END LOOP;
    
    -- Executar função de envio
    PERFORM send_due_keepsakes_fallback();
    
    end_time := clock_timestamp();
    duration_ms := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    
    -- Limpeza
    DELETE FROM profiles WHERE id = test_user_id;
    
    RETURN json_build_object(
        'test_name', 'Performance Test',
        'keepsakes_processed', 100,
        'duration_ms', duration_ms,
        'avg_ms_per_keepsake', ROUND(duration_ms::decimal / 100, 2),
        'timestamp', now()
    );
END;
$$;

-- 3. FUNÇÃO PARA VALIDAR ESTRUTURA DAS TABELAS
CREATE OR REPLACE FUNCTION validate_table_structure()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    validation_results json[];
    validation_result json;
    total_validations integer := 0;
    passed_validations integer := 0;
BEGIN
    validation_results := ARRAY[]::json[];
    
    -- Validar existência da tabela unified_notifications
    total_validations := total_validations + 1;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'unified_notifications') THEN
        validation_result := json_build_object(
            'validation', 'Tabela unified_notifications existe',
            'status', 'PASSED'
        );
        passed_validations := passed_validations + 1;
    ELSE
        validation_result := json_build_object(
            'validation', 'Tabela unified_notifications existe',
            'status', 'FAILED'
        );
    END IF;
    validation_results := validation_results || validation_result;
    
    -- Validar índice em scheduled_for
    total_validations := total_validations + 1;
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'unified_notifications' 
            AND indexname = 'idx_unified_notifications_scheduled_for'
    ) THEN
        validation_result := json_build_object(
            'validation', 'Índice em scheduled_for existe',
            'status', 'PASSED'
        );
        passed_validations := passed_validations + 1;
    ELSE
        validation_result := json_build_object(
            'validation', 'Índice em scheduled_for existe',
            'status', 'FAILED'
        );
    END IF;
    validation_results := validation_results || validation_result;
    
    -- Validar constraints de chave estrangeira
    total_validations := total_validations + 1;
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'keepsakes_sender_id_fkey'
            AND table_name = 'keepsakes'
    ) THEN
        validation_result := json_build_object(
            'validation', 'FK keepsakes.sender_id existe',
            'status', 'PASSED'
        );
        passed_validations := passed_validations + 1;
    ELSE
        validation_result := json_build_object(
            'validation', 'FK keepsakes.sender_id existe',
            'status', 'FAILED'
        );
    END IF;
    validation_results := validation_results || validation_result;
    
    -- Validar existência das funções
    total_validations := total_validations + 1;
    IF EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'send_due_keepsakes'
    ) THEN
        validation_result := json_build_object(
            'validation', 'Função send_due_keepsakes existe',
            'status', 'PASSED'
        );
        passed_validations := passed_validations + 1;
    ELSE
        validation_result := json_build_object(
            'validation', 'Função send_due_keepsakes existe',
            'status', 'FAILED'
        );
    END IF;
    validation_results := validation_results || validation_result;
    
    RETURN json_build_object(
        'total_validations', total_validations,
        'passed_validations', passed_validations,
        'failed_validations', total_validations - passed_validations,
        'success_rate', ROUND((passed_validations::decimal / total_validations::decimal) * 100, 2),
        'timestamp', now(),
        'results', array_to_json(validation_results)
    );
END;
$$;

-- 4. FUNÇÃO PARA EXECUTAR TODOS OS TESTES
CREATE OR REPLACE FUNCTION run_all_tests()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    functional_tests json;
    performance_tests json;
    structure_validation json;
BEGIN
    -- Executar todos os tipos de teste
    SELECT run_keepsake_tests() INTO functional_tests;
    SELECT test_keepsake_performance() INTO performance_tests;
    SELECT validate_table_structure() INTO structure_validation;
    
    RETURN json_build_object(
        'test_suite', 'Keepsake Complete Test Suite',
        'timestamp', now(),
        'functional_tests', functional_tests,
        'performance_tests', performance_tests,
        'structure_validation', structure_validation
    );
END;
$$;

-- Comentários
COMMENT ON FUNCTION run_keepsake_tests() IS 'Executa testes funcionais das keepsakes';
COMMENT ON FUNCTION test_keepsake_performance() IS 'Testa performance do sistema de keepsakes';
COMMENT ON FUNCTION validate_table_structure() IS 'Valida estrutura das tabelas e constraints';
COMMENT ON FUNCTION run_all_tests() IS 'Executa todos os testes do sistema de keepsakes';