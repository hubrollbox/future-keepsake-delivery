-- Drop existing policies
DROP POLICY IF EXISTS "blog_covers_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "blog_covers_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "blog_covers_admin_delete" ON storage.objects;

-- Recreate with simpler admin check that works with storage
CREATE POLICY "blog_covers_admin_insert" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-covers' 
  AND EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "blog_covers_admin_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog-covers' 
  AND EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "blog_covers_admin_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-covers' 
  AND EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);