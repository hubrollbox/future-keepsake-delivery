-- Adiciona um cron job para processar keepsakes agendadas diariamente

-- Verifica se a extensão pg_cron está instalada
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Concede permissões necessárias
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Remove o job se já existir (para atualizações)
SELECT cron.unschedule('process-keepsakes-daily');

-- Cria uma função que invoca a Edge Function
CREATE OR REPLACE FUNCTION public.invoke_send_keepsakes_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Cria uma tabela para registrar os logs do cron job
CREATE TABLE IF NOT EXISTS public.cron_job_logs (
  id SERIAL PRIMARY KEY,
  job_name TEXT NOT NULL,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Adiciona índices para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS cron_job_logs_job_name_idx ON public.cron_job_logs (job_name);
CREATE INDEX IF NOT EXISTS cron_job_logs_created_at_idx ON public.cron_job_logs (created_at);

-- Configura o cron job para executar todos os dias às 00:05
SELECT cron.schedule(
  'process-keepsakes-daily',
  '5 0 * * *',  -- Executa às 00:05 todos os dias
  $$SELECT public.invoke_send_keepsakes_function()$$
);

-- Adiciona comentários para documentação
COMMENT ON FUNCTION public.invoke_send_keepsakes_function() IS 'Função que invoca a Edge Function send-keepsakes para processar keepsakes agendadas';
COMMENT ON TABLE public.cron_job_logs IS 'Registros de execução dos cron jobs';