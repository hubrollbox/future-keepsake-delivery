-- Migration to unify points system and eliminate race conditions
-- Date: 2025-12-27
-- Description: 
-- 1. Centralizes point logic in apply_user_points
-- 2. Removes duplicate logic in triggers
-- 3. Ensures single source of truth for points (profiles.total_points)
-- 4. Fixes RLS and permissions

-- 1. Ensure 'achievement' and 'quest' exist in point_rules to satisfy FK in point_events
INSERT INTO public.point_rules (action_type, points, description, daily_limit, min_interval_seconds)
VALUES 
  ('achievement', 0, 'Conquista desbloqueada', NULL, 0),
  ('quest', 0, 'Missão completada', NULL, 0)
ON CONFLICT (action_type) DO NOTHING;

-- 2. Ensure calculate_level exists and is immutable
CREATE OR REPLACE FUNCTION public.calculate_level(points integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Simple formula: 1 level per 100 points, starting at level 1
    RETURN (points / 100) + 1;
END;
$$;

-- 3. Create central function apply_user_points
-- Added metadata parameter to preserve data integrity for the events log
CREATE OR REPLACE FUNCTION public.apply_user_points(
    user_id uuid, 
    delta_points integer, 
    source text,
    metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_points integer;
    new_level integer;
BEGIN
    -- Validations
    IF delta_points IS NULL OR delta_points = 0 THEN
        RETURN;
    END IF;

    -- 1. Register event (Source of Truth for history)
    -- We assume 'source' is a valid action_type in point_rules.
    INSERT INTO public.point_events (user_id, action_type, points, metadata, created_at)
    VALUES (user_id, source, delta_points, metadata, NOW());

    -- 2. Update profiles (Source of Truth for state)
    UPDATE public.profiles
    SET 
        total_points = COALESCE(total_points, 0) + delta_points,
        level = public.calculate_level(COALESCE(total_points, 0) + delta_points),
        updated_at = NOW()
    WHERE id = user_id;

    -- 3. Sync user_stats if it exists (Legacy support / Secondary cache)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_stats') THEN
        UPDATE public.user_stats
        SET 
            total_points = COALESCE(total_points, 0) + delta_points,
            current_level = public.calculate_level(COALESCE(total_points, 0) + delta_points),
            updated_at = NOW()
        WHERE user_id = apply_user_points.user_id;
    END IF;
END;
$$;

-- 4. Refactor User Achievements Trigger
-- Drop old trigger and function
DROP TRIGGER IF EXISTS trg_update_profile_points_on_achievement ON public.user_achievements;
DROP FUNCTION IF EXISTS public.update_profile_points_from_achievement();

-- Create new trigger function
CREATE OR REPLACE FUNCTION public.handle_achievement_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    achievement_points integer;
    achievement_title text;
BEGIN
    -- Get points and title from achievements table
    SELECT points, title INTO achievement_points, achievement_title
    FROM public.achievements 
    WHERE id = NEW.achievement_id;

    -- Apply points via central function
    IF achievement_points IS NOT NULL AND achievement_points > 0 THEN
        PERFORM public.apply_user_points(
            NEW.user_id, 
            achievement_points, 
            'achievement',
            jsonb_build_object('achievement_id', NEW.achievement_id, 'title', achievement_title)
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Create new trigger
CREATE TRIGGER trg_on_achievement_unlocked
AFTER INSERT ON public.user_achievements
FOR EACH ROW
EXECUTE FUNCTION public.handle_achievement_points();

-- 5. Refactor User Quests Trigger
-- Drop old trigger and function
DROP TRIGGER IF EXISTS trg_update_profile_points_on_quest_completion ON public.user_quests;
DROP FUNCTION IF EXISTS public.update_profile_points_from_quest_completion();

-- Create new trigger function
CREATE OR REPLACE FUNCTION public.handle_quest_completion_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    quest_reward integer;
    quest_title text;
BEGIN
    -- Only process if completing just now
    IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
        -- Get reward and title from quests table
        SELECT reward, title INTO quest_reward, quest_title
        FROM public.quests 
        WHERE id = NEW.quest_id;

        -- Apply points via central function
        IF quest_reward IS NOT NULL AND quest_reward > 0 THEN
            PERFORM public.apply_user_points(
                NEW.user_id, 
                quest_reward, 
                'quest',
                jsonb_build_object('quest_id', NEW.quest_id, 'title', quest_title)
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Create new trigger
CREATE TRIGGER trg_on_quest_completed
AFTER UPDATE ON public.user_quests
FOR EACH ROW
EXECUTE FUNCTION public.handle_quest_completion_points();

-- 6. Update add_points (Legacy/Action function) to use apply_user_points
-- This function handles daily limits and streaks, but delegates point application
CREATE OR REPLACE FUNCTION public.add_points(
    p_user_id UUID,
    p_action_type TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_rule RECORD;
    v_points_to_add INTEGER;
    v_today_count INTEGER;
    v_last_event_time TIMESTAMPTZ;
    v_new_total INTEGER;
    v_streak_bonus INTEGER := 0;
    -- Variables for streak logic
    v_current_streak INTEGER;
    v_last_activity DATE;
BEGIN
    -- 1. Validate Rule
    SELECT * INTO v_rule FROM public.point_rules WHERE action_type = p_action_type AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or inactive action type');
    END IF;

    v_points_to_add := v_rule.points;

    -- 2. Check Daily Limits
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

    -- 3. Check Minimum Interval
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

    -- 4. Streak Logic
    IF p_action_type = 'daily_login' OR p_action_type = 'blog_visit' THEN
        -- Upsert user_stats to ensure it exists
        INSERT INTO public.user_stats (user_id, last_activity_date)
        VALUES (p_user_id, CURRENT_DATE - INTERVAL '1 day')
        ON CONFLICT (user_id) DO NOTHING;

        SELECT last_activity_date, current_streak INTO v_last_activity, v_current_streak
        FROM public.user_stats
        WHERE user_id = p_user_id;

        IF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
             v_current_streak := v_current_streak + 1;
             -- Bonus points could be applied here recursively via apply_user_points
        ELSIF v_last_activity < CURRENT_DATE - INTERVAL '1 day' THEN
             v_current_streak := 1;
        END IF;

        UPDATE public.user_stats 
        SET last_activity_date = CURRENT_DATE,
            current_streak = v_current_streak,
            updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;

    -- 5. Apply Points (Centralized)
    PERFORM public.apply_user_points(p_user_id, v_points_to_add, p_action_type, p_metadata);

    -- Get new total for response
    SELECT total_points INTO v_new_total FROM public.profiles WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true, 
        'points_added', v_points_to_add, 
        'new_total', v_new_total,
        'message', 'Points added successfully'
    );
END;
$$;

-- 7. RLS Policies for profiles
-- Ensure profiles can only be updated by the user (except via SECURITY DEFINER functions)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);
