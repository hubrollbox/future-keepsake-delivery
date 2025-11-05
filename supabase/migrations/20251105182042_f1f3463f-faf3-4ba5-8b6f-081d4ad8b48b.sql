-- Align 'plans' table schema with AdminPlans UI requirements
-- 1) Add missing columns with safe defaults
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS price_monthly numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_yearly numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS limitations text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS keepsake_limit text,
  ADD COLUMN IF NOT EXISTS popular boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS subscriber_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

-- 2) Updated_at trigger helper (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3) Attach trigger to plans (idempotent block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.triggers 
    WHERE event_object_schema = 'public'
      AND event_object_table = 'plans'
      AND trigger_name = 'set_plans_updated_at'
  ) THEN
    CREATE TRIGGER set_plans_updated_at
    BEFORE UPDATE ON public.plans
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
