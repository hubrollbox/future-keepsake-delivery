-- Fix security definer view by dropping and recreating as a regular view
DROP VIEW IF EXISTS public.user_sessions_public;

CREATE VIEW public.user_sessions_public AS
SELECT 
  id,
  user_id,
  created_at,
  last_accessed,
  ip_address,
  user_agent,
  expires_at
FROM public.user_sessions;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.user_sessions_public TO authenticated;

-- Fix remaining functions without search_path (there may be some we missed)
CREATE OR REPLACE FUNCTION public.send_due_keepsakes()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
    ks RECORD;
BEGIN
    FOR ks IN
        SELECT id, recipient_email, content
        FROM keepsakes
        WHERE status = 'pending'
          AND delivery_date <= now()
    LOOP
        -- Chamar função de envio de email (deve existir no backend)
        PERFORM send_email(ks.recipient_email, 'A sua cápsula chegou!', ks.content);

        -- Atualizar estado
        UPDATE keepsakes
        SET status = 'sent',
            sent_at = now()
        WHERE id = ks.id;
    END LOOP;
END;
$function$;