CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname='keepla-keepsake-reminders-hourly') THEN
    PERFORM cron.unschedule('keepla-keepsake-reminders-hourly');
  END IF;
END $$;

SELECT cron.schedule(
  'keepla-keepsake-reminders-hourly',
  '0 * * * *',
  $cron$
  SELECT net.http_post(
    url:='https://mlxmymmoysbtnvcehggn.supabase.co/functions/v1/send-keepsake-reminders',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seG15bW1veXNidG52Y2VoZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM1MzIsImV4cCI6MjA2NTE3OTUzMn0.NWN13hyHErwzxD-9mW3U4v3S5kDBkSt5d0O49Eol90o"}'::jsonb,
    body:='{}'::jsonb
  );
  $cron$
);