-- Drop redundant blog_posts SELECT policies that expose draft posts
-- Keep only blog_posts_public_read (status = 'published') and blog_posts_admin_manage
DROP POLICY IF EXISTS "Allow public read" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read blog posts" ON public.blog_posts;