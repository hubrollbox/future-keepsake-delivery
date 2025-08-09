-- Backfill profiles for existing users
INSERT INTO public.profiles (id, full_name, email)
SELECT
  au.id,
  au.raw_user_meta_data->>'full_name' AS full_name,
  au.email
FROM
  auth.users AS au
LEFT JOIN
  public.profiles AS p
ON
  au.id = p.id
WHERE
  p.id IS NULL
ON CONFLICT (id) DO NOTHING;