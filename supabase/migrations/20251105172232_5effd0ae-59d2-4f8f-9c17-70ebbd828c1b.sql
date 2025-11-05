-- Add admin policies for plans table
-- Allow admins to insert, update and delete plans

CREATE POLICY "plans_admin_insert"
ON public.plans
FOR INSERT
TO authenticated
WITH CHECK (is_admin_secure());

CREATE POLICY "plans_admin_update"
ON public.plans
FOR UPDATE
TO authenticated
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

CREATE POLICY "plans_admin_delete"
ON public.plans
FOR DELETE
TO authenticated
USING (is_admin_secure());