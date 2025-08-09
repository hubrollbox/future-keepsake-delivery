-- Create a function to backfill missing profiles
CREATE OR REPLACE FUNCTION public.backfill_missing_profiles() RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  SELECT
    au.id,
    au.email,
    au.raw_user_meta_data->>'full_name' -- Assuming full_name might be in user_metadata
  FROM
    auth.users AS au
  LEFT JOIN
    public.profiles AS p ON au.id = p.id
  WHERE
    p.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to backfill profiles
SELECT public.backfill_missing_profiles();

-- Drop the function after execution if it's not needed anymore
DROP FUNCTION public.backfill_missing_profiles();