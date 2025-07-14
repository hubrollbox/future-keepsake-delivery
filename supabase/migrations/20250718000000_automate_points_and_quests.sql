-- Function to update user_quests.progress
CREATE OR REPLACE FUNCTION public.update_user_quest_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Assuming NEW.progress is the new value for progress, or it's incremented by some action.
  -- This trigger needs to be adapted based on how quest progress is actually tracked.
  -- For now, let's assume an INSERT or UPDATE on user_quests means progress is being made.
  -- If progress is updated by external actions, this trigger might need to be on a different table
  -- or a separate function called by application logic.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_quests.progress (example - needs specific action to trigger)
-- CREATE TRIGGER trg_update_user_quest_progress
-- AFTER INSERT OR UPDATE ON public.user_quests
-- FOR EACH ROW EXECUTE FUNCTION public.update_user_quest_progress();

-- Function to update profiles.total_points from user_achievements
CREATE OR REPLACE FUNCTION public.update_profile_points_from_achievement()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger to update profiles.total_points on new user_achievements
CREATE TRIGGER trg_update_profile_points_on_achievement
AFTER INSERT ON public.user_achievements
FOR EACH ROW EXECUTE FUNCTION public.update_profile_points_from_achievement();

-- Function to update profiles.total_points from completed user_quests
CREATE OR REPLACE FUNCTION public.update_profile_points_from_quest_completion()
RETURNS TRIGGER AS $$
DECLARE
  quest_reward INTEGER;
BEGIN
  -- Only update points if the quest is marked as completed and it wasn't already completed
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    SELECT reward INTO quest_reward FROM public.quests WHERE id = NEW.quest_id;

    UPDATE public.profiles
    SET total_points = total_points + quest_reward,
        level = public.calculate_level(total_points + quest_reward)
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profiles.total_points on user_quests completion
CREATE TRIGGER trg_update_profile_points_on_quest_completion
AFTER UPDATE ON public.user_quests
FOR EACH ROW EXECUTE FUNCTION public.update_profile_points_from_quest_completion();

-- Function to update user_quests.progress based on user actions (placeholder)
-- This function needs to be implemented based on specific user actions that contribute to quest progress.
-- For example, if a quest is "send 5 messages", this trigger would be on the messages table.
-- For now, this is a conceptual placeholder.
CREATE OR REPLACE FUNCTION public.increment_user_quest_progress_on_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Example: Increment progress for a specific quest related to the action
  -- This logic needs to be highly specific to your application's quest system.
  -- For instance, if a quest is tied to sending messages, this trigger would be on the 'messages' table.
  -- UPDATE public.user_quests
  -- SET progress = progress + 1
  -- WHERE user_id = NEW.user_id AND quest_id = <relevant_quest_id>;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Example trigger for user_quests.progress (needs a specific table/action)
-- CREATE TRIGGER trg_increment_user_quest_progress
-- AFTER INSERT ON public.<some_action_table> -- e.g., public.messages, public.deliveries
-- FOR EACH ROW EXECUTE FUNCTION public.increment_user_quest_progress_on_action();