-- Fix search_path for all SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.is_admin_secure()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_profile_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid, required_permission text DEFAULT 'admin'::text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = uid AND (role = 'admin' OR permissions @> jsonb_build_array(required_permission))
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = uid AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT COALESCE(role, 'user') 
  FROM public.admin_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_level()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_level(points integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.send_due_deliveries()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_recipient_stats_secure()
 RETURNS TABLE(total_recipients bigint, recent_recipients bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Only allow admins to access recipient statistics
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_recipients,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_recipients
  FROM public.recipients;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    UPDATE public.profiles
    SET total_points = NEW.total_points,
        level = NEW.level,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_quest_progress()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Quest progress tracking logic would go here
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_stats_from_achievement()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.user_stats (user_id, total_achievements, last_updated)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_achievements = user_stats.total_achievements + 1,
    last_updated = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_stats_from_quest()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.user_stats (user_id, total_quests_completed, last_updated)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_quests_completed = user_stats.total_quests_completed + 1,
    last_updated = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_recipient_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Validate email format
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format for recipient';
  END IF;
  
  -- Validate phone format (basic validation)
  IF NEW.phone IS NOT NULL AND LENGTH(NEW.phone) > 0 AND NEW.phone !~ '^[\+]?[0-9\s\-\(\)]{7,20}$' THEN
    RAISE EXCEPTION 'Invalid phone format for recipient';
  END IF;
  
  -- Ensure required fields
  IF NEW.name IS NULL OR LENGTH(trim(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Recipient name is required';
  END IF;
  
  -- Sanitize name (remove potentially dangerous characters)
  NEW.name = regexp_replace(NEW.name, '[<>\"''&]', '', 'g');
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_recipient_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Log access to sensitive recipient data
  PERFORM public.log_security_event(
    auth.uid(),
    TG_OP,
    'recipients',
    COALESCE(NEW.id::text, OLD.id::text),
    NULL,
    NULL,
    true,
    NULL,
    jsonb_build_object(
      'recipient_name', COALESCE(NEW.name, OLD.name),
      'keepsake_id', COALESCE(NEW.keepsake_id, OLD.keepsake_id)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RAISE NOTICE 'handle_new_user triggered for user: %', NEW.id;
  RAISE NOTICE 'full_name: %, email: %, avatar_url: %', NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url';
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_points_from_achievement()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  achievement_points INTEGER;
BEGIN
  SELECT points INTO achievement_points FROM public.achievements WHERE id = NEW.achievement_id;
  UPDATE public.profiles
  SET total_points = total_points + achievement_points,
      level = public.calculate_level(total_points + achievement_points)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_points_from_quest_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  quest_reward INTEGER;
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    SELECT reward INTO quest_reward FROM public.quests WHERE id = NEW.quest_id;
    UPDATE public.profiles
    SET total_points = total_points + quest_reward,
        level = public.calculate_level(total_points + quest_reward)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_user_quest_progress_on_action()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Quest progress increment logic would go here
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_security_event(p_user_id uuid, p_action text, p_resource_type text DEFAULT NULL::text, p_resource_id text DEFAULT NULL::text, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_success boolean DEFAULT true, p_error_message text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, resource_type, resource_id, ip_address, 
    user_agent, success, error_message, metadata
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_ip_address,
    p_user_agent, p_success, p_error_message, p_metadata
  );
END;
$function$;

-- Create user_sessions_public view (without session_token)
CREATE OR REPLACE VIEW public.user_sessions_public AS
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

-- Revoke direct access to user_sessions table for authenticated users
REVOKE SELECT ON public.user_sessions FROM authenticated;

-- Keep service_role access for edge functions
GRANT ALL ON public.user_sessions TO service_role;

-- Add database-backed rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint text NOT NULL,
  client_ip inet NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(endpoint, client_ip, window_start)
);

-- Enable RLS on rate_limit_tracking
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role can manage rate limits" ON public.rate_limit_tracking
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add is_public column to keepsakes for public sharing
ALTER TABLE public.keepsakes ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Enable leaked password protection in auth settings
UPDATE auth.config SET 
  enable_leaked_password_protection = true
WHERE true;