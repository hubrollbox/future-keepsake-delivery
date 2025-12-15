import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SEOHead from "@/components/SEOHead";
import { motion, Variants } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  published_at?: string | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

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
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Blog"
        description="Artigos sobre memórias, keepsakes, cápsulas do tempo e como guardar momentos especiais para o futuro."
        keywords="blog keepla, artigos memórias, cápsulas tempo, dicas presentes"
      />
      <Navigation />
      <motion.main 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-10"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Blog</h1>
            <p className="text-muted-foreground mt-2 font-georgia italic">
              Histórias, novidades e reflexões sobre guardar emoções.
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/admin/blog?new=1')} variant="default">
              <Plus className="h-4 w-4 mr-2" /> Criar Post
            </Button>
          )}
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-card border border-primary text-primary p-6 mb-8 rounded-lg"
            variants={itemVariants}
          >
            <p className="font-medium">{error}</p>
            {isAdmin ? (
              <div className="mt-4">
                <Button size="sm" onClick={() => navigate('/admin/blog?new=1')}>
                  Criar primeiro artigo
                </Button>
              </div>
            ) : (
              <p className="text-foreground mt-3">
                Se o problema persistir, por favor{" "}
                <a href="/contact" className="underline hover:text-primary transition-colors">
                  contacta o suporte
                </a>.
              </p>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <motion.div variants={itemVariants}>
            <LoadingSpinner size="lg" text="A carregar artigos..." />
          </motion.div>
        ) : posts.length === 0 && !error ? (
          <motion.div variants={itemVariants}>
            <p className="text-muted-foreground text-center py-12 font-georgia italic">
              Ainda não existem artigos publicados.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {posts.map((post) => {
              const coverUrl = safeUrl(post.cover_image_url);
              return (
                <motion.article 
                  key={post.id} 
                  className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {coverUrl && (
                    <div className="overflow-hidden">
                      <img 
                        src={coverUrl} 
                        alt={post.title} 
                        className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground mt-3 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-4 uppercase tracking-wide">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-PT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : ''}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Blog;
