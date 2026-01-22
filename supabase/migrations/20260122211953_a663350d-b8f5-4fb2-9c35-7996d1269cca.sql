-- Add is_admin_secure() function definition to migrations for version control
-- This function already exists in the database but wasn't in the migration files

-- Recreate the function to ensure it's properly documented
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
    AND auth.uid() IS NOT NULL
    AND auth.role() = 'authenticated'
  );
$$;

COMMENT ON FUNCTION public.is_admin_secure() IS 'Security function used by RLS policies to verify admin role. Returns true only for authenticated users with admin role in admin_roles table.';