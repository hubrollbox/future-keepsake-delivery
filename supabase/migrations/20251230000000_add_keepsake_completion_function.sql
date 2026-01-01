-- Função RPC para executar operações atômicas de conclusão de keepsake
-- Esta função garante que a atualização do status e criação de notificação sejam atômicas

CREATE OR REPLACE FUNCTION execute_keepsake_completion(
  p_keepsake_id UUID,
  p_status TEXT,
  p_sent_at TIMESTAMPTZ,
  p_user_id UUID,
  p_title TEXT,
  p_failed_emails INTEGER DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_title TEXT;
  notification_content TEXT;
  result JSON;
BEGIN
  -- Iniciar transação implícita (função já roda em transação)
  
  -- Atualizar status da keepsake
  UPDATE keepsakes 
  SET 
    status = p_status,
    sent_at = p_sent_at,
    updated_at = p_sent_at
  WHERE id = p_keepsake_id;
  
  -- Verificar se a atualização foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Keepsake com ID % não encontrada', p_keepsake_id;
  END IF;
  
  -- Preparar conteúdo da notificação baseado no status
  IF p_status = 'sent' THEN
    notification_title := 'Mensagem entregue';
    notification_content := format('Sua mensagem "%s" foi entregue com sucesso.', p_title);
  ELSIF p_status = 'partial_sent' THEN
    notification_title := 'Mensagem parcialmente entregue';
    notification_content := format('Sua mensagem "%s" foi parcialmente entregue. %s email(s) falharam.', p_title, p_failed_emails);
  ELSE
    notification_title := 'Status da mensagem atualizado';
    notification_content := format('O status da sua mensagem "%s" foi atualizado para: %s', p_title, p_status);
  END IF;
  
  -- Criar notificação para o usuário
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type,
    status,
    keepsake_id,
    created_at
  ) VALUES (
    p_user_id,
    notification_title,
    notification_content,
    'keepsake_delivery',
    'unread',
    p_keepsake_id,
    NOW()
  );
  
  -- Preparar resultado
  result := json_build_object(
    'success', true,
    'keepsake_id', p_keepsake_id,
    'status', p_status,
    'notification_created', true,
    'failed_emails', p_failed_emails
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, a transação será automaticamente revertida
    RAISE EXCEPTION 'Erro ao executar operações atômicas: %', SQLERRM;
END;
$$;

-- Comentário da função
COMMENT ON FUNCTION execute_keepsake_completion IS 'Executa operações atômicas para conclusão de keepsake: atualiza status e cria notificação';

-- Garantir que apenas o service role pode executar esta função
REVOKE ALL ON FUNCTION execute_keepsake_completion FROM PUBLIC;
GRANT EXECUTE ON FUNCTION execute_keepsake_completion TO service_role;