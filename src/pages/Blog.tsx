import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  published_at?: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchPublished = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id,title,slug,excerpt,cover_image_url,published_at,status")
          .eq("status", "published")
          .order("published_at", { ascending: false });
        if (error) throw error;
        setPosts((data || []) as any);
      } catch (err) {
        console.error("Erro a carregar blog:", err);
        setPosts([]);
        setError("Não foi possível carregar os artigos. Verifica a tabela \"blog_posts\" no Supabase.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublished();
  }, []);

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

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-hero-sm font-fraunces text-steel-blue">Blog</h1>
            <p className="text-misty-gray">Histórias, novidades e reflexões sobre guardar emoções.</p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/admin/blog?new=1')} variant="brand">
              <Plus className="h-4 w-4 mr-2" /> Criar Post
            </Button>
          )}
        </div>
        {error && (
          <div className="bg-keepla-white border-2 border-keepla-red text-keepla-red p-4 mb-6 rounded-lg">
            <p className="font-medium">{error}</p>
            {isAdmin ? (
              <div className="mt-3">
                <Button size="sm" variant="brand" onClick={() => navigate('/admin/blog?new=1')}>Criar primeiro artigo</Button>
              </div>
            ) : (
              <p className="text-keepla-black mt-2">Se o problema persistir, por favor <a href="/contact" className="underline hover:text-keepla-red">contacta o suporte</a>.</p>
            )}
          </div>
        )}

        {loading ? (
          <LoadingSpinner size="lg" text="A carregar artigos..." />
        ) : posts.length === 0 ? (
          <p className="text-misty-gray">Ainda não existem artigos publicados.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const coverUrl = safeUrl(post.cover_image_url);
              return (
                <article key={post.id} className="emotion-card p-4 cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/blog/${post.slug}`)}>
                  {coverUrl && (
                    <img src={coverUrl} alt={post.title} className="w-full h-40 object-cover rounded mb-3" />
                  )}
                  <h2 className="text-xl font-fraunces text-steel-blue">{post.title}</h2>
                  {post.excerpt && <p className="text-misty-gray mt-2 text-sm">{post.excerpt}</p>}
                  <p className="text-xs text-misty-gray mt-2">{post.published_at ? new Date(post.published_at).toLocaleDateString('pt-PT') : ''}</p>
                </article>
              );
            })}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-hero-sm font-fraunces text-steel-blue">Blog</h1>
            <p className="text-misty-gray">Histórias, novidades e reflexões sobre guardar emoções.</p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/admin/blog?new=1')} variant="brand">
              <Plus className="h-4 w-4 mr-2" /> Criar Post
            </Button>
          )}
        </div>
        {error && (
          <div className="bg-keepla-white border-2 border-keepla-red text-keepla-red p-4 mb-6 rounded-lg">
            <p className="font-medium">{error}</p>
            {isAdmin ? (
              <div className="mt-3">
                <Button size="sm" variant="brand" onClick={() => navigate('/admin/blog?new=1')}>Criar primeiro artigo</Button>
              </div>
            ) : (
              <p className="text-keepla-black mt-2">Se o problema persistir, por favor <a href="/contact" className="underline hover:text-keepla-red">contacta o suporte</a>.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;