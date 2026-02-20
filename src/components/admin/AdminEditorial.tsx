import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  author_name: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number | null;
};

const AdminEditorial = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,title,slug,status,author_name,created_at,updated_at,published_at,views")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar posts:", error);
      toast({
        title: "Erro ao carregar posts",
        description: "Não foi possível carregar os posts editoriais.",
        variant: "destructive",
      });
    } else {
      setPosts(data as BlogPost[]);
    }

    setLoading(false);
  };

  const approvePost = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao aprovar:", error);
      toast({ title: "Erro ao aprovar", variant: "destructive" });
      setProcessingId(null);
      return;
    }

    toast({ title: "Post publicado", description: "O post está visível no blog." });
    await fetchPosts();
    setProcessingId(null);
  };

  const unpublishPost = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: "draft",
        published_at: null,
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao despublicar:", error);
      toast({ title: "Erro ao despublicar", variant: "destructive" });
      setProcessingId(null);
      return;
    }

    toast({ title: "Post movido para rascunho" });
    await fetchPosts();
    setProcessingId(null);
  };

  const deletePost = async (id: string) => {
    const confirmed = confirm("Eliminar este post?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao eliminar:", error);
      toast({ title: "Erro ao eliminar", variant: "destructive" });
      return;
    }

    toast({ title: "Post eliminado" });
    await fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const drafts = useMemo(() => posts.filter((p) => p.status === "draft"), [posts]);
  const published = useMemo(() => posts.filter((p) => p.status === "published"), [posts]);

  if (loading) return <div>Carregar...</div>;

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editorial</h1>
        <Button variant="outline" onClick={fetchPosts} disabled={loading}>
          Atualizar
        </Button>
      </div>

      {/* RASCUNHOS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Rascunhos</h2>
        {drafts.length === 0 ? (
          <p>Sem rascunhos.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Título</th>
                <th className="text-left p-2">Slug</th>
                <th className="p-2">Autor</th>
                <th className="p-2">Criado</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="p-2">{post.title}</td>
                  <td className="p-2 text-sm text-muted-foreground">{post.slug}</td>
                  <td className="p-2">{post.author_name || "Equipa Keepla"}</td>
                  <td className="p-2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      disabled={processingId === post.id}
                      onClick={() => approvePost(post.id)}
                    >
                      Aprovar
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deletePost(post.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* PUBLICADOS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Publicados</h2>
        {published.length === 0 ? (
          <p>Sem posts publicados.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Título</th>
                <th className="text-left p-2">Slug</th>
                <th className="p-2">Publicado</th>
                <th className="p-2">Views</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {published.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="p-2">{post.title}</td>
                  <td className="p-2 text-sm text-muted-foreground">{post.slug}</td>
                  <td className="p-2">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">{post.views ?? 0}</td>
                  <td className="p-2">
                    <button
                      className="bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      disabled={processingId === post.id}
                      onClick={() => unpublishPost(post.id)}
                    >
                      Despublicar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminEditorial;
