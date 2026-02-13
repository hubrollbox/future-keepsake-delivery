
-- Add stripe_customer_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT NULL;

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_subscriptions_user_read" ON public.user_subscriptions
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "user_subscriptions_user_insert" ON public.user_subscriptions
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_subscriptions_user_update" ON public.user_subscriptions
FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "user_subscriptions_admin_manage" ON public.user_subscriptions
FOR ALL TO authenticated USING (public.is_admin_secure()) WITH CHECK (public.is_admin_secure());

-- Create payment_history table
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_invoice_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_history_user_read" ON public.payment_history
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "payment_history_admin_manage" ON public.payment_history
FOR ALL TO authenticated USING (public.is_admin_secure()) WITH CHECK (public.is_admin_secure());

-- Trigger for updated_at on user_subscriptions
CREATE TRIGGER set_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
