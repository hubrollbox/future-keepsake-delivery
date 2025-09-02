-- Fix remaining functions with search_path warnings
-- This addresses the final search_path security warnings

CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
    UPDATE public.profiles
    SET total_points = NEW.total_points,
        level = NEW.level,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_quest_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Quest progress tracking logic would go here
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_stats_from_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, total_achievements, last_updated)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_achievements = user_stats.total_achievements + 1,
    last_updated = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_stats_from_quest()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, total_quests_completed, last_updated)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_quests_completed = user_stats.total_quests_completed + 1,
    last_updated = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_profile_points_from_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_profile_points_from_quest_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.increment_user_quest_progress_on_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Quest progress increment logic would go here
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth', 'pg_temp'
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

-- Fix scheduled_notifications RLS policy to be more secure
DROP POLICY IF EXISTS "Users can view their own scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "scheduled_notifications_secure_user_access" ON public.scheduled_notifications
  FOR SELECT USING (
    is_admin_secure() OR
    EXISTS (
      SELECT 1 FROM public.keepsakes 
      WHERE keepsakes.id = scheduled_notifications.keepsake_id 
      AND keepsakes.user_id = auth.uid()
    )
  );