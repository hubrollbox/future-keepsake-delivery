import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validação com Zod
const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(200, 'O título não pode exceder 200 caracteres'),
  slug: z
    .string()
    .max(200, 'O slug não pode exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  excerpt: z
    .string()
    .max(500, 'O excerto não pode exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(10, 'O conteúdo deve ter pelo menos 10 caracteres'),
  tags: z
    .string()
    .optional()
    .or(z.literal('')),
  publish: z.boolean().default(false),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

// Função para gerar slug com suporte a caracteres acentuados
function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim();
}

type Props = {
  editId?: string | null;
  onSaved?: () => void;
};

const CreateBlogPost = ({ editId, onSaved }: Props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      tags: '',
      publish: false,
    },
  });

  const title = watch('title');
  const slug = watch('slug');
  const publish = watch('publish');
  const content = watch('content');
  const excerpt = watch('excerpt');

  // Efeito para gerar slug automático
  useEffect(() => {
    if (title && (!slug || slug === slugify(title))) {
      const generatedSlug = slugify(title);
      if (generatedSlug !== slug) {
        setValue('slug', generatedSlug, { shouldValidate: true });
      }
    }
  }, [title, slug, setValue]);

  // Carregar post existente para edição
  useEffect(() => {
    if (!editId) {
      reset({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: '',
        publish: false,
      });
      setCoverFile(null);
      setExistingCoverUrl(null);
      setImagePreview(null);
      return;
    }

    const loadPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', editId)
          .single();

        if (error || !data) {
          throw new Error('Post não encontrado');
        }

        reset({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          publish: data.status === 'published',
        });

        setExistingCoverUrl(data.cover_image_url);
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o post para edição.',
          variant: 'destructive',
        });
      }
    };

    loadPost();
  }, [editId, reset, toast]);

  // Preview da imagem selecionada
  useEffect(() => {
    if (!coverFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(coverFile);
    setImagePreview(previewUrl);
    
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [coverFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validação do tipo de arquivo
      const validTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
      ];
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Erro',
          description: 'Formato de arquivo não suportado. Use imagens (JPEG, PNG, GIF, WebP) ou vídeos (MP4, WebM).',
          variant: 'destructive',
        });
        e.target.value = ''; // Limpa o input
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: 'Erro',
          description: 'O arquivo é muito grande. O tamanho máximo é 10MB.',
          variant: 'destructive',
        });
        e.target.value = ''; // Limpa o input
        return;
      }
    }
    
    setCoverFile(file);
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setExistingCoverUrl(null);
    setImagePreview(null);
    
    // Limpa o input file
    const fileInput = document.getElementById('cover-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const uploadCover = async (): Promise<string | null> => {
    // Se não há arquivo novo e temos uma URL existente, mantemos a existente
    if (!coverFile && existingCoverUrl) return existingCoverUrl;
    
    // Se não há arquivo novo e não temos URL existente, retornamos null
    if (!coverFile) return null;

    try {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Upload para o bucket correto 'blog-covers'
      const { error: uploadError } = await supabase.storage
        .from('blog-covers')
        .upload(fileName, coverFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw new Error('Falha no upload do ficheiro');
      }

      const { data: urlData } = supabase.storage
        .from('blog-covers')
        .getPublicUrl(fileName);

      return urlData?.publicUrl || null;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Verificar autenticação
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Utilizador não autenticado. Por favor, faça login novamente.');
      }

      // Verificar slug único (exceto para o post atual em edição)
      const finalSlug = data.slug || slugify(data.title);
      
      if (finalSlug) {
        const { data: existingPosts, error: slugError } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', finalSlug)
          .neq('id', editId || '');

        if (slugError) throw slugError;
        
        if (existingPosts && existingPosts.length > 0) {
          setError('slug', {
            type: 'manual',
            message: 'Já existe um post com este slug. Por favor, escolha outro.',
          });
          throw new Error('Slug já está em uso');
        }
      }

      // Upload da imagem (se houver)
      let coverUrl: string | null = existingCoverUrl;
      if (coverFile) {
        const uploadedUrl = await uploadCover();
        coverUrl = uploadedUrl;
      }

      // Preparar dados para inserção/atualização
      const postData = {
        title: data.title.trim(),
        slug: finalSlug,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        tags: data.tags
          ? data.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag.length > 0)
          : [],
        status: data.publish ? 'published' : 'draft',
        author_id: userData.user.id,
        cover_image_url: coverUrl,
        updated_at: new Date().toISOString(),
      };

      // Inserir ou atualizar
      let error;
      
      if (editId) {
        const result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editId);
        error = result.error;
      } else {
        const result = await supabase
          .from('blog_posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }]);
        error = result.error;
      }

      if (error) throw error;

      // Feedback de sucesso
      toast({
        title: 'Sucesso!',
        description: editId 
          ? (data.publish ? 'Post atualizado e publicado!' : 'Post atualizado como rascunho!')
          : (data.publish ? 'Post criado e publicado!' : 'Post criado como rascunho!'),
      });

      // Limpar formulário se for uma criação nova (não edição)
      if (!editId) {
        reset();
        setCoverFile(null);
        setExistingCoverUrl(null);
        setImagePreview(null);
      }

      // Chamar callback se fornecido
      onSaved?.();

      // Navegar de volta se for uma edição
      if (editId) {
        setTimeout(() => {
          navigate('/admin/blog');
        }, 1500);
      }
    } catch (error: unknown) {
      console.error('Erro ao salvar post:', error);
      
      // Não mostrar toast se o erro for de slug (já tratado no form)
      if (error instanceof Error && error.message !== 'Slug já está em uso') {
        const errorMessage = error.message || 'Ocorreu um erro ao salvar o post. Por favor, tente novamente.';
        
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {editId ? 'Editar Post do Blog' : 'Criar Post do Blog'}
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/blog')}
          disabled={isSubmitting}
        >
          Voltar
        </Button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }} className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            id="title"
            {...register('title')}
            placeholder="Título do post"
            className="w-full border border-keepla-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-keepla-red focus:border-keepla-red"
            aria-required="true"
            aria-invalid={errors.title ? true : false}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-keepla-red text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug (URL)
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">/blog/</span>
            <input
              id="slug"
              {...register('slug')}
              placeholder="slug-do-post"
              className="flex-1 border border-keepla-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-keepla-red focus:border-keepla-red"
              aria-describedby={errors.slug ? 'slug-error slug-help' : 'slug-help'}
              onChange={(e) => {
                clearErrors('slug');
                register('slug').onChange(e);
              }}
            />
          </div>
          <p id="slug-help" className="text-sm text-gray-500">
            Será gerado automaticamente a partir do título. Pode editar manualmente.
          </p>
          {errors.slug && (
            <p id="slug-error" className="text-keepla-red text-sm mt-1">
              {errors.slug.message}
            </p>
          )}
        </div>

        {/* Introdução */}
        <div className="space-y-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Introdução
          </label>
          <textarea
            id="excerpt"
            {...register('excerpt')}
            placeholder="Introdução editorial do artigo. 1–2 parágrafos que contextualizam e captam interesse."
            rows={3}
            className="w-full border border-keepla-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-keepla-red focus:border-keepla-red resize-none"
            aria-describedby={errors.excerpt ? 'excerpt-error excerpt-help excerpt-counter' : 'excerpt-help excerpt-counter'}
          />
          <p id="excerpt-help" className="text-sm text-gray-500">
            Use a introdução para contextualizar o tema, definir expectativas e motivar a leitura.
          </p>
          <div className="flex justify-between items-center">
            <p id="excerpt-counter" className="text-sm text-gray-500">
              {excerpt?.length || 0}/500 caracteres
            </p>
            {errors.excerpt && (
              <p id="excerpt-error" className="text-keepla-red text-sm">
                {errors.excerpt.message}
              </p>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Conteúdo *
          </label>
          <div className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700 bg-gray-50">
            <div className="font-medium mb-1">Formatação básica (Markdown):</div>
            <div className="space-y-1">
              <p>Títulos: # Título, ## Subtítulo</p>
              <p>Negrito: **texto**</p>
              <p>Listas: - item da lista</p>
              <p>Links: [texto do link](https://exemplo.com)</p>
            </div>
          </div>
          <textarea
            id="content"
            {...register('content')}
            placeholder="Escreva o conteúdo do post aqui..."
            rows={12}
            className="w-full border border-keepla-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-keepla-red focus:border-keepla-red resize-y font-mono text-sm"
            aria-required="true"
            aria-invalid={errors.content ? true : false}
            aria-describedby={errors.content ? 'content-error content-counter' : 'content-counter'}
          />
          <div className="flex justify-between items-center">
            <p id="content-counter" className="text-sm text-gray-500">
              {content?.length || 0} caracteres
            </p>
            {errors.content && (
              <p id="content-error" className="text-keepla-red text-sm">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            id="tags"
            {...register('tags')}
            placeholder="tecnologia, blog, dicas (separadas por vírgula)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-describedby="tags-help"
          />
          <p id="tags-help" className="text-sm text-gray-500">
            Separe as tags por vírgulas
          </p>
        </div>

        {/* Status de publicação */}
        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
          <input
            id="publish"
            type="checkbox"
            {...register('publish')}
            className="h-4 w-4 text-keepla-red rounded focus:ring-keepla-red"
          />
          <div className="space-y-0.5">
            <label htmlFor="publish" className="text-sm font-medium text-gray-700">
              Publicar imediatamente
            </label>
            <p className="text-sm text-gray-500">
              {publish 
                ? 'O post será visível publicamente após salvar.' 
                : 'O post será salvo como rascunho e não será visível publicamente.'}
            </p>
          </div>
        </div>

        {/* Imagem de capa */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Imagem ou vídeo de capa (opcional)
          </label>
          
          {(existingCoverUrl || imagePreview) && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Pré-visualização:</p>
              <div className="relative max-w-md">
                {(imagePreview || existingCoverUrl) && (
                  <img
                    src={imagePreview || existingCoverUrl || ''}
                    alt="Pré-visualização da capa"
                    className="rounded-lg border border-keepla-gray-200 max-h-64 object-cover w-full"
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2"
                  disabled={isSubmitting}
                >
                  Remover
                </Button>
              </div>
            </div>
          )}

          <div>
            <input
              type="file"
              id="cover-file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full border border-keepla-gray-200 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-keepla-red/10 file:text-keepla-red hover:file:bg-keepla-red/20"
              aria-describedby="cover-help"
              disabled={isSubmitting}
            />
            <p id="cover-help" className="text-sm text-gray-500 mt-1">
              Formatos suportados: JPG, PNG, GIF, WebP, MP4, WebM. Máximo: 10MB
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isSubmitting || (!editId && !isDirty)}
            className="flex-1"
          >
            {isSubmitting 
              ? 'A salvar...' 
              : editId 
                ? (publish ? 'Atualizar e Publicar' : 'Atualizar Rascunho')
                : (publish ? 'Criar e Publicar' : 'Criar Rascunho')}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blog')}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
