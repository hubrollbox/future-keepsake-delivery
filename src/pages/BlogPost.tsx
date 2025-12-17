import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        navigate("/admin/blog");
        return;
      }

      setTitle(data.title ?? "");
      setSlug(data.slug ?? "");
      setExcerpt(data.excerpt ?? "");
      setContent(data.content ?? "");
      setExistingCoverUrl(data.cover_image_url ?? null);

      if (Array.isArray(data.tags)) {
        setTags(data.tags.join(", "));
      } else {
        setTags("");
      }

      setInitialLoading(false);
    };

    loadPost();
  }, [id, navigate]);

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return null;

    const ext = coverFile.name.split(".").pop();
    const fileName = `blog/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("media")
      .upload(fileName, coverFile, { upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Sem utilizador autenticado");

      let coverUrl: string | null = null;

      if (coverFile) {
        coverUrl = await uploadCover();
      }

      const row: any = {
        title,
        slug: slugify(slug || title),
        excerpt,
        content,
        tags: tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        status: publish ? "published" : "draft",
        author_id: user.id,
      };

      // 🔴 correção crítica: só atualiza capa se houver nova
      if (coverUrl) {
        row.cover_image_url = coverUrl;
      }

      if (id) {
        await supabase.from("blog_posts").update(row).eq("id", id);
      } else {
        await supabase.from("blog_posts").insert(row);
      }

      navigate("/admin/blog");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Slug (opcional)"
        value={slug}
        onChange={e => setSlug(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="Excerto"
        value={excerpt}
        onChange={e => setExcerpt(e.target.value)}
      />

      <textarea
        className="w-full border p-2 min-h-[200px]"
        placeholder="Conteúdo"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Tags (separadas por vírgula)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />

      {existingCoverUrl && !coverFile && (
        <div className="text-sm text-gray-500">
          Capa atual definida
        </div>
      )}

      <input
        type="file"
        accept="image/*,video/*"
        onChange={e => setCoverFile(e.target.files?.[0] ?? null)}
      />

      <div className="flex gap-2">
        <Button disabled={loading} onClick={() => handleSubmit(false)}>
          Guardar rascunho
        </Button>
        <Button disabled={loading} onClick={() => handleSubmit(true)}>
          Publicar
        </Button>
      </div>
    </div>
  );
}