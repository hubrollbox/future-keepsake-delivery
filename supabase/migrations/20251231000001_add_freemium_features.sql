-- Migration: Add freemium features to keepsakes and create supporting tables
-- Date: 2025-01-14
-- Description: Adds type and keywords columns to keepsakes table, creates api_usage and stripe_events tables

-- Add type and keywords columns to keepsakes table
ALTER TABLE public.keepsakes 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'free_email',
ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Create api_usage table for tracking Claude API usage
CREATE TABLE IF NOT EXISTS public.api_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service TEXT NOT NULL, -- 'claude', 'stripe', etc.
    endpoint TEXT NOT NULL, -- '/suggestion', '/generate-template', etc.
    tokens_used INTEGER DEFAULT 0,
    cost DECIMAL(10,4) DEFAULT 0.0000,
    request_data JSONB,
    response_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create stripe_events table for webhook processing
CREATE TABLE IF NOT EXISTS public.stripe_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processed BOOLEAN DEFAULT false,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- Add subscription_tier to users table (if not exists)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_keepsakes_type ON public.keepsakes(type);
CREATE INDEX IF NOT EXISTS idx_keepsakes_keywords ON public.keepsakes USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_service ON public.api_usage(user_id, service);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed ON public.stripe_events(processed);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON public.users(subscription_tier);

-- RLS Policies for api_usage
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API usage" ON public.api_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert API usage" ON public.api_usage
    FOR INSERT WITH CHECK (true);

-- RLS Policies for stripe_events (admin only)
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access stripe events" ON public.stripe_events
    FOR ALL USING (auth.role() = 'service_role');

-- Update keepsakes RLS policies to include type filtering
DROP POLICY IF EXISTS "Users can view their own keepsakes" ON public.keepsakes;
CREATE POLICY "Users can view their own keepsakes" ON public.keepsakes
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own keepsakes" ON public.keepsakes;
CREATE POLICY "Users can insert their own keepsakes" ON public.keepsakes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own keepsakes" ON public.keepsakes;
CREATE POLICY "Users can update their own keepsakes" ON public.keepsakes
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to get user's daily API usage
CREATE OR REPLACE FUNCTION get_daily_api_usage(p_user_id uuid, p_service text)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT COALESCE(COUNT(*), 0)
        FROM public.api_usage
        WHERE user_id = p_user_id
        AND service = p_service
        AND created_at >= CURRENT_DATE
        AND created_at < CURRENT_DATE + INTERVAL '1 day'
    );
END;
$$;

-- Function to check if user can use AI features
CREATE OR REPLACE FUNCTION can_use_ai_feature(p_user_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_tier TEXT;
    daily_usage INTEGER;
BEGIN
    -- Get user subscription tier
    SELECT subscription_tier INTO user_tier
    FROM public.users
    WHERE id = p_user_id;
    
    -- Premium users have unlimited access
    IF user_tier = 'premium' OR user_tier = 'enterprise' THEN
        RETURN true;
    END IF;
    
    -- Free users have daily limit
    SELECT get_daily_api_usage(p_user_id, 'claude') INTO daily_usage;
    
    RETURN daily_usage < 1; -- 1 per day for free users
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.api_usage TO authenticated;
GRANT SELECT ON public.stripe_events TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_api_usage(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION can_use_ai_feature(uuid) TO authenticated;