-- Restrict api_usage writes to service_role to prevent quota bypass
DROP POLICY IF EXISTS "Users can insert own api_usage" ON public.api_usage;
DROP POLICY IF EXISTS "Users can update own api_usage" ON public.api_usage;

CREATE POLICY "api_usage_service_write"
ON public.api_usage
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);