import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  tags?: string[];
  status: "draft" | "published";
  created_at: string;
  published_at?: string | null;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id,title,slug,excerpt,content,cover_image_url,tags,status,created_at,published_at"
        )
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        setError("Artigo não encontrado ou não publicado.");
        setPost(null);
      } else {
        setPost(data as BlogPost);
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const safeUrl = (url?: string) => {
    if (!url) return undefined;
    try {
      const u = new URL(url, window.location.origin);
      if (u.protocol === "http:" || u.protocol === "https:") return u.href;
    } catch {
      if (url.startsWith("/")) return url;
    }
    return undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <p>A carregar artigo…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <p className="text-destructive mb-4">{error}</p>
          <Link to="/blog" className="underline">
            ← Voltar ao blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const coverUrl = safeUrl(post.cover_image_url);

  const safeContent = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "pre",
      "code",
      "img",
      "a"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"]
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={post.title}
        description={post.excerpt || post.title}
      />

      <Navigation />

      <article className="container mx-auto px-4 py-24 max-w-3xl">
        <Link to="/blog" className="text-sm underline">
          ← Voltar ao blog
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          {post.title}
        </h1>

        {coverUrl && (
          <img
            src={coverUrl}
            alt={post.title}
            className="my-10 w-full rounded-lg"
            loading="lazy"
          />
        )}

        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12">
            <p className="text-sm font-medium mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs border rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
