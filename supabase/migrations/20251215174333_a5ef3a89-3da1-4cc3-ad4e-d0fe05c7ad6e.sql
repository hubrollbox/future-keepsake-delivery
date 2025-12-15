-- Add published_at column if not exists
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Update existing published posts to have published_at set
UPDATE public.blog_posts 
SET published_at = created_at 
WHERE status = 'published' AND published_at IS NULL;

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Create trigger to auto-set published_at when status changes to published
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS DISTINCT FROM 'published' OR OLD.published_at IS NULL) THEN
    NEW.published_at = COALESCE(NEW.published_at, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS set_published_at_trigger ON public.blog_posts;
CREATE TRIGGER set_published_at_trigger
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_published_at();