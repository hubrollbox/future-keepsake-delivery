import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Facebook, 
  Twitter, 
  Linkedin,
  Image as ImageIcon,
  FileText,
  Share2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Schema de validação com Zod
const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(60, 'O título não pode exceder 60 caracteres para SEO otimizado'),
  slug: z
    .string()
    .max(200, 'O slug não pode exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  excerpt: z
    .string()
    .min(1, 'A descrição é obrigatória para SEO')
    .max(160, 'A descrição não pode exceder 160 caracteres para SEO otimizado'),
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
  const [activeTab, setActiveTab] = useState('content');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    setFocus,
    formState: { errors },
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
      const validTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
      ];
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Erro',
          description: 'Formato não suportado. Use JPEG, PNG, GIF ou WebP.',
          variant: 'destructive',
        });
        e.target.value = '';
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: 'Erro',
          description: 'O arquivo é muito grande. Máximo 10MB.',
          variant: 'destructive',
        });
        e.target.value = '';
        return;
      }
    }
    
    setCoverFile(file);
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setExistingCoverUrl(null);
    setImagePreview(null);
    
    const fileInput = document.getElementById('cover-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile && existingCoverUrl) return existingCoverUrl;
    if (!coverFile) return null;

    try {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

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
    
    // Verificar se tem imagem de capa
    if (!coverFile && !existingCoverUrl) {
      toast({
        title: 'Imagem obrigatória',
        description: 'Adiciona uma imagem de capa para otimizar a partilha nas redes sociais.',
        variant: 'destructive',
      });
      setActiveTab('social');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Utilizador não autenticado. Por favor, faça login novamente.');
      }

      const finalSlug = data.slug || slugify(data.title);
      
      if (finalSlug) {
        let query = supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', finalSlug);
        if (editId) {
          query = query.neq('id', editId);
        }
        const { data: existingPosts, error: slugError } = await query;

        if (slugError) throw slugError;
        
        if (existingPosts && existingPosts.length > 0) {
          setError('slug', {
            type: 'manual',
            message: 'Já existe um post com este slug.',
          });
          setFocus('slug');
          toast({
            title: 'Slug duplicado',
            description: 'Já existe um artigo com este slug. Altere o slug ou o título.',
            variant: 'destructive',
          });
          throw new Error('Slug já está em uso');
        }
      }

      let coverUrl: string | null = existingCoverUrl;
      if (coverFile) {
        const uploadedUrl = await uploadCover();
        coverUrl = uploadedUrl;
      }

      const rawTags = data.tags
        ? data.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
        : [];
      const isUuid = (val: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
      const tagsValue = rawTags.length === 0 ? null : (rawTags.every(isUuid) ? rawTags : null);
      
      const postData = {
        title: data.title.trim(),
        slug: finalSlug,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        tags: tagsValue,
        status: data.publish ? 'published' : 'draft',
        author_id: userData.user.id,
        cover_image_url: coverUrl,
        updated_at: new Date().toISOString(),
        published_at: data.publish ? new Date().toISOString() : null,
      };

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

      toast({
        title: 'Sucesso!',
        description: editId 
          ? (data.publish ? 'Post atualizado e publicado!' : 'Post atualizado como rascunho!')
          : (data.publish ? 'Post criado e publicado!' : 'Post criado como rascunho!'),
      });

      if (!editId) {
        reset();
        setCoverFile(null);
        setExistingCoverUrl(null);
        setImagePreview(null);
      }

      onSaved?.();

      if (editId) {
        setTimeout(() => {
          navigate('/admin/blog');
        }, 1500);
      }
    } catch (error: unknown) {
      console.error('Erro ao salvar post:', error);
      const anyErr = error as any;
      const errorMessage =
        anyErr?.message ||
        anyErr?.error_description ||
        anyErr?.description ||
        anyErr?.details ||
        anyErr?.hint ||
        'Ocorreu um erro ao salvar o post. Por favor, tente novamente.';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular scores de SEO
  const titleScore = title ? (title.length <= 60 ? 100 : Math.max(0, 100 - (title.length - 60) * 5)) : 0;
  const excerptScore = excerpt ? (excerpt.length <= 160 ? 100 : Math.max(0, 100 - (excerpt.length - 160) * 3)) : 0;
  const imageScore = (imagePreview || existingCoverUrl) ? 100 : 0;
  const overallScore = Math.round((titleScore + excerptScore + imageScore) / 3);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header fixo */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/blog')}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold">
              {editId ? 'Editar Post' : 'Novo Post'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Score SEO */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">SEO Score:</span>
              <Badge className={getScoreBadge(overallScore)}>
                {overallScore}%
              </Badge>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue('publish', false)}
              disabled={isSubmitting}
            >
              Guardar Rascunho
            </Button>
            
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit((data) => onSubmit({ ...data, publish: true }))}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'A publicar...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Coluna principal - Conteúdo */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Conteúdo
                  </TabsTrigger>
                  <TabsTrigger value="social" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Redes Sociais
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6 mt-6">
                  {/* Título */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        Título
                        <span className={`text-sm font-normal ${title?.length > 60 ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {title?.length || 0}/60
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Título otimizado para SEO (máx. 60 caracteres)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <input
                        {...register('title')}
                        placeholder="Ex: Como preservar memórias para gerações futuras"
                        className="w-full text-xl font-semibold border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"
                      />
                      {errors.title && (
                        <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.title.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Descrição / Excerpt */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        Descrição
                        <span className={`text-sm font-normal ${(excerpt?.length || 0) > 160 ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {excerpt?.length || 0}/160
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Esta descrição aparece nos resultados de pesquisa e nas redes sociais
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        {...register('excerpt')}
                        placeholder="Descrição que capta a atenção e resume o artigo..."
                        rows={3}
                        className="w-full border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 resize-none"
                      />
                      {errors.excerpt && (
                        <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.excerpt.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Conteúdo */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Conteúdo</CardTitle>
                      <CardDescription>
                        Escreve em Markdown: **negrito**, *itálico*, # títulos, - listas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        {...register('content')}
                        placeholder="Escreve o conteúdo do artigo aqui...

# Título da secção

Parágrafo introdutório com **texto em negrito** e *itálico*.

## Subtítulo

- Ponto 1
- Ponto 2
- Ponto 3"
                        rows={20}
                        className="w-full border rounded-lg p-4 font-mono text-sm bg-muted/30 focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                      />
                      {errors.content && (
                        <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.content.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6 mt-6">
                  {/* Imagem de capa */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Imagem de Destaque
                        {(imagePreview || existingCoverUrl) && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        Esta imagem aparece quando o artigo é partilhado nas redes sociais.
                        <br />
                        <strong>Recomendado:</strong> 1200×630 pixels (proporção 1.91:1)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(existingCoverUrl || imagePreview) ? (
                        <div className="relative">
                          <div className="aspect-[1200/630] rounded-lg overflow-hidden border border-border">
                            <img
                              src={imagePreview || existingCoverUrl || ''}
                              alt="Pré-visualização da capa"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="absolute top-3 right-3"
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-[1200/630] border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Clica para carregar imagem
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            JPEG, PNG, GIF ou WebP (máx. 10MB)
                          </span>
                          <input
                            type="file"
                            id="cover-file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </label>
                      )}
                    </CardContent>
                  </Card>

                  {/* Preview Social */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Pré-visualização nas Redes Sociais</CardTitle>
                      <CardDescription>
                        Como o artigo vai aparecer quando partilhado
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Facebook Preview */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-[#f0f2f5] px-3 py-2 flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-[#1877F2]" />
                          <span className="text-xs font-medium text-gray-600">Facebook</span>
                        </div>
                        <div className="bg-white">
                          {(imagePreview || existingCoverUrl) ? (
                            <img
                              src={imagePreview || existingCoverUrl || ''}
                              alt="Preview"
                              className="w-full aspect-[1200/630] object-cover"
                            />
                          ) : (
                            <div className="w-full aspect-[1200/630] bg-muted flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="p-3 border-t">
                            <p className="text-[11px] text-gray-500 uppercase">keepla.pt</p>
                            <p className="font-semibold text-[15px] text-gray-900 line-clamp-2 mt-0.5">
                              {title || 'Título do artigo'}
                            </p>
                            <p className="text-[13px] text-gray-500 line-clamp-1 mt-0.5">
                              {excerpt || 'Descrição do artigo...'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Twitter Preview */}
                      <div className="border rounded-xl overflow-hidden">
                        <div className="bg-black px-3 py-2 flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-white" />
                          <span className="text-xs font-medium text-white">Twitter / X</span>
                        </div>
                        <div className="bg-white">
                          {(imagePreview || existingCoverUrl) ? (
                            <img
                              src={imagePreview || existingCoverUrl || ''}
                              alt="Preview"
                              className="w-full aspect-[1200/630] object-cover"
                            />
                          ) : (
                            <div className="w-full aspect-[1200/630] bg-muted flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="p-3 border-t">
                            <p className="font-medium text-[15px] text-gray-900 line-clamp-2">
                              {title || 'Título do artigo'}
                            </p>
                            <p className="text-[13px] text-gray-500 line-clamp-2 mt-0.5">
                              {excerpt || 'Descrição do artigo...'}
                            </p>
                            <p className="text-[13px] text-gray-400 mt-1">keepla.pt</p>
                          </div>
                        </div>
                      </div>

                      {/* LinkedIn Preview */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-[#0A66C2] px-3 py-2 flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-white" />
                          <span className="text-xs font-medium text-white">LinkedIn</span>
                        </div>
                        <div className="bg-white">
                          {(imagePreview || existingCoverUrl) ? (
                            <img
                              src={imagePreview || existingCoverUrl || ''}
                              alt="Preview"
                              className="w-full aspect-[1200/630] object-cover"
                            />
                          ) : (
                            <div className="w-full aspect-[1200/630] bg-muted flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="p-3 border-t">
                            <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                              {title || 'Título do artigo'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">keepla.pt</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Configurações */}
            <div className="space-y-6">
              {/* SEO Score Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Pontuação SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {overallScore >= 80 ? 'Excelente!' : overallScore >= 50 ? 'Pode melhorar' : 'Precisa de atenção'}
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Título</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-16 rounded-full bg-muted overflow-hidden`}>
                          <div 
                            className={`h-full ${titleScore >= 80 ? 'bg-green-500' : titleScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${titleScore}%` }}
                          />
                        </div>
                        <span className={getScoreColor(titleScore)}>{titleScore}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Descrição</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-16 rounded-full bg-muted overflow-hidden`}>
                          <div 
                            className={`h-full ${excerptScore >= 80 ? 'bg-green-500' : excerptScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${excerptScore}%` }}
                          />
                        </div>
                        <span className={getScoreColor(excerptScore)}>{excerptScore}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Imagem</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-16 rounded-full bg-muted overflow-hidden`}>
                          <div 
                            className={`h-full ${imageScore >= 80 ? 'bg-green-500' : imageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${imageScore}%` }}
                          />
                        </div>
                        <span className={getScoreColor(imageScore)}>{imageScore}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* URL Slug */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">URL do Artigo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground shrink-0">/blog/</span>
                    <input
                      {...register('slug')}
                      placeholder="url-do-artigo"
                      className="flex-1 border rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      onChange={(e) => {
                        clearErrors('slug');
                        register('slug').onChange(e);
                      }}
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-destructive text-xs mt-2">{errors.slug.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tags</CardTitle>
                  <CardDescription>Separa por vírgulas</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    {...register('tags')}
                    placeholder="memórias, família, keepsakes"
                    className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </CardContent>
              </Card>

              {/* Estado de publicação */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <input
                      id="publish"
                      type="checkbox"
                      {...register('publish')}
                      className="h-4 w-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="publish" className="text-sm">
                      {publish ? (
                        <span className="text-green-600 font-medium">Publicar agora</span>
                      ) : (
                        <span className="text-muted-foreground">Guardar como rascunho</span>
                      )}
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;