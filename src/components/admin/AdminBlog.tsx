import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, UploadCloud, CheckCircle2, CircleSlash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sanitizeHtml, sanitizeInput } from "@/components/auth/SecureInputValidation";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  tags?: string[];
  status?: "draft" | "published";
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogPost>({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: [], status: "draft" });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error("Erro a carregar posts:", err?.message || err);
      toast({ title: "Blog", description: "Não foi possível carregar os artigos. Verifica a tabela 'blog_posts' no Supabase.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = () => {
    setEditingPost(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: [], status: "draft" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setForm({ ...post });
    setIsDialogOpen(true);
  };
  // Auto-generate slug from title if slug is empty or matches previous auto-slug
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const savePost = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Autenticação necessária", description: "Por favor, inicie sessão para guardar o artigo.", variant: "destructive" });
        return;
      }

      const normalizedSlug = (form.slug || "").trim().toLowerCase();
      const finalSlug = normalizedSlug || slugify(form.title || "");

      const isUuid = (val: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
      const normalizedTags = (form.tags || []).map(t => t.trim()).filter(Boolean);
      const payload: any = {
        ...form,
        slug: finalSlug,
        content: sanitizeHtml(form.content || ""),
        excerpt: sanitizeInput(form.excerpt || ""),
        tags: normalizedTags.length === 0 ? null : (normalizedTags.every(isUuid) ? normalizedTags : null),
        updated_at: new Date().toISOString(),
      };

      if (!payload.author_id) {
        payload.author_id = user.id;
      }

      if (editingPost?.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingPost.id);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Artigo atualizado com sucesso." });
      } else {
        payload.created_at = new Date().toISOString();
        const { error } = await supabase.from("blog_posts").insert([payload]);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Artigo criado com sucesso." });
      }
      setIsDialogOpen(false);
      setEditingPost(null);
      await fetchPosts();
    } catch (err: any) {
      console.error("Erro a guardar post:", err?.message || err);
      toast({ title: "Erro", description: "Não foi possível guardar o artigo.", variant: "destructive" });
    }
  };

  const deletePost = async (id?: string) => {
    if (!id) return;
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Sucesso", description: "Artigo removido com sucesso." });
      await fetchPosts();
    } catch (err: any) {
      console.error("Erro a remover post:", err?.message || err);
      toast({ title: "Erro", description: "Não foi possível remover o artigo.", variant: "destructive" });
    }
  };

  const publishToggle = async (post: BlogPost) => {
    if (!post.id) return;
    const nextStatus = post.status === "published" ? "draft" : "published";
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ status: nextStatus, published_at: nextStatus === "published" ? new Date().toISOString() : null })
        .eq("id", post.id);
      if (error) throw error;
      toast({ title: nextStatus === "published" ? "Publicado" : "Rascunho", description: nextStatus === "published" ? "Artigo publicado." : "Artigo despublicado." });
      await fetchPosts();
    } catch (err: any) {
      console.error("Erro a publicar:", err?.message || err);
      toast({ title: "Erro", description: "Não foi possível alterar o estado do artigo.", variant: "destructive" });
    }
  };

  // Open creation dialog when query param new=1 is present
  const params = new URLSearchParams(window.location.search);
  if (params.get("new") === "1") {
    openNewDialog();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-fraunces text-steel-blue">Gestão de Blog</h1>
        <Button onClick={openNewDialog} variant="brand">
          <Plus className="h-4 w-4 mr-2" /> Novo Artigo
        </Button>
      </div>

      <Card className="emotion-card border-dusty-rose/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="py-6 text-misty-gray">A carregar artigos...</TableCell></TableRow>
              ) : posts.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-6 text-misty-gray">Sem artigos disponíveis.</TableCell></TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium text-steel-blue">{post.title}</TableCell>
                    <TableCell>
                      {post.status === "published" ? (
                        <span className="text-sage-green flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" />Publicado</span>
                      ) : (
                        <span className="text-misty-gray flex items-center"><CircleSlash2 className="h-4 w-4 mr-1" />Rascunho</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-misty-gray">{post.updated_at ? new Date(post.updated_at).toLocaleString('pt-PT') : '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(post)}>
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => publishToggle(post)}>
                        <UploadCloud className="h-4 w-4 mr-1" /> {post.status === "published" ? "Despublicar" : "Publicar"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePost(post.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Apagar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl bg-white text-keepla-black border border-keepla-black shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-fraunces text-steel-blue">{editingPost ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label className="text-gray-700">Título</Label>
              <Input value={form.title} onChange={(e) => {
                const newTitle = e.target.value;
                const autoSlug = slugify(newTitle);
                setForm({
                  ...form,
                  title: newTitle,
                  slug: form.slug ? form.slug : autoSlug,
                });
              }} />
            </div>
            <div>
              <Label className="text-gray-700">Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-gray-700">Excerto</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-gray-700">Conteúdo</Label>
              <ReactQuill theme="snow" value={form.content || ""} onChange={(val) => setForm({ ...form, content: val })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-gray-700">Imagem de capa (URL)</Label>
              <div className="flex gap-2">
                <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="https://..." />
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => document.getElementById('image-upload')?.click()}>
                  <UploadCloud className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      setLoading(true);
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                      const filePath = `${fileName}`;

                      const { error: uploadError } = await supabase.storage
                        .from('blog-covers')
                        .upload(filePath, file);

                      if (uploadError) throw uploadError;

                      const { data: { publicUrl } } = supabase.storage
                        .from('blog-covers')
                        .getPublicUrl(filePath);

                      setForm({ ...form, cover_image_url: publicUrl });
                      toast({ title: "Sucesso", description: "Imagem carregada com sucesso." });
                    } catch (error: any) {
                      console.error('Error uploading image:', error);
                      toast({ title: "Erro", description: "Falha ao carregar imagem.", variant: "destructive" });
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-700">Tags (vírgulas)</Label>
              <Input value={(form.tags || []).join(',')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
            </div>
            <div>
              <Label className="text-gray-700">Estado</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: (e.target.value as 'draft' | 'published') })} className="w-full border rounded px-3 py-2 text-sm">
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button variant="brand" onClick={savePost}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
