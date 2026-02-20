import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  Play,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import editorialDb from "../../../scripts/editorial/database/editorial-database.json";

interface Topic {
  id: string;
  pillar: string;
  status: "por_escrever" | "em_andamento" | "gerado" | "publicado";
  priority: "alta" | "media" | "baixa";
  title: string;
  angle: string;
  target_keyword: string;
  secondary_keywords: string[];
  target_audience: string;
  tone: string;
  estimated_word_count: number;
  cta: string;
  notes: string;
  created_at: string;
  generation_date: string | null;
  published_date: string | null;
  slug: string | null;
}

interface Pillar {
  id: string;
  name: string;
  description: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views: number | null;
  tags: string[] | null;
  excerpt: string | null;
}

const PILLAR_COLORS: Record<string, string> = {
  "emocoes-e-memorias": "bg-rose-100 text-rose-700 border-rose-200",
  "datas-e-celebracoes": "bg-amber-100 text-amber-700 border-amber-200",
  "produto-e-como-usar": "bg-blue-100 text-blue-700 border-blue-200",
  "reflexao-e-legado": "bg-violet-100 text-violet-700 border-violet-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  alta: "bg-red-100 text-red-700 border-red-200",
  media: "bg-yellow-100 text-yellow-700 border-yellow-200",
  baixa: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  por_escrever: {
    label: "Por escrever",
    color: "bg-muted text-muted-foreground border-border",
    icon: <FileText className="h-3 w-3" />,
  },
  em_andamento: {
    label: "Em andamento",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Clock className="h-3 w-3" />,
  },
  gerado: {
    label: "Gerado",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Sparkles className="h-3 w-3" />,
  },
  publicado: {
    label: "Publicado",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

const AdminEditorial = () => {
  const [topics] = useState<Topic[]>(editorialDb.topics as Topic[]);
  const [pillars] = useState<Pillar[]>(editorialDb.pillars as Pillar[]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState("pipeline");

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, status, published_at, created_at, updated_at, views, tags, excerpt")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setBlogPosts(data || []);
    } catch (err: any) {
      toast({
        title: "Erro ao carregar artigos",
        description: err?.message || "Verifica a ligação.",
        variant: "destructive",
      });
    } finally {
      setLoadingPosts(false);
    }
  };

  // Stats
  const totalTopics = topics.length;
  const topicsByStatus = {
    por_escrever: topics.filter((t) => t.status === "por_escrever").length,
    em_andamento: topics.filter((t) => t.status === "em_andamento").length,
    gerado: topics.filter((t) => t.status === "gerado").length,
    publicado: topics.filter((t) => t.status === "publicado").length,
  };
  const highPriority = topics.filter((t) => t.priority === "alta" && t.status === "por_escrever").length;
  const publishedPosts = blogPosts.filter((p) => p.status === "published").length;
  const draftPosts = blogPosts.filter((p) => p.status === "draft").length;
  const completionRate = totalTopics > 0 ? Math.round((topicsByStatus.publicado / totalTopics) * 100) : 0;

  const getPillarName = (pillarId: string) => {
    return pillars.find((p) => p.id === pillarId)?.name || pillarId;
  };

  const handleOpenGitHubAction = () => {
    window.open(
      "https://github.com/features/actions",
      "_blank",
      "noopener,noreferrer"
    );
    toast({
      title: "GitHub Actions",
      description: "Abre o repositório > Actions > Create Blog Draft para gerar um novo rascunho.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-fraunces text-foreground">Editorial</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pipeline de conteúdo · {totalTopics} temas planeados · {publishedPosts} publicados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchBlogPosts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm" onClick={handleOpenGitHubAction} className="bg-primary hover:bg-primary/90">
            <Zap className="h-4 w-4 mr-2" />
            Gerar Rascunho
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Por escrever</p>
                <p className="text-2xl font-bold text-foreground">{topicsByStatus.por_escrever}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Target className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prioridade alta</p>
                <p className="text-2xl font-bold text-foreground">{highPriority}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Publicados</p>
                <p className="text-2xl font-bold text-foreground">{publishedPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-50">
                <TrendingUp className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cobertura</p>
                <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
              </div>
            </div>
            <Progress value={completionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Pillar Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {pillars.map((pillar) => {
          const pillarTopics = topics.filter((t) => t.pillar === pillar.id);
          const done = pillarTopics.filter((t) => t.status === "publicado").length;
          return (
            <Card key={pillar.id} className="border border-border">
              <CardContent className="p-3">
                <Badge
                  variant="outline"
                  className={`text-xs mb-2 ${PILLAR_COLORS[pillar.id] || "bg-muted text-muted-foreground"}`}
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {pillar.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{pillarTopics.length} temas · {done} publicados</p>
                <Progress
                  value={pillarTopics.length > 0 ? (done / pillarTopics.length) * 100 : 0}
                  className="mt-2 h-1"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pipeline">
            <Play className="h-4 w-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="publicados">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Publicados ({publishedPosts})
          </TabsTrigger>
          <TabsTrigger value="rascunhos">
            <Edit className="h-4 w-4 mr-2" />
            Rascunhos ({draftPosts})
          </TabsTrigger>
        </TabsList>

        {/* PIPELINE TAB */}
        <TabsContent value="pipeline" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                Banco Editorial — Temas Planeados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Tema</TableHead>
                    <TableHead>Pilar</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((topic) => {
                    const status = STATUS_CONFIG[topic.status] || STATUS_CONFIG.por_escrever;
                    return (
                      <TableRow key={topic.id} className="group">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground text-sm leading-snug">{topic.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{topic.angle}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${PILLAR_COLORS[topic.pillar] || "bg-muted text-muted-foreground"}`}
                          >
                            {getPillarName(topic.pillar)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${PRIORITY_COLORS[topic.priority] || ""}`}
                          >
                            {topic.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs flex items-center gap-1 w-fit ${status?.color ?? ""}`}>
                            {status?.icon}
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground font-mono">{topic.target_keyword}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {topic.status === "por_escrever" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => {
                                toast({
                                  title: "Gerar rascunho",
                                  description: `Para gerar "${topic.title}", vai ao GitHub > Actions > Create Blog Draft e seleciona o tema "${topic.id}".`,
                                });
                              }}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Gerar
                            </Button>
                          )}
                          {topic.status === "publicado" && topic.slug && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => window.open(`/blog/${topic.slug}`, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Workflow Guide */}
          <Card className="mt-4 border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                Como funciona o fluxo automático
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
                  <span><strong className="text-foreground">Gerar</strong> — Clica em "Gerar Rascunho" ou vai ao GitHub Actions e escolhe o tema.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
                  <span><strong className="text-foreground">Rever</strong> — A IA gera o conteúdo e abre automaticamente um Pull Request no GitHub para revisão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
                  <span><strong className="text-foreground">Aprovar</strong> — A equipa editorial revisa, edita e faz merge do PR.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">4</span>
                  <span><strong className="text-foreground">Publicar</strong> — O merge dispara a sincronização automática com o Supabase. O artigo fica imediatamente live.</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PUBLISHED TAB */}
        <TabsContent value="publicados" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Artigo</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Publicado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPosts ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        A carregar...
                      </TableCell>
                    </TableRow>
                  ) : blogPosts.filter((p) => p.status === "published").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        Nenhum artigo publicado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogPosts
                      .filter((p) => p.status === "published")
                      .map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <p className="font-medium text-foreground text-sm">{post.title}</p>
                            <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <TrendingUp className="h-3 w-3" />
                              {post.views ?? 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString("pt-PT")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DRAFTS TAB */}
        <TabsContent value="rascunhos" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[55%]">Artigo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPosts ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        A carregar...
                      </TableCell>
                    </TableRow>
                  ) : blogPosts.filter((p) => p.status === "draft").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        Não há rascunhos por publicar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogPosts
                      .filter((p) => p.status === "draft")
                      .map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <p className="font-medium text-foreground text-sm">{post.title}</p>
                            <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                            {post.excerpt && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</p>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(post.updated_at).toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                              Rascunho
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEditorial;
