import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type Props = {
  editId?: string | null;
  onSaved?: () => void;
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

  useEffect(() => {
    if (!editId) return;
    // Load existing post for editing
    (async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', editId).single();
      if (error) {
        console.error('Erro ao carregar post para edição', error);
        return;
      }
      if (data) {
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setExcerpt(data.excerpt || '');
        setContent(data.content || '');
        setTags((data.tags || []).join(', '));
        setPublish(data.status === 'published');
      }
    })();
  }, [editId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let coverUrl: string | undefined;

      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        // CORREÇÃO 1: Usar o bucket 'blog-covers' e o path correto
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-covers')
          .upload(`${fileName}`, coverFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        // CORREÇÃO 2: Obter o URL público do bucket 'blog-covers'
        const { data: publicData } = supabase.storage.from('blog-covers').getPublicUrl(uploadData.path) as any;
        coverUrl = publicData?.publicUrl || publicData?.public_url || undefined;
      }

      const { data: userData } = await supabase.auth.getUser();
      const authorId = userData?.user?.id;

      const row = {
        title,
        slug: slugify(slug || title),
        excerpt,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        cover_image_url: coverUrl,
        status: publish ? 'published' : 'draft',
        author_id: authorId
      } as any;

      if (editId) {
        const { error: updateError } = await supabase.from('blog_posts').update(row).eq('id', editId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('blog_posts').insert(row);
        if (insertError) throw insertError;
      }

      if (onSaved) onSaved();
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
      <h1 className="text-3xl font-bold mb-6">Criar Post do Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium">Título</label>
          <input
            id="post-title"
            className="mt-1 block w-full rounded-md border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Título do artigo"
          />
        </div>

        <div>
          <label htmlFor="post-slug" className="block text-sm font-medium">Slug (opcional)</label>
          <input
            id="post-slug"
            className="mt-1 block w-full rounded-md border p-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: meu-post-incrivel"
          />
        </div>

        <div>
          <label htmlFor="post-excerpt" className="block text-sm font-medium">Resumo (excerpt)</label>
          <textarea
            id="post-excerpt"
            className="mt-1 block w-full rounded-md border p-2"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Resumo curto do artigo"
          />
        </div>

        <div>
          <label htmlFor="post-content" className="block text-sm font-medium">Conteúdo</label>
          <textarea
            id="post-content"
            className="mt-1 block w-full rounded-md border p-2 font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Escreva o post em Markdown ou HTML..."
            required
          />
        </div>

        <div>
          <label htmlFor="post-tags" className="block text-sm font-medium">Tags (separadas por vírgula)</label>
          <input
            id="post-tags"
            className="mt-1 block w-full rounded-md border p-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="memórias, produto, release"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
            <span>Publicar imediatamente</span>
          </label>
        </div>

        <div>
          <label htmlFor="cover-file" className="block text-sm font-medium">Imagem de capa (opcional)</label>
          <input id="cover-file" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="mt-1" />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading}>{loading ? 'A gravar...' : editId ? 'Salvar alterações' : 'Criar Post'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/blog')} className="ml-2">Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
