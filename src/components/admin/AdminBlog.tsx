import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  UploadCloud, 
  CheckCircle2, 
  CircleSlash2, 
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Calendar,
  Search,
  MoreVertical,
  AlertTriangle,
  X
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sanitizeHtml, sanitizeInput } from "@/components/auth/SecureInputValidation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  views?: number;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("content");
  const [form, setForm] = useState<BlogPost>({ 
    title: "", 
    slug: "", 
    excerpt: "", 
    content: "", 
    cover_image_url: "", 
    tags: [], 
    status: "draft" 
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  // Open creation dialog when query param new=1 is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      openNewDialog();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
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
      toast({ 
        title: "Erro ao carregar artigos", 
        description: "Verifica a ligação e tenta novamente.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = () => {
    setEditingPost(null);
    setForm({ 
      title: "", 
      slug: "", 
      excerpt: "", 
      content: "", 
      cover_image_url: "", 
      tags: [], 
      status: "draft" 
    });
    setActiveTab("content");
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setForm({ ...post });
    setActiveTab("content");
    setIsDialogOpen(true);
  };

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
    if (!form.title.trim()) {
      toast({ 
        title: "Título obrigatório", 
        description: "Adiciona um título ao artigo.", 
        variant: "destructive" 
      });
      return;
    }

    if (!form.excerpt?.trim()) {
      toast({ 
        title: "Descrição obrigatória", 
        description: "Adiciona uma descrição para SEO e redes sociais.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ 
          title: "Autenticação necessária", 
          description: "Por favor, inicia sessão para guardar o artigo.", 
          variant: "destructive" 
        });
        return;
      }

      const finalSlug = (form.slug || "").trim().toLowerCase() || slugify(form.title || "");

      // Check for duplicate slug
      let query = supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", finalSlug);
      
      if (editingPost?.id) {
        query = query.neq("id", editingPost.id);
      }
      
      const { data: existingPosts } = await query;
      
      if (existingPosts && existingPosts.length > 0) {
        toast({ 
          title: "Slug duplicado", 
          description: "Já existe um artigo com este URL. Altera o slug.", 
          variant: "destructive" 
        });
        return;
      }

      const isUuid = (val: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
      const normalizedTags = (form.tags || []).map(t => t.trim()).filter(Boolean);
      
      const payload: any = {
        title: sanitizeInput(form.title.trim()),
        slug: finalSlug,
        content: sanitizeHtml(form.content || ""),
        excerpt: sanitizeInput(form.excerpt || ""),
        cover_image_url: form.cover_image_url || null,
        tags: normalizedTags.length === 0 ? null : (normalizedTags.every(isUuid) ? normalizedTags : null),
        status: form.status || "draft",
        updated_at: new Date().toISOString(),
      };

      if (!editingPost?.id) {
        payload.author_id = user.id;
        payload.created_at = new Date().toISOString();
      }

      if (form.status === "published" && !editingPost?.published_at) {
        payload.published_at = new Date().toISOString();
      }

      if (editingPost?.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingPost.id);
        if (error) throw error;
        toast({ title: "Artigo atualizado", description: "As alterações foram guardadas." });
      } else {
        const { error } = await supabase.from("blog_posts").insert([payload]);
        if (error) throw error;
        toast({ title: "Artigo criado", description: "O artigo foi criado com sucesso." });
      }
      
      setIsDialogOpen(false);
      setEditingPost(null);
      await fetchPosts();
    } catch (err: any) {
      console.error("Erro a guardar post:", err?.message || err);
      toast({ 
        title: "Erro ao guardar", 
        description: err?.message || "Não foi possível guardar o artigo.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const deletePost = async () => {
    if (!postToDelete?.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postToDelete.id);
      if (error) throw error;
      
      toast({ 
        title: "Artigo eliminado", 
        description: `"${postToDelete.title}" foi removido permanentemente.` 
      });
      
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      await fetchPosts();
    } catch (err: any) {
      console.error("Erro a remover post:", err?.message || err);
      toast({ 
        title: "Erro ao eliminar", 
        description: "Não foi possível remover o artigo.", 
        variant: "destructive" 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const publishToggle = async (post: BlogPost) => {
    if (!post.id) return;
    const nextStatus = post.status === "published" ? "draft" : "published";
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ 
          status: nextStatus, 
          published_at: nextStatus === "published" ? new Date().toISOString() : null 
        })
        .eq("id", post.id);
      if (error) throw error;
      
      toast({ 
        title: nextStatus === "published" ? "Artigo publicado" : "Artigo despublicado", 
        description: nextStatus === "published" 
          ? "O artigo está agora visível no blog." 
          : "O artigo foi movido para rascunhos." 
      });
      
      await fetchPosts();
    } catch (err: any) {
      console.error("Erro a publicar:", err?.message || err);
      toast({ 
        title: "Erro", 
        description: "Não foi possível alterar o estado do artigo.", 
        variant: "destructive" 
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({ 
        title: "Formato inválido", 
        description: "Usa JPEG, PNG, GIF ou WebP.", 
        variant: "destructive" 
      });
      return;
    }

    if (file.size > maxSize) {
      toast({ 
        title: "Ficheiro muito grande", 
        description: "O ficheiro deve ter menos de 10MB.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-covers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-covers')
        .getPublicUrl(fileName);

      setForm({ ...form, cover_image_url: publicUrl });
      toast({ title: "Imagem carregada", description: "A imagem de capa foi adicionada." });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({ 
        title: "Erro no upload", 
        description: "Não foi possível carregar a imagem.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter posts by search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = posts.filter(p => p.status === "published").length;
  const draftCount = posts.filter(p => p.status === "draft").length;

  // Character counters
  const titleLength = form.title?.length || 0;
  const excerptLength = form.excerpt?.length || 0;
  const titleScore = titleLength > 0 && titleLength <= 60 ? 100 : titleLength > 60 ? Math.max(0, 100 - (titleLength - 60) * 5) : 0;
  const excerptScore = excerptLength > 0 && excerptLength <= 160 ? 100 : excerptLength > 160 ? Math.max(0, 100 - (excerptLength - 160) * 3) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-fraunces text-foreground">Gestão de Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {publishedCount} publicados · {draftCount} rascunhos
          </p>
        </div>
        <Button onClick={openNewDialog} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Novo Artigo
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar artigos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Artigo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    A carregar artigos...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    {searchQuery ? "Nenhum artigo encontrado." : "Ainda não há artigos. Cria o primeiro!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} className="group">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {post.cover_image_url ? (
                          <img 
                            src={post.cover_image_url} 
                            alt="" 
                            className="w-16 h-10 object-cover rounded border border-border"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-muted rounded border border-border flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{post.title}</p>
                          <p className="text-xs text-muted-foreground truncate">/blog/{post.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.status === "published" ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Publicado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <CircleSlash2 className="h-3 w-3 mr-1" />
                          Rascunho
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.updated_at ? new Date(post.updated_at).toLocaleDateString('pt-PT') : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(post)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {post.status === "published" && (
                            <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver no site
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => publishToggle(post)}>
                            {post.status === "published" ? (
                              <>
                                <CircleSlash2 className="h-4 w-4 mr-2" />
                                Despublicar
                              </>
                            ) : (
                              <>
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Publicar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => confirmDelete(post)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Eliminar artigo?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Tens a certeza que queres eliminar <strong>"{postToDelete?.title}"</strong>?
              <br /><br />
              Esta ação é <strong>permanente</strong> e não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deletePost}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "A eliminar..." : "Eliminar permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-fraunces text-xl">
              {editingPost ? "Editar Artigo" : "Novo Artigo"}
            </DialogTitle>
            <DialogDescription>
              {editingPost 
                ? "Atualiza o conteúdo e configurações do artigo."
                : "Cria um novo artigo otimizado para redes sociais."
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Imagem & SEO
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4 pr-2">
              <TabsContent value="content" className="space-y-4 mt-0">
                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Título *</Label>
                    <span className={`text-xs ${titleLength > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {titleLength}/60
                    </span>
                  </div>
                  <Input 
                    value={form.title} 
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setForm({
                        ...form,
                        title: newTitle,
                        slug: form.slug || slugify(newTitle),
                      });
                    }}
                    placeholder="Ex: Como preservar memórias para gerações futuras"
                    className={titleLength > 60 ? 'border-destructive' : ''}
                  />
                  {titleScore < 100 && titleLength > 0 && (
                    <p className="text-xs text-muted-foreground">
                      💡 Títulos até 60 caracteres têm melhor desempenho em SEO
                    </p>
                  )}
                </div>

                {/* Excerpt/Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Descrição (SEO & Redes Sociais) *</Label>
                    <span className={`text-xs ${excerptLength > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {excerptLength}/160
                    </span>
                  </div>
                  <Textarea 
                    value={form.excerpt} 
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Esta descrição aparece nos resultados de pesquisa e quando partilhas nas redes sociais..."
                    rows={3}
                    className={excerptLength > 160 ? 'border-destructive' : ''}
                  />
                  {excerptScore < 100 && excerptLength > 0 && (
                    <p className="text-xs text-muted-foreground">
                      💡 Descrições até 160 caracteres aparecem completas nos resultados
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>Conteúdo do artigo</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <ReactQuill 
                      theme="snow" 
                      value={form.content || ""} 
                      onChange={(val) => setForm({ ...form, content: val })}
                      className="bg-background"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-0">
                {/* Cover Image */}
                <div className="space-y-2">
                  <Label>Imagem de capa (1200×630px recomendado)</Label>
                  <p className="text-xs text-muted-foreground">
                    Esta imagem aparece quando partilhas o artigo nas redes sociais.
                  </p>
                  
                  {form.cover_image_url ? (
                    <div className="relative">
                      <div className="aspect-[1200/630] rounded-lg overflow-hidden border border-border">
                        <img
                          src={form.cover_image_url}
                          alt="Pré-visualização"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setForm({ ...form, cover_image_url: "" })}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[1200/630] border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                      <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Clica para carregar imagem
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        JPEG, PNG, GIF ou WebP (máx. 10MB)
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}

                  <div className="flex gap-2">
                    <Input 
                      value={form.cover_image_url} 
                      onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                      placeholder="Ou cola um URL de imagem..."
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* URL Slug */}
                <div className="space-y-2">
                  <Label>URL do artigo</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground shrink-0">/blog/</span>
                    <Input 
                      value={form.slug} 
                      onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      placeholder="url-do-artigo"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags (separa por vírgulas)</Label>
                  <Input 
                    value={(form.tags || []).join(', ')} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                    })}
                    placeholder="memórias, família, keepsakes"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Estado de publicação</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={form.status === "draft"}
                        onChange={() => setForm({ ...form, status: "draft" })}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-sm">Rascunho</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={form.status === "published"}
                        onChange={() => setForm({ ...form, status: "published" })}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-sm">Publicado</span>
                    </label>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={savePost} disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? "A guardar..." : editingPost ? "Guardar alterações" : "Criar artigo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
