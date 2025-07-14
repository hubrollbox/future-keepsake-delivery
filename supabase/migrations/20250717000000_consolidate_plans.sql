-- Create plans table
CREATE TABLE public.plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL UNIQUE
);

ALTER TABLE public.plans OWNER TO postgres;

-- Insert default plan types
INSERT INTO public.plans (name) VALUES ('Free'), ('Premium') ON CONFLICT (name) DO NOTHING;

-- Add plan_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN plan_id uuid REFERENCES public.plans(id);

-- Migrate existing plan data from profiles.plan_type to profiles.plan_id
UPDATE public.profiles
SET plan_id = (SELECT id FROM public.plans WHERE name = public.profiles.plan_type);

-- Drop the redundant plan_type column from profiles
ALTER TABLE public.profiles
DROP COLUMN plan_type;

-- Add plan_id to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN plan_id uuid REFERENCES public.plans(id);

-- Migrate existing plan data from subscriptions.plan to subscriptions.plan_id
UPDATE public.subscriptions
SET plan_id = (SELECT id FROM public.plans WHERE name = public.subscriptions.plan);

-- Drop the redundant plan column from subscriptions
ALTER TABLE public.subscriptions
DROP COLUMN plan;