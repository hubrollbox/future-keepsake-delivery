import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type BlogPost = {
  id: string;
  title: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number;
};

const AdminEditorial = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar posts:", error);
    } else {
      setPosts(data as BlogPost[]);
    }

    setLoading(false);
  };

  const approvePost = async (id: string) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao aprovar:", error);
      return;
    }

    fetchPosts();
  };

  const unpublishPost = async (id: string) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: "draft",
        published_at: null,
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao despublicar:", error);
      return;
    }

    fetchPosts();
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
      return;
    }

    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  if (loading) return <div>Carregar...</div>;

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Editorial</h1>

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
                <th className="p-2">Criado</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="p-2">{post.title}</td>
                  <td className="p-2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
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
                <th className="p-2">Publicado</th>
                <th className="p-2">Views</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {published.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="p-2">{post.title}</td>
                  <td className="p-2">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">{post.views ?? 0}</td>
                  <td className="p-2">
                    <button
                      className="bg-yellow-600 text-white px-3 py-1 rounded"
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