-- Fix functions without search_path set
-- This prevents potential SQL injection via search_path manipulation

-- First, get trigger info for recreation
-- Drop triggers and functions, then recreate

-- 1. Drop trigger for on_blog_view before dropping function
DROP TRIGGER IF EXISTS trigger_blog_gamification ON public.blog_posts;

-- 2. Drop trigger for on_keepsake_created before dropping function  
DROP TRIGGER IF EXISTS trigger_keepsake_gamification ON public.keepsakes;

-- 3. Fix on_blog_view function
CREATE OR REPLACE FUNCTION public.on_blog_view()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  IF (old.views < new.views) THEN
    PERFORM public.handle_gamification_action(new.author_id, 'blog_visit');
  END IF;
  RETURN new;
END;
$function$;

-- 4. Fix on_keepsake_created function
CREATE OR REPLACE FUNCTION public.on_keepsake_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  PERFORM public.handle_gamification_action(new.user_id, 'content_view');
  RETURN new;
END;
$function$;

-- 5. Recreate triggers
CREATE TRIGGER trigger_blog_gamification
  AFTER UPDATE OF views ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.on_blog_view();

CREATE TRIGGER trigger_keepsake_gamification
  AFTER INSERT ON public.keepsakes
  FOR EACH ROW
  EXECUTE FUNCTION public.on_keepsake_created();

