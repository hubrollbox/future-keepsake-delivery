import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema de validação com Zod
const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(200, "O título não pode exceder 200 caracteres"),
  slug: z
    .string()
    .max(200, "O slug não pode exceder 200 caracteres")
    .optional()
    .or(z.literal("")),
  excerpt: z
    .string()
    .max(500, "O excerto não pode exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
  tags: z
    .string()
    .optional()
    .or(z.literal("")),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

// Função para gerar slug
function slugify(text: string): string {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();
}

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const content = watch("content");

  // Efeito para gerar slug automático a partir do título
  useEffect(() => {
    if (title && (!slug || slug === slugify(title))) {
      const generatedSlug = slugify(title);
      if (generatedSlug !== slug) {
        setValue("slug", generatedSlug, { shouldValidate: true });
      }
    }
  }, [title, slug, setValue]);

  // Carregar post existente
  useEffect(() => {
    if (!id) {
      setInitialLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          throw new Error("Post não encontrado");
        }

        reset({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        });

        setExistingCoverUrl(data.cover_image_url);
        setInitialLoading(false);
      } catch (error) {
        console.error("Erro ao carregar post:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o post.",
          variant: "destructive",
        });
        navigate("/admin/blog");
      }
    };

    loadPost();
  }, [id, navigate, reset, toast]);

  // Preview da imagem selecionada
  useEffect(() => {
    if (coverFile) {
      const previewUrl = URL.createObjectURL(coverFile);
      setImagePreview(previewUrl);
      
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    } else {
      setImagePreview(null);
    }
  }, [coverFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validação do ficheiro
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Formato de ficheiro não suportado. Use imagens (JPEG, PNG, GIF, WebP) ou vídeos (MP4, WebM).",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "Erro",
          description: "O ficheiro é muito grande. O tamanho máximo é 10MB.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCoverFile(file);
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setExistingCoverUrl(null);
  };

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return existingCoverUrl;

    try {
      const fileExt = coverFile.name.split(".").pop();
      const fileName = `blog-covers/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, coverFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        throw new Error("Falha no upload da imagem");
      }

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      throw error;
    }
  };

  const onSubmit = async (data: BlogPostFormData, publish: boolean) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Verificar slug único (exceto para o post atual)
      const finalSlug = slug || slugify(data.title);
      
      if (finalSlug) {
        const { data: existingPosts, error: slugError } = await supabase
          .from("blog_posts")
          .select("id")
          .eq("slug", finalSlug)
          .neq("id", id || "");

        if (slugError) throw slugError;
        
        if (existingPosts && existingPosts.length > 0) {
          throw new Error("Já existe um post com este slug. Por favor, escolha outro.");
        }
      }

      // Obter utilizador autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Utilizador não autenticado. Por favor, faça login novamente.");
      }

      // Upload da imagem (se houver)
      let coverUrl = existingCoverUrl;
      if (coverFile) {
        coverUrl = await uploadCover();
      }

      // Preparar dados para inserção/atualização
      const postData = {
        title: data.title.trim(),
        slug: finalSlug,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        tags: data.tags
          ? data.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag.length > 0)
          : [],
        status: publish ? "published" : "draft",
        author_id: user.id,
        cover_image_url: coverUrl,
        updated_at: new Date().toISOString(),
      };

      // Inserir ou atualizar
      let error;
      if (id) {
        const result = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);
        error = result.error;
      } else {
        const result = await supabase
          .from("blog_posts")
          .insert([{ ...postData, created_at: new Date().toISOString() }]);
        error = result.error;
      }

      if (error) throw error;

      // Feedback de sucesso
      toast({
        title: "Sucesso!",
        description: publish 
          ? "Post publicado com sucesso!" 
          : "Rascunho guardado com sucesso!",
      });

      // Navegar de volta após breve delay
      setTimeout(() => {
        navigate("/admin/blog");
      }, 1500);

    } catch (error: unknown) {
      console.error("Erro ao guardar post:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro ao guardar o post. Por favor, tente novamente.";

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {id ? "Editar Post" : "Novo Post"}
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/blog")}
          disabled={isSubmitting}
        >
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            id="title"
            {...register("title")}
            placeholder="Título do post"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-required="true"
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-red-600 text-sm mt-1">
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
              {...register("slug")}
              placeholder="slug-do-post"
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby={errors.slug ? "slug-error slug-help" : "slug-help"}
            />
          </div>
          <p id="slug-help" className="text-sm text-gray-500">
            Será gerado automaticamente a partir do título. Pode editar manualmente.
          </p>
          {errors.slug && (
            <p id="slug-error" className="text-red-600 text-sm mt-1">
              {errors.slug.message}
            </p>
          )}
        </div>

        {/* Excerto */}
        <div className="space-y-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerto
          </label>
          <textarea
            id="excerpt"
            {...register("excerpt")}
            placeholder="Breve descrição do post"
            rows={2}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            aria-describedby={errors.excerpt ? "excerpt-error" : undefined}
          />
          <p className="text-sm text-gray-500">
            {watch("excerpt")?.length || 0}/500 caracteres
          </p>
          {errors.excerpt && (
            <p id="excerpt-error" className="text-red-600 text-sm mt-1">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        {/* Conteúdo */}
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Conteúdo *
          </label>
          <textarea
            id="content"
            {...register("content")}
            placeholder="Escreva o conteúdo do post aqui..."
            rows={12}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
            aria-required="true"
            aria-invalid={errors.content ? "true" : "false"}
            aria-describedby={errors.content ? "content-error content-counter" : "content-counter"}
          />
          <div className="flex justify-between items-center">
            <p id="content-counter" className="text-sm text-gray-500">
              {content?.length || 0} caracteres
            </p>
            {errors.content && (
              <p id="content-error" className="text-red-600 text-sm">
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
            {...register("tags")}
            placeholder="tecnologia, blog, dicas (separadas por vírgula)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-describedby="tags-help"
          />
          <p id="tags-help" className="text-sm text-gray-500">
            Separe as tags por vírgulas
          </p>
        </div>

        {/* Imagem de capa */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Imagem de capa
          </label>
          
          {(existingCoverUrl || imagePreview) && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Pré-visualização:</p>
              <div className="relative max-w-md">
                {(imagePreview || existingCoverUrl) && (
                  <img
                    src={imagePreview || existingCoverUrl || ""}
                    alt="Pré-visualização da capa"
                    className="rounded-lg border border-gray-300 max-h-64 object-cover w-full"
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2"
                >
                  Remover
                </Button>
              </div>
            </div>
          )}

          <div>
            <input
              type="file"
              id="cover"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-describedby="cover-help"
            />
            <p id="cover-help" className="text-sm text-gray-500 mt-1">
              Formatos suportados: JPG, PNG, GIF, WebP, MP4, WebM. Máximo: 10MB
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit((data) => onSubmit(data, false))}
            disabled={isSubmitting || !isDirty}
            className="flex-1"
          >
            {isSubmitting ? "A guardar..." : "Guardar rascunho"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, true))}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "A publicar..." : "Publicar agora"}
          </Button>
        </div>
      </form>
    </div>
  );
}