import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Markdown from "react-markdown";
import SEOHead from "@/components/SEOHead";

interface BlogPostType {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image_url?: string;
  published_at?: string | null;
  author_id?: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (error) throw error;
        setPost(data as BlogPostType);
      } catch (err) {
        console.error("Erro a carregar artigo:", err);
        setError("Artigo não encontrado ou não publicado.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-keepla-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="A carregar artigo..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-keepla-white">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-keepla-red">Erro</h1>
          <p className="mt-4 text-keepla-black">
            {error || "Artigo não encontrado."}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  /* -------------------------------
     Determinar corretamente se é vídeo
     ------------------------------- */
  const isVideo =
    typeof post.cover_image_url === "string" &&
    (
      post.cover_image_url.toLowerCase().endsWith(".mp4") ||
      post.cover_image_url.toLowerCase().endsWith(".mov") ||
      post.cover_image_url.toLowerCase().endsWith(".webm")
    );

  return (
    <div className="min-h-screen bg-keepla-white">
      <SEOHead
        title={post.title}
        description={post.content.substring(0, 150) + "..."}
        keywords="blog keepla, artigos memórias, cápsulas tempo, dicas presentes"
      />

      <Navigation />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <article>
          <h1 className="text-4xl md:text-5xl font-serif text-keepla-black mb-4">
            {post.title}
          </h1>

          <p className="text-sm text-keepla-gray mb-8">
            Publicado a{" "}
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString("pt-PT")
              : "Data desconhecida"}
          </p>

          {post.cover_image_url && (
            <div className="mb-10 rounded-lg overflow-hidden shadow-xl">
              {isVideo ? (
                <video
                  src={post.cover_image_url}
                  controls
                  preload="metadata"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              )}
            </div>
          )}

          <div className="prose prose-lg max-w-none text-keepla-black">
            <Markdown>{post.content}</Markdown>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;