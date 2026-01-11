-- Fix the slug with trailing space for the Nucleo blog post
UPDATE blog_posts 
SET slug = TRIM(slug)
WHERE id = '50b7b073-702b-4fb8-a7fe-337244def67c';