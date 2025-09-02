-- Fix remaining functions with search_path issues
-- Update all remaining functions to have proper search_path

CREATE OR REPLACE FUNCTION public.calculate_level(points integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  level_result integer;
BEGIN
  IF points < 100 THEN
    level_result := 1;
  ELSIF points < 300 THEN
    level_result := 2;
  ELSIF points < 600 THEN
    level_result := 3;
  ELSE
    level_result := 4;
  END IF;

  RETURN level_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_level()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  user_points integer;
BEGIN
  SELECT total_points INTO user_points
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN CASE
    WHEN user_points < 100 THEN 1
    WHEN user_points < 500 THEN 2
    WHEN user_points < 2000 THEN 3
    ELSE 4
  END;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = uid AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid, required_permission text DEFAULT 'admin'::text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = uid AND (role = 'admin' OR permissions @> jsonb_build_array(required_permission))
  );
$$;

CREATE OR REPLACE FUNCTION public.send_due_deliveries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
declare
  item record;
  webhook_url text := 'https://mlxmymmoysbtnvcehggn.supabase.co/functions/v1/send-deliveries';
begin
  for item in
    select * from public.deliveries
    where delivery_date <= now()
      and status = 'scheduled'
      and recipient_id is not null
  loop
    perform public.log_security_event(
      item.user_id,
      'delivery_sent',
      'deliveries',
      item.id::text,
      null,
      null,
      true,
      null,
      jsonb_build_object('delivery_date', item.delivery_date, 'type', item.type)
    );

    update public.deliveries
    set status = 'sent',
        updated_at = now()
    where id = item.id;
  end loop;
end;
$$;