-- 6. Fix add_points function (returns jsonb) - use CREATE OR REPLACE with ALTER
CREATE OR REPLACE FUNCTION public.add_points(p_user_id uuid, p_action_type text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $function$
DECLARE
    v_rule RECORD;
    v_points_to_add INTEGER;
    v_today_count INTEGER;
    v_last_event_time TIMESTAMPTZ;
    v_new_total INTEGER;
    v_current_streak INTEGER;
    v_last_activity DATE;
    v_streak_bonus INTEGER := 0;
    v_streak_message TEXT := '';
BEGIN
    SELECT * INTO v_rule FROM public.point_rules WHERE action_type = p_action_type AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or inactive action type');
    END IF;

    v_points_to_add := v_rule.points;

    IF v_rule.daily_limit IS NOT NULL THEN
        SELECT COUNT(*) INTO v_today_count 
        FROM public.point_events 
        WHERE user_id = p_user_id 
          AND action_type = p_action_type 
          AND created_at >= CURRENT_DATE;

        IF v_today_count >= v_rule.daily_limit THEN
            RETURN jsonb_build_object('success', false, 'message', 'Daily limit reached');
        END IF;
    END IF;

    IF v_rule.min_interval_seconds > 0 THEN
        SELECT created_at INTO v_last_event_time
        FROM public.point_events
        WHERE user_id = p_user_id 
          AND action_type = p_action_type 
        ORDER BY created_at DESC 
        LIMIT 1;

        IF v_last_event_time IS NOT NULL AND (EXTRACT(EPOCH FROM (NOW() - v_last_event_time)) < v_rule.min_interval_seconds) THEN
            RETURN jsonb_build_object('success', false, 'message', 'Too fast');
        END IF;
    END IF;

    INSERT INTO public.user_stats (user_id, last_activity_date)
    VALUES (p_user_id, CURRENT_DATE - INTERVAL '1 day')
    ON CONFLICT (user_id) DO NOTHING;

    IF p_action_type = 'daily_login' OR p_action_type = 'blog_visit' THEN
        SELECT last_activity_date, current_streak INTO v_last_activity, v_current_streak
        FROM public.user_stats
        WHERE user_id = p_user_id;

        IF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
            v_current_streak := v_current_streak + 1;
            
            IF v_current_streak = 7 THEN
                PERFORM public.add_points(p_user_id, 'streak_7');
                v_streak_message := ' + Streak 7 days!';
            ELSIF v_current_streak = 30 THEN
                PERFORM public.add_points(p_user_id, 'streak_30');
                v_streak_message := ' + Streak 30 days!';
            ELSIF v_current_streak = 90 THEN
                PERFORM public.add_points(p_user_id, 'streak_90');
            ELSIF v_current_streak = 180 THEN
                PERFORM public.add_points(p_user_id, 'streak_180');
            ELSIF v_current_streak = 365 THEN
                PERFORM public.add_points(p_user_id, 'streak_365');
            END IF;

        ELSIF v_last_activity < CURRENT_DATE - INTERVAL '1 day' THEN
            v_current_streak := 1;
        ELSE
            v_current_streak := v_current_streak;
        END IF;

        UPDATE public.user_stats 
        SET last_activity_date = CURRENT_DATE,
            current_streak = v_current_streak,
            longest_streak = GREATEST(longest_streak, v_current_streak),
            updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;

    INSERT INTO public.point_events (user_id, action_type, points, metadata)
    VALUES (p_user_id, p_action_type, v_points_to_add, p_metadata);

    UPDATE public.user_stats
    SET total_points = total_points + v_points_to_add,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING total_points INTO v_new_total;

    RETURN jsonb_build_object(
        'success', true, 
        'points_added', v_points_to_add, 
        'new_total', v_new_total,
        'message', 'Points added successfully' || v_streak_message
    );
END;
$function$;

-- 7. Fix calculate_level function (the overloaded version with integer argument)
CREATE OR REPLACE FUNCTION public.calculate_level(points integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  IF points < 100 THEN
      RETURN 1;
  ELSIF points < 500 THEN
      RETURN 2;
  ELSIF points < 2000 THEN
      RETURN 3;
  ELSE
      RETURN 4;
  END IF;
END;
$function$;

-- 8. Fix process_due_keepsakes function
CREATE OR REPLACE FUNCTION public.process_due_keepsakes()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE public.keepsakes
  SET
    status = 'released',
    sent_at = now(),
    updated_at = now()
  WHERE
    status = 'scheduled'
    AND delivery_date <= now();

  UPDATE public.scheduled_notifications sn
  SET
    status = 'sent',
    sent_at = now()
  FROM public.keepsakes k
  WHERE
    sn.keepsake_id = k.id
    AND k.status = 'released'
    AND sn.status = 'pending';
END;
$function$;

-- 9. Fix send_due_notifications_job function
CREATE OR REPLACE FUNCTION public.send_due_notifications_job()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public', 'pg_temp'
AS $function$
DECLARE
    rec record;
BEGIN
    FOR rec IN
        SELECT * 
        FROM public.scheduled_notifications
        WHERE status = 'pending' 
          AND delivery_date <= now()
    LOOP
        BEGIN
            PERFORM http_post(
                'https://future-keepsake-delivery.functions.supabase.co/send_due_notifications',
                json_build_object(
                    'notification_id', rec.id,
                    'user_email', rec.user_email,
                    'keepsake_id', rec.keepsake_id
                )::text
            );

            UPDATE public.scheduled_notifications
            SET status = 'sent',
                sent_at = now()
            WHERE id = rec.id;

        EXCEPTION WHEN OTHERS THEN
            UPDATE public.scheduled_notifications
            SET status = 'error'
            WHERE id = rec.id;

            INSERT INTO public.security_audit_log(
                user_id,
                action,
                resource_type,
                resource_id,
                error_message,
                created_at
            ) VALUES (
                rec.user_id,
                'send_due_notification',
                'scheduled_notifications',
                rec.id::text,
                SQLERRM,
                now()
            );
        END;
    END LOOP;
END;
$function$;

-- 10. Add author_name column to blog_posts to avoid exposing author_id UUID publicly
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS author_name text DEFAULT 'Equipa Keepla';

-- Update existing posts with author name from profiles if possible
UPDATE public.blog_posts bp
SET author_name = COALESCE(
  (SELECT full_name FROM profiles WHERE id = bp.author_id),
  'Equipa Keepla'
)
WHERE author_name IS NULL OR author_name = 'Equipa Keepla';