import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type Props = {
  editId?: string | null;
  onSaved?: () => void;
};

type BlogRow = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: 'published' | 'draft';
  author_id?: string | null;
  cover_image_url?: string;
};

const CreateBlogPost = ({ editId, onSaved }: Props) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [publish, setPublish] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const slugify = (input: string) =>
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  /* --------------------------------
     Carregar post para edição
     -------------------------------- */
  useEffect(() => {
    if (!editId) return;

    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', editId)
        .single();

      if (error || !data) {
        console.error('Erro ao carregar post para edição', error);
        return;
      }

      setTitle(data.title ?? '');
      setSlug(data.slug ?? '');
      setExcerpt(data.excerpt ?? '');
      setContent(data.content ?? '');

      if (Array.isArray(data.tags)) {
        setTags(data.tags.join(', '));
      } else {
        setTags('');
      }

      setPublish(data.status === 'published');
    })();
  }, [editId]);

  /* --------------------------------
     Submissão
     -------------------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let coverUrl: string | undefined;

      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()?.toLowerCase();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-covers')
          .upload(fileName, coverFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('blog-covers')
          .getPublicUrl(uploadData.path);

        coverUrl = publicData.publicUrl;
      }

      const { data: userData } = await supabase.auth.getUser();
      const authorId = userData?.user?.id ?? null;

      const row: BlogRow = {
        title,
        slug: slugify(slug || title),
        excerpt,
        content,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        status: publish ? 'published' : 'draft',
        author_id: authorId
      };

      if (coverUrl) {
        row.cover_image_url = coverUrl;
      }

      if (editId) {
        const { error } = await supabase
          .from('blog_posts')
          .update(row)
          .eq('id', editId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(row);

        if (error) throw error;
      }

      onSaved?.();
      navigate('/admin/blog');
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      alert('Erro ao salvar post. Ver consola para mais detalhes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">
        {editId ? 'Editar Post do Blog' : 'Criar Post do Blog'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium">
            Título
          </label>
          <input
            id="post-title"
            className="mt-1 block w-full rounded-md border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="post-slug" className="block text-sm font-medium">
            Slug (opcional)
          </label>
          <input
            id="post-slug"
            className="mt-1 block w-full rounded-md border p-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: meu-post-incrivel"
          />
        </div>

        <div>
          <label htmlFor="post-excerpt" className="block text-sm font-medium">
            Resumo
          </label>
          <textarea
            id="post-excerpt"
            className="mt-1 block w-full rounded-md border p-2"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="post-content" className="block text-sm font-medium">
            Conteúdo
          </label>
          <textarea
            id="post-content"
            className="mt-1 block w-full rounded-md border p-2 font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
          />
        </div>

        <div>
          <label htmlFor="post-tags" className="block text-sm font-medium">
            Tags (separadas por vírgula)
          </label>
          <input
            id="post-tags"
            className="mt-1 block w-full rounded-md border p-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="post-publish"
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          <label htmlFor="post-publish">Publicar imediatamente</label>
        </div>

        <div>
          <label htmlFor="cover-file" className="block text-sm font-medium">
            Imagem ou vídeo de capa (opcional)
          </label>
          <input
            id="cover-file"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <div className="pt-4 flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'A gravar...' : editId ? 'Salvar alterações' : 'Criar Post'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/blog')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;