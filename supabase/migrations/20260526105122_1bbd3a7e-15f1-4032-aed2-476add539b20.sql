-- Restrict subscriptions: read-only for users; service_role manages writes
DROP POLICY IF EXISTS subscriptions_user_all ON public.subscriptions;

CREATE POLICY subscriptions_user_read
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Restrict user_subscriptions: remove user UPDATE access
DROP POLICY IF EXISTS user_subscriptions_user_update ON public.user_subscriptions;