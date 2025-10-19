-- Seed de exemplo para criar um artigo publicado no blog
-- Executa este SQL no teu projeto Supabase após aplicar a migração 20251018_add_blog_posts.sql

INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  tags,
  status,
  author_id
) VALUES (
  'Bem-vindo ao Blog Keepla',
  'bem-vindo-ao-blog-keepla',
  'O que vamos partilhar por aqui.',
  '<p>Este é o primeiro artigo do nosso blog. Aqui vamos partilhar histórias, novidades e reflexões sobre guardar emoções e celebrações significativas.</p>',
  '/placeholder.svg',
  ARRAY['novidades','reflexoes'],
  'published',
  NULL
);

-- Nota:
-- 1) O trigger BEFORE INSERT/UPDATE define automaticamente published_at quando status = 'published'.
-- 2) O author_id é opcional. Caso queiras associar a um autor específico:
--    substitui NULL por (SELECT id FROM public.profiles WHERE email = 'teu-email@dominio' LIMIT 1);
-- 3) Garante que a função/public.is_admin_user existe se pretendes gerir via conta admin.