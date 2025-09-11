import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Bell, Trophy, Target, Search, Filter } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

type Achievement = Database['public']['Tables']['achievements']['Row'];
type AchievementInsert = Database['public']['Tables']['achievements']['Insert'];
type AchievementUpdate = Database['public']['Tables']['achievements']['Update'];

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestInsert = Database['public']['Tables']['quests']['Insert'];
type QuestUpdate = Database['public']['Tables']['quests']['Update'];

interface NotificationFormData {
  title: string;
  content: string;
  type: string;
  keepsake_id?: string;
  user_id?: string;
}

interface AchievementFormData {
  name: string;
  description: string;
  points: number;
  image_url?: string;
  criteria?: string;
  active: boolean;
}

interface QuestFormData {
  name: string;
  description: string;
  reward_points: number;
  reward_item?: string;
  criteria: string;
  active: boolean;
  difficulty: string;
}

const AdminContent = () => {
  // Estados para notificações
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationFormData, setNotificationFormData] = useState<NotificationFormData>({
    title: "",
    content: "",
    type: "info"
  });
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  // Estados para conquistas
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementFormData, setAchievementFormData] = useState<AchievementFormData>({
    name: "",
    description: "",
    points: 0,
    image_url: "",
    criteria: "",
    active: true
  });
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);

  // Estados para missões
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questFormData, setQuestFormData] = useState<QuestFormData>({
    name: "",
    description: "",
    reward_points: 0,
    reward_item: "",
    criteria: "",
    active: true,
    difficulty: "easy"
  });
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isQuestDialogOpen, setIsQuestDialogOpen] = useState(false);

  // Estados gerais
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("notifications");

  const notificationTypes = [
    { value: "info", label: "Informação" },
    { value: "success", label: "Sucesso" },
    { value: "warning", label: "Aviso" },
    { value: "error", label: "Erro" },
    { value: "reminder", label: "Lembrete" }
  ];

  const questDifficulties = [
    { value: "easy", label: "Fácil" },
    { value: "medium", label: "Médio" },
    { value: "hard", label: "Difícil" },
    { value: "expert", label: "Especialista" }
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchNotifications(),
      fetchAchievements(),
      fetchQuests()
    ]);
    setLoading(false);
  };

  // Funções para Notificações
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNotification) {
        const { error } = await supabase
          .from('notifications')
          .update(notificationFormData as NotificationUpdate)
          .eq('id', editingNotification.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Notificação atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('notifications')
          .insert([notificationFormData as NotificationInsert]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Notificação criada com sucesso!" });
      }

      setIsNotificationDialogOpen(false);
      resetNotificationForm();
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao salvar notificação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a notificação.",
        variant: "destructive"
      });
    }
  };

  const handleNotificationDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Notificação removida com sucesso!" });
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a notificação.",
        variant: "destructive"
      });
    }
  };

  // Funções para Conquistas
  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    }
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAchievement) {
        const { error } = await supabase
          .from('achievements')
          .update(achievementFormData as AchievementUpdate)
          .eq('id', editingAchievement.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Conquista atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([achievementFormData as AchievementInsert]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Conquista criada com sucesso!" });
      }

      setIsAchievementDialogOpen(false);
      resetAchievementForm();
      fetchAchievements();
    } catch (error) {
      console.error('Erro ao salvar conquista:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conquista.",
        variant: "destructive"
      });
    }
  };

  const handleAchievementDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Conquista removida com sucesso!" });
      fetchAchievements();
    } catch (error) {
      console.error('Erro ao remover conquista:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a conquista.",
        variant: "destructive"
      });
    }
  };

  // Funções para Missões
  const fetchQuests = async () => {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuests(data || []);
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    }
  };

  const handleQuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingQuest) {
        const { error } = await supabase
          .from('quests')
          .update(questFormData as QuestUpdate)
          .eq('id', editingQuest.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Missão atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('quests')
          .insert([questFormData as QuestInsert]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Missão criada com sucesso!" });
      }

      setIsQuestDialogOpen(false);
      resetQuestForm();
      fetchQuests();
    } catch (error) {
      console.error('Erro ao salvar missão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a missão.",
        variant: "destructive"
      });
    }
  };

  const handleQuestDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Missão removida com sucesso!" });
      fetchQuests();
    } catch (error) {
      console.error('Erro ao remover missão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a missão.",
        variant: "destructive"
      });
    }
  };

  // Funções de reset
  const resetNotificationForm = () => {
    setNotificationFormData({ title: "", content: "", type: "info" });
    setEditingNotification(null);
  };

  const resetAchievementForm = () => {
    setAchievementFormData({
      name: "",
      description: "",
      points: 0,
      image_url: "",
      criteria: "",
      active: true
    });
    setEditingAchievement(null);
  };

  const resetQuestForm = () => {
    setQuestFormData({
      name: "",
      description: "",
      reward_points: 0,
      reward_item: "",
      criteria: "",
      active: true,
      difficulty: "easy"
    });
    setEditingQuest(null);
  };

  // Funções de abertura de diálogos
  const openNotificationEditDialog = (notification: Notification) => {
    setEditingNotification(notification);
    setNotificationFormData({
      title: notification.title,
      content: notification.content || "",
      type: notification.type || "info",
      keepsake_id: notification.keepsake_id || undefined,
      user_id: notification.user_id || undefined
    });
    setIsNotificationDialogOpen(true);
  };

  const openAchievementEditDialog = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setAchievementFormData({
      name: achievement.name,
      description: achievement.description || "",
      points: achievement.points || 0,
      image_url: achievement.image_url || "",
      criteria: achievement.criteria || "",
      active: achievement.active || true
    });
    setIsAchievementDialogOpen(true);
  };

  const openQuestEditDialog = (quest: Quest) => {
    setEditingQuest(quest);
    setQuestFormData({
      name: quest.name,
      description: quest.description || "",
      reward_points: quest.reward_points || 0,
      reward_item: quest.reward_item || "",
      criteria: quest.criteria || "",
      active: quest.active || true,
      difficulty: quest.difficulty || "easy"
    });
    setIsQuestDialogOpen(true);
  };

  const getTypeLabel = (type: string) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const diffObj = questDifficulties.find(d => d.value === difficulty);
    return diffObj ? diffObj.label : difficulty;
  };

  // Filtros
  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notification.content && notification.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAchievements = achievements.filter(achievement => 
    achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (achievement.description && achievement.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredQuests = quests.filter(quest => 
    quest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quest.description && quest.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-steel-blue font-fraunces">Gestão de Conteúdo</h1>
          <p className="text-misty-gray mt-2">Gerir notificações, conquistas e missões</p>
        </div>
      </div>

      {/* Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-misty-gray" />
            <Input
              placeholder="Pesquisar conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Conquistas
          </TabsTrigger>
          <TabsTrigger value="quests" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Missões
          </TabsTrigger>
        </TabsList>

        {/* Tab de Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Notificações ({filteredNotifications.length})</h2>
            <Button onClick={() => { resetNotificationForm(); setIsNotificationDialogOpen(true); }} className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Notificação
            </Button>
          </div>

          <Card>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-earthy-burgundy mx-auto"></div>
                  <p className="text-misty-gray mt-2">Carregando...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Conteúdo</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getTypeLabel(notification.type || "info")}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {notification.content}
                        </TableCell>
                        <TableCell>
                          {notification.created_at ? new Date(notification.created_at).toLocaleDateString('pt-PT') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openNotificationEditDialog(notification)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem a certeza que deseja remover a notificação "{notification.title}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleNotificationDelete(notification.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Conquistas */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Conquistas ({filteredAchievements.length})</h2>
            <Button onClick={() => { resetAchievementForm(); setIsAchievementDialogOpen(true); }} className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conquista
            </Button>
          </div>

          <Card>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-earthy-burgundy mx-auto"></div>
                  <p className="text-misty-gray mt-2">Carregando...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAchievements.map((achievement) => (
                      <TableRow key={achievement.id}>
                        <TableCell className="font-medium">{achievement.name}</TableCell>
                        <TableCell>{achievement.points || 0} pts</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {achievement.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={achievement.active ? "default" : "secondary"}>
                            {achievement.active ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {achievement.created_at ? new Date(achievement.created_at).toLocaleDateString('pt-PT') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openAchievementEditDialog(achievement)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem a certeza que deseja remover a conquista "{achievement.name}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleAchievementDelete(achievement.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Missões */}
        <TabsContent value="quests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Missões ({filteredQuests.length})</h2>
            <Button onClick={() => { resetQuestForm(); setIsQuestDialogOpen(true); }} className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Missão
            </Button>
          </div>

          <Card>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-earthy-burgundy mx-auto"></div>
                  <p className="text-misty-gray mt-2">Carregando...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Dificuldade</TableHead>
                      <TableHead>Recompensa</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuests.map((quest) => (
                      <TableRow key={quest.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quest.name}</div>
                            <div className="text-sm text-misty-gray truncate max-w-xs">
                              {quest.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDifficultyLabel(quest.difficulty || "easy")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{quest.reward_points || 0} pts</div>
                            {quest.reward_item && (
                              <div className="text-misty-gray">{quest.reward_item}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={quest.active ? "default" : "secondary"}>
                            {quest.active ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {quest.created_at ? new Date(quest.created_at).toLocaleDateString('pt-PT') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openQuestEditDialog(quest)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem a certeza que deseja remover a missão "{quest.name}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleQuestDelete(quest.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para Notificações */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingNotification ? "Editar Notificação" : "Nova Notificação"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNotificationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={notificationFormData.title}
                onChange={(e) => setNotificationFormData({ ...notificationFormData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={notificationFormData.type} onValueChange={(value) => setNotificationFormData({ ...notificationFormData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                value={notificationFormData.content}
                onChange={(e) => setNotificationFormData({ ...notificationFormData, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
                {editingNotification ? "Atualizar" : "Criar"} Notificação
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para Conquistas */}
      <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAchievement ? "Editar Conquista" : "Nova Conquista"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAchievementSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="achievement-name">Nome *</Label>
                <Input
                  id="achievement-name"
                  value={achievementFormData.name}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={achievementFormData.points}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, points: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="achievement-description">Descrição</Label>
              <Textarea
                id="achievement-description"
                value={achievementFormData.description}
                onChange={(e) => setAchievementFormData({ ...achievementFormData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-url">URL da Imagem</Label>
              <Input
                id="image-url"
                value={achievementFormData.image_url}
                onChange={(e) => setAchievementFormData({ ...achievementFormData, image_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="criteria">Critérios</Label>
              <Textarea
                id="criteria"
                value={achievementFormData.criteria}
                onChange={(e) => setAchievementFormData({ ...achievementFormData, criteria: e.target.value })}
                rows={2}
                placeholder="Condições para desbloquear esta conquista"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="achievement-active"
                checked={achievementFormData.active}
                onCheckedChange={(checked) => setAchievementFormData({ ...achievementFormData, active: checked })}
              />
              <Label htmlFor="achievement-active">Conquista ativa</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAchievementDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
                {editingAchievement ? "Atualizar" : "Criar"} Conquista
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para Missões */}
      <Dialog open={isQuestDialogOpen} onOpenChange={setIsQuestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuest ? "Editar Missão" : "Nova Missão"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuestSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quest-name">Nome *</Label>
                <Input
                  id="quest-name"
                  value={questFormData.name}
                  onChange={(e) => setQuestFormData({ ...questFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select value={questFormData.difficulty} onValueChange={(value) => setQuestFormData({ ...questFormData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questDifficulties.map(diff => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quest-description">Descrição</Label>
              <Textarea
                id="quest-description"
                value={questFormData.description}
                onChange={(e) => setQuestFormData({ ...questFormData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward-points">Pontos de Recompensa</Label>
                <Input
                  id="reward-points"
                  type="number"
                  min="0"
                  value={questFormData.reward_points}
                  onChange={(e) => setQuestFormData({ ...questFormData, reward_points: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward-item">Item de Recompensa</Label>
                <Input
                  id="reward-item"
                  value={questFormData.reward_item}
                  onChange={(e) => setQuestFormData({ ...questFormData, reward_item: e.target.value })}
                  placeholder="Nome do item (opcional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quest-criteria">Critérios *</Label>
              <Textarea
                id="quest-criteria"
                value={questFormData.criteria}
                onChange={(e) => setQuestFormData({ ...questFormData, criteria: e.target.value })}
                rows={2}
                placeholder="Condições para completar esta missão"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="quest-active"
                checked={questFormData.active}
                onCheckedChange={(checked) => setQuestFormData({ ...questFormData, active: checked })}
              />
              <Label htmlFor="quest-active">Missão ativa</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsQuestDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
                {editingQuest ? "Atualizar" : "Criar"} Missão
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;