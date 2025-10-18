import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/components/auth/SecureInputValidation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  tags?: string[];
  status: "draft" | "published";
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPost(data as BlogPost);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <p>Carregando artigo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <p className="text-red-600">Erro ao carregar artigo: {error}</p>
        <Link to="/blog" className="text-blue-600 underline">Voltar ao Blog</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-2xl font-semibold mb-4">Artigo não encontrado</h1>
        <p className="mb-6">O artigo que você procurou não existe ou ainda não foi publicado.</p>
        <Link to="/blog" className="text-blue-600 underline">Voltar ao Blog</Link>
      </div>
    );
  }

  const safeUrl = (url?: string) => {
    if (!url) return undefined;
    try {
      const u = new URL(url, window.location.origin);
      if (u.protocol === "http:" || u.protocol === "https:") return u.href;
      if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) return url;
      return undefined;
    } catch {
      if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) return url;
      return undefined;
    }
  };

  const coverUrl = safeUrl(post.cover_image_url);
  const safeContent = sanitizeHtml(post.content);

  return (
    <article className="container mx-auto px-4 py-24 prose prose-lg">
      <Link to="/blog" className="no-underline text-blue-600">← Voltar</Link>
      <h1>{post.title}</h1>
      {post.published_at && (
        <p className="text-gray-500">Publicado em {new Date(post.published_at).toLocaleDateString()}</p>
      )}

      {coverUrl && (
        <img
          src={coverUrl}
          alt={post.title}
          className="w-full h-auto rounded-lg my-6"
          loading="lazy"
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: safeContent }} />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <strong>Tags:</strong>
          <div className="flex gap-2 mt-2 flex-wrap">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 border rounded text-sm text-gray-600">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}