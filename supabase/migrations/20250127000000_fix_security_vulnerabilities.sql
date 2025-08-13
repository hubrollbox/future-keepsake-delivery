-- Fix critical security vulnerabilities
-- Date: 2025-01-27
-- Description: Fix RLS policies for recipients table and add search_path to all functions

-- =============================================================================
-- PART 1: VERIFY AND STRENGTHEN RLS POLICIES FOR RECIPIENTS TABLE
-- =============================================================================

-- Ensure RLS is enabled on recipients table
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;

-- Drop any potentially dangerous policies
DROP POLICY IF EXISTS "Public read access" ON public.recipients;
DROP POLICY IF EXISTS "Allow read access to all" ON public.recipients;
DROP POLICY IF EXISTS "Users can only see their own recipients" ON public.recipients;

-- Create secure policies for recipients table
-- Users can only access recipients for keepsakes they own
CREATE POLICY "recipients_keepsake_owner_access" ON public.recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.keepsakes 
      WHERE keepsakes.id = recipients.keepsake_id 
      AND keepsakes.user_id = auth.uid()
    )
  );

-- Admins can access all recipients
CREATE POLICY "recipients_admin_full_access" ON public.recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- PART 2: FIX FUNCTIONS WITH MISSING search_path PARAMETER
-- =============================================================================

