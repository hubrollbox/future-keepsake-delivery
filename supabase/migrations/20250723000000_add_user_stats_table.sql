-- Add user_stats table that is referenced in triggers but missing from schema
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_achievements INTEGER DEFAULT 0 NOT NULL,
    total_quests_completed INTEGER DEFAULT 0 NOT NULL,
    total_points INTEGER DEFAULT 0 NOT NULL,
    level INTEGER DEFAULT 1 NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Add RLS policies for user_stats table
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own stats
CREATE POLICY "Users can view their own stats" 
    ON public.user_stats 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow users to update their own stats
CREATE POLICY "Users can update their own stats" 
    ON public.user_stats 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Allow admins to view all stats
CREATE POLICY "Admins can view all stats" 
    ON public.user_stats 
    FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Allow admins to update all stats
CREATE POLICY "Admins can update all stats" 
    ON public.user_stats 
    FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Allow system to insert stats for any user
CREATE POLICY "System can insert stats for any user" 
    ON public.user_stats 
    FOR INSERT 
    WITH CHECK (true);