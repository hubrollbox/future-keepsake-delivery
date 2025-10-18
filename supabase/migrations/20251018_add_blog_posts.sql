-- Migration: Create blog_posts table with security and performance considerations
-- Date: 2025-10-18

-- Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum type for post status if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'blog_post_status'
  ) THEN
    CREATE TYPE public.blog_post_status AS ENUM ('draft', 'published');
  END IF;
END $$;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  status public.blog_post_status NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  published_at TIMESTAMPTZ,

  CONSTRAINT blog_posts_slug_lowercase CHECK (slug = lower(slug)),
  CONSTRAINT blog_posts_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT blog_posts_published_requires_date CHECK (
    status = 'draft' OR published_at IS NOT NULL
  )
);

-- Unique index for slug and performance indexes
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_unique ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON public.blog_posts (published_at);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON public.blog_posts USING gin (tags);
CREATE INDEX IF NOT EXISTS blog_posts_author_idx ON public.blog_posts (author_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.blog_posts_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_set_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.blog_posts_set_updated_at();

-- Trigger to set published_at when status becomes 'published'
CREATE OR REPLACE FUNCTION public.blog_posts_set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := timezone('utc', now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_set_published_at ON public.blog_posts;
CREATE TRIGGER blog_posts_set_published_at
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.blog_posts_set_published_at();

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public can read only published posts
DROP POLICY IF EXISTS blog_posts_public_read ON public.blog_posts;
CREATE POLICY blog_posts_public_read
ON public.blog_posts
FOR SELECT
USING (status = 'published');

-- Authors can manage their own posts (insert/update/delete/select)
DROP POLICY IF EXISTS blog_posts_author_insert ON public.blog_posts;
CREATE POLICY blog_posts_author_insert
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS blog_posts_author_update ON public.blog_posts;
CREATE POLICY blog_posts_author_update
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS blog_posts_author_delete ON public.blog_posts;
CREATE POLICY blog_posts_author_delete
ON public.blog_posts
FOR DELETE
TO authenticated
USING (author_id = auth.uid());

-- Authors can read their own posts (drafts included)
DROP POLICY IF EXISTS blog_posts_author_select ON public.blog_posts;
CREATE POLICY blog_posts_author_select
ON public.blog_posts
FOR SELECT
TO authenticated
USING (author_id = auth.uid());

-- Admins can manage all posts
-- Reuse secure admin function if present
DROP POLICY IF EXISTS blog_posts_admin_manage ON public.blog_posts;
CREATE POLICY blog_posts_admin_manage
ON public.blog_posts
FOR ALL
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Optional: comment metadata
COMMENT ON TABLE public.blog_posts IS 'Public blog posts authored by users; published posts readable by everyone.';
COMMENT ON COLUMN public.blog_posts.content IS 'Sanitized HTML content of the blog post.';