-- Storage bucket configuration and RLS policies for blog-covers and digital-files

-- Ensure buckets exist with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('blog-covers', 'blog-covers', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('digital-files', 'digital-files', false, 104857600, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist (for clean slate)
DROP POLICY IF EXISTS "blog_covers_public_read" ON storage.objects;
DROP POLICY IF EXISTS "blog_covers_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "blog_covers_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "blog_covers_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "digital_files_user_upload" ON storage.objects;
DROP POLICY IF EXISTS "digital_files_user_read" ON storage.objects;
DROP POLICY IF EXISTS "digital_files_user_delete" ON storage.objects;

-- Blog covers: public read access
CREATE POLICY "blog_covers_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-covers');

-- Blog covers: admin-only upload
CREATE POLICY "blog_covers_admin_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-covers'
  AND auth.uid() IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Blog covers: admin-only update
CREATE POLICY "blog_covers_admin_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-covers'
  AND auth.uid() IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Blog covers: admin-only delete
CREATE POLICY "blog_covers_admin_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-covers'
  AND auth.uid() IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Digital files: authenticated users can upload to their own folder
CREATE POLICY "digital_files_user_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'digital-files'
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
);

-- Digital files: authenticated users can read their own files
CREATE POLICY "digital_files_user_read"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'digital-files'
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
);

-- Digital files: users can delete their own files
CREATE POLICY "digital_files_user_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'digital-files'
  AND auth.uid() IS NOT NULL
  AND auth.role() = 'authenticated'
);