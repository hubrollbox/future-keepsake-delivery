-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "blog_posts_public_read" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- Policy: Admins can manage all blog posts
CREATE POLICY "blog_posts_admin_manage" 
ON public.blog_posts 
FOR ALL 
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

-- Create index for faster slug lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Create index for status filtering
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();