-- Fix send_email function
CREATE OR REPLACE FUNCTION public.send_email(
  recipient_email TEXT,
  subject TEXT,
  content TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  supabase_url TEXT;
  service_role_key TEXT;
  response_status INTEGER;
BEGIN
  -- Obter configurações do ambiente
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- Se as configurações não estiverem disponíveis, usar a Edge Function
  IF supabase_url IS NULL OR service_role_key IS NULL THEN
    -- Log do erro
    INSERT INTO public.cron_job_logs (job_name, result, created_at)
    VALUES ('send_email_error', 'Configurações de ambiente não encontradas', NOW());
    RETURN FALSE;
  END IF;
  
  -- Chamar a Edge Function send-keepsakes para envio do email
  -- Esta é uma implementação simplificada - a lógica real está na Edge Function
  RETURN TRUE;
END;
$$;

-- Fix send_due_capsules function
CREATE OR REPLACE FUNCTION public.send_due_capsules()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  c RECORD;
  email_sent BOOLEAN;
  processed_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Log do início da execução
  INSERT INTO public.cron_job_logs (job_name, result, created_at)
  VALUES ('send_due_capsules_start', 'Iniciando processamento de cápsulas', NOW());
  
  -- Selecionar todas as cápsulas com delivery_date <= NOW() e status = 'pending'
  -- Usando timezone de Portugal (Europe/Lisbon)
  FOR c IN
    SELECT 
      k.id, 
      k.title,
      k.message as content,
      k.delivery_date,
      k.user_id,
      r.email as recipient_email,
      r.name as recipient_name,
      p.full_name as sender_name,
      p.email as sender_email
    FROM public.keepsakes k
    JOIN public.recipients r ON k.id = r.keepsake_id
    JOIN public.profiles p ON k.user_id = p.id
    WHERE k.delivery_date <= (NOW() AT TIME ZONE 'Europe/Lisbon')
      AND k.status = 'pending'
      AND k.type = 'digital'  -- Apenas cápsulas digitais
    ORDER BY k.delivery_date ASC
  LOOP
    BEGIN
      -- Tentar enviar o email
      SELECT public.send_email(
        c.recipient_email, 
        'Sua cápsula do tempo: ' || c.title, 
        c.content
      ) INTO email_sent;
      
      IF email_sent THEN
        -- Atualizar status para 'sent' e definir sent_at
        UPDATE public.keepsakes 
        SET 
          status = 'sent', 
          sent_at = NOW(),
          updated_at = NOW()
        WHERE id = c.id;
        
        -- Criar notificação para o remetente
        INSERT INTO public.notifications (
          user_id,
          title,
          content,
          type,
          status,
          keepsake_id,
          created_at
        ) VALUES (
          c.user_id,
          'Cápsula Enviada',
          'Sua cápsula "' || c.title || '" foi enviada para ' || c.recipient_name,
          'delivery',
          'unread',
          c.id,
          NOW()
        );
        
        processed_count := processed_count + 1;
        
        -- Log de sucesso
        INSERT INTO public.cron_job_logs (job_name, result, created_at)
        VALUES (
          'send_due_capsules_success', 
          'Cápsula ' || c.id || ' enviada com sucesso para ' || c.recipient_email, 
          NOW()
        );
      ELSE
        -- Atualizar status para 'error'
        UPDATE public.keepsakes 
        SET 
          status = 'error',
          updated_at = NOW()
        WHERE id = c.id;
        
        error_count := error_count + 1;
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      -- Em caso de erro, atualizar status para 'error'
      UPDATE public.keepsakes 
      SET 
        status = 'error',
        updated_at = NOW()
      WHERE id = c.id;
      
      error_count := error_count + 1;
      
      -- Log detalhado do erro
      INSERT INTO public.cron_job_logs (job_name, result, created_at)
      VALUES (
        'send_due_capsules_exception', 
        'Exceção ao processar cápsula ' || c.id || ': ' || SQLERRM, 
        NOW()
      );
    END;
  END LOOP;
  
  -- Log final com estatísticas
  INSERT INTO public.cron_job_logs (job_name, result, created_at)
  VALUES (
    'send_due_capsules_complete', 
    'Processamento concluído. Enviadas: ' || processed_count || ', Erros: ' || error_count, 
    NOW()
  );
END;
$$;

-- Fix invoke_send_keepsakes_function
CREATE OR REPLACE FUNCTION public.invoke_send_keepsakes_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  supabase_url text;
  service_role_key text;
  result json;
BEGIN
  -- Obter as variáveis de ambiente do Supabase
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- Chamar a Edge Function usando http_post
  SELECT content::json INTO result
  FROM http_post(
    supabase_url || '/functions/v1/send-keepsakes',
    '{}'::jsonb,
    'application/json',
    ARRAY[
      ('Authorization', 'Bearer ' || service_role_key)::http_header
    ]
  );
  
  -- Registrar o resultado
  INSERT INTO public.cron_job_logs (job_name, result, created_at)
  VALUES ('process-keepsakes-daily', result::text, now());
  
  RETURN;
END;
$$;

-- Fix invoke_send_keepsakes_edge_function
CREATE OR REPLACE FUNCTION public.invoke_send_keepsakes_edge_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  supabase_url TEXT;
  service_role_key TEXT;
  response RECORD;
BEGIN
  -- Obter as variáveis de ambiente do Supabase
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- Verificar se as configurações estão disponíveis
  IF supabase_url IS NULL OR service_role_key IS NULL THEN
    -- Usar a função SQL como fallback
    PERFORM public.send_due_capsules();
    RETURN;
  END IF;
  
  -- Tentar chamar a Edge Function
  BEGIN
    SELECT * INTO response
    FROM http_post(
      supabase_url || '/functions/v1/send-keepsakes',
      '{}'::jsonb,
      'application/json',
      ARRAY[
        ('Authorization', 'Bearer ' || service_role_key)::http_header
      ]
    );
    
    -- Registrar o resultado
    INSERT INTO public.cron_job_logs (job_name, result, created_at)
    VALUES (
      'invoke_edge_function', 
      'Edge Function chamada. Status: ' || response.status || ', Response: ' || COALESCE(response.content, 'null'), 
      NOW()
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Se a Edge Function falhar, usar a função SQL como fallback
    INSERT INTO public.cron_job_logs (job_name, result, created_at)
    VALUES (
      'invoke_edge_function_fallback', 
      'Edge Function falhou, usando fallback SQL: ' || SQLERRM, 
      NOW()
    );
    
    -- Executar a função SQL como fallback
    PERFORM public.send_due_capsules();
  END;
END;
$$;

-- Fix handle_new_user function (ensure it has proper search_path)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  RAISE NOTICE 'handle_new_user triggered for user: %', NEW.id;
  RAISE NOTICE 'full_name: %, email: %, avatar_url: %', NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url';
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- =============================================================================
-- PART 3: VERIFY EXISTING SECURITY FUNCTIONS HAVE PROPER search_path
-- =============================================================================

-- Ensure is_admin_user function has proper search_path (already fixed in previous migrations)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Ensure get_current_user_role function has proper search_path (already fixed in previous migrations)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(role, 'user') 
  FROM public.admin_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- =============================================================================
-- PART 4: ADD COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON FUNCTION public.send_email(TEXT, TEXT, TEXT) IS 'Secure function for sending emails with proper search_path';
COMMENT ON FUNCTION public.send_due_capsules() IS 'Secure function for processing due capsules with proper search_path';
COMMENT ON FUNCTION public.invoke_send_keepsakes_function() IS 'Secure function for invoking keepsakes processing with proper search_path';
COMMENT ON FUNCTION public.invoke_send_keepsakes_edge_function() IS 'Secure function for invoking edge function with proper search_path';
COMMENT ON FUNCTION public.handle_new_user() IS 'Secure trigger function for new user creation with proper search_path';
COMMENT ON FUNCTION public.is_admin_user() IS 'Secure function for admin verification with proper search_path';
COMMENT ON FUNCTION public.get_current_user_role() IS 'Secure function for role retrieval with proper search_path';

-- Log the security fixes
INSERT INTO public.cron_job_logs (job_name, result, created_at)
VALUES (
  'security_fixes_applied', 
  'RLS policies strengthened for recipients table and search_path fixed for all functions', 
  NOW()
);