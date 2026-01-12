import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Check, Instagram, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { gamificationService } from "@/services/gamificationService";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  published_at: string;
  tags: string[];
  status: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post?.title || '')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent((post?.title || '') + ' - ' + currentUrl)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link do artigo foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: "Link copiado!",
      description: "Cola o link no Instagram Stories ou na tua bio.",
    });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || "Artigo Keepla",
        text: post?.excerpt || "",
        url: currentUrl,
      }).catch(console.error);
    }
  };

  useEffect(() => {
    let cleanupTimer: (() => void) | undefined;

    const fetchPost = async () => {
      if (!slug) {
        navigate("/blog");
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (error || !data) {
          throw new Error("Post não encontrado");
        }

        setPost(data);

        // Gamification: View
        gamificationService.trackEvent('content_view', { 
          slug, 
          title: data.title,
          type: 'blog_post' 
        });

        // Gamification: Reading Timer (60s)
        cleanupTimer = gamificationService.trackReadingTime(data.id);

      } catch (error) {
        console.error("Erro ao carregar post:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o artigo.",
          variant: "destructive",
        });
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => {
      if (cleanupTimer) cleanupTimer();
    };
  }, [slug, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner size="lg" text="A carregar artigo..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <Button onClick={() => navigate("/blog")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Usar sempre a imagem OG da Keepla para partilhas nas redes sociais
  const ogImageUrl = "/og-image.png";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={post.title}
        description={post.excerpt || `Leia "${post.title}" no blog Keepla - Memórias que ficam, entregues para sempre.`}
        keywords={post.tags?.join(", ") || "blog, artigo, keepla, memórias"}
        image={ogImageUrl}
        url={currentUrl}
        type="article"
        author="Keepla"
        publishedTime={post.published_at || undefined}
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/blog")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Blog
        </Button>

        <article className="max-w-4xl mx-auto">
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Imagem de capa otimizada para partilha (1200x630 ideal) */}
            {post.cover_image_url && (() => {
              const isVideo = /\.(mp4|webm|ogg)$/i.test(post.cover_image_url);
              return (
                <div className="mb-8 rounded-xl overflow-hidden shadow-2xl aspect-[1200/630]">
                  {isVideo ? (
                    <video
                      controls
                      src={post.cover_image_url}
                      className="w-full h-full object-cover"
                      autoPlay={false}
                      loop={false}
                      muted={false}
                    />
                  ) : (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })()}

            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 font-serif italic leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Botões de partilha social - seguindo manual da marca */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground font-medium">Partilhar:</span>
              
              <a 
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                aria-label="Partilhar no Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              
              <a 
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                aria-label="Partilhar no Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              
              <a 
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                aria-label="Partilhar no LinkedIn"
              >
              <Linkedin className="h-4 w-4" />
              </a>

              <a 
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                aria-label="Partilhar no WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>

              <button
                onClick={handleInstagramShare}
                className="p-2 rounded-full border border-border bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                aria-label="Partilhar no Instagram"
              >
                <Instagram className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-full border border-border bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors"
                aria-label="Copiar link"
              >
                {copied ? <Check className="h-4 w-4 text-[#E63946]" /> : <Copy className="h-4 w-4" />}
              </button>

              {'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="p-2 rounded-full border border-[#E63946] bg-[#E63946] text-white hover:bg-[#E63946]/90 transition-colors"
                  aria-label="Mais opções de partilha"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.header>

          <motion.div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ReactMarkdown>
              {post.content.replace(/\n/g, "  \n")}
            </ReactMarkdown>
          </motion.div>

          {/* CTA final */}
          <motion.div 
            className="mt-12 p-8 bg-muted/50 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-2">Gostaste deste artigo?</h3>
            <p className="text-muted-foreground mb-4">Partilha-o com quem também valoriza memórias.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a 
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-foreground bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors text-sm font-medium"
              >
                Facebook
              </a>
              <a 
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-foreground bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors text-sm font-medium"
              >
                Twitter
              </a>
              <a 
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-foreground bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors text-sm font-medium"
              >
                LinkedIn
              </a>
              <a 
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-foreground bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors text-sm font-medium"
              >
                WhatsApp
              </a>
              <button
                onClick={handleInstagramShare}
                className="px-4 py-2 rounded-lg border border-foreground bg-background text-foreground hover:border-[#E63946] hover:text-[#E63946] transition-colors text-sm font-medium"
              >
                Instagram
              </button>
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
