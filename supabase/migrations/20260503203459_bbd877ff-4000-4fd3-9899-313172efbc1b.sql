
-- Ensure RLS enabled on critical tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Restrict user_achievements: prevent users from self-granting via INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS user_achievements_user_all ON public.user_achievements;

CREATE POLICY user_achievements_user_select
  ON public.user_achievements
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
