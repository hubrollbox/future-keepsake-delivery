-- Create public bucket for blog cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-covers', 'blog-covers', true);

-- Policy: Anyone can view blog cover images
CREATE POLICY "blog_covers_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-covers');

-- Policy: Admins can upload blog cover images
CREATE POLICY "blog_covers_admin_insert"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-covers' AND is_admin_secure());

-- Policy: Admins can update blog cover images
CREATE POLICY "blog_covers_admin_update"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog-covers' AND is_admin_secure());

-- Policy: Admins can delete blog cover images
CREATE POLICY "blog_covers_admin_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'blog-covers' AND is_admin_secure());