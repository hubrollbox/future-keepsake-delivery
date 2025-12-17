import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Bell, Trophy, Target, Search } from "lucide-react";
import { Database } from "@/integrations/supabase/database.types";

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
  message: string;
  type: string;
  keepsake_id?: string | null | undefined;
  user_id?: string | undefined;
  content?: string;
}

interface AchievementFormData {
  title: string;
  name: string;
  description: string;
  points: number;
  reward: number;
  icon: string;
  category: string;
}

interface QuestFormData {
  title: string;
  description: string;
  type: string;
  reward: number;
  target: number;
  reward_points: number;
  target_value: number;
}

const AdminContent = () => {
  // Estados para notificações
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationFormData, setNotificationFormData] = useState<NotificationFormData>({
    title: "",
    message: "",
    type: "info"
  });
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  // Estados para conquistas
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementFormData, setAchievementFormData] = useState<AchievementFormData>({
    title: "",
    name: "",
    description: "",
    points: 0,
    reward: 0,
    icon: "",
    category: ""
  });
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);

  // Estados para missões
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questFormData, setQuestFormData] = useState<QuestFormData>({
    title: "",
    description: "",
    type: "",
    reward: 0,
    target: 0,
    reward_points: 0,
    target_value: 0
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

  const handleAchievementDelete = async (id: number) => {
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

  const handleQuestDelete = async (id: number) => {
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
    setNotificationFormData({ title: "", message: "", type: "info", content: "" });
    setEditingNotification(null);
  };

  const resetAchievementForm = () => {
    setAchievementFormData({
      title: "",
      name: "",
      description: "",
      points: 0,
      reward: 0,
      icon: "",
      category: ""
    });
    setEditingAchievement(null);
  };

  const resetQuestForm = () => {
    setQuestFormData({
      title: "",
      description: "",
      reward: 0,
      target: 1,
      type: "daily",
      reward_points: 0,
      target_value: 1
    });
    setEditingQuest(null);
  };

  // Funções de abertura de diálogos
  const openNotificationEditDialog = (notification: Notification) => {
    setEditingNotification(notification);
    setNotificationFormData({
      title: notification.title,
      message: notification.message || "",
      type: notification.type || "info",
      content: notification.content || "",
      keepsake_id: notification.keepsake_id || undefined,
      user_id: notification.user_id || undefined
    });
    setIsNotificationDialogOpen(true);
  };

  const openAchievementEditDialog = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setAchievementFormData({
      title: achievement.title,
      name: achievement.name,
      description: achievement.description,
      points: achievement.points,
      reward: achievement.reward,
      icon: achievement.icon,
      category: achievement.category || "general"
    });
    setIsAchievementDialogOpen(true);
  };

  const openQuestEditDialog = (quest: Quest) => {
    setEditingQuest(quest);
    setQuestFormData({
          title: quest.title,
          description: quest.description,
          reward: quest.reward,
          target: quest.target,
          type: quest.type || "daily",
          reward_points: quest.reward_points || 0,
          target_value: quest.target_value || quest.target
        });
    setIsQuestDialogOpen(true);
  };

  const getTypeLabel = (type: string) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  

  // Filtros
  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notification.content && notification.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAchievements = achievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (achievement.description && achievement.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredQuests = quests.filter(quest => 
    quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <Card className="border-dusty-rose/20">
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

          <Card className="border-dusty-rose/20">
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
                                <AlertDialogTitle className="font-fraunces text-steel-blue">Confirmar remoção</AlertDialogTitle>
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

          <Card className="border-dusty-rose/20">
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
                      <TableHead>Pontos</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ícone</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAchievements.map((achievement) => (
                      <TableRow key={achievement.id}>
                        <TableCell className="font-medium">{achievement.title}</TableCell>
                        <TableCell>{achievement.points || 0} pts</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {achievement.description}
                        </TableCell>
                        <TableCell>{achievement.icon}</TableCell>
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
                                  <AlertDialogTitle className="font-fraunces text-steel-blue">Confirmar remoção</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem a certeza que deseja remover a conquista "{achievement.title}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleAchievementDelete(Number(achievement.id))}
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
            <h2 className="text-xl font-fraunces font-semibold text-steel-blue">Missões ({filteredQuests.length})</h2>
            <Button onClick={() => { resetQuestForm(); setIsQuestDialogOpen(true); }} className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Missão
            </Button>
          </div>

          <Card className="border-dusty-rose/20">
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
                            <div className="font-medium">{quest.title}</div>
                            <div className="text-sm text-misty-gray truncate max-w-xs">
                              {quest.description}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            <div>Recompensa: {quest.reward} pts</div>
                            <div className="text-misty-gray">Meta: {quest.target}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            Ativa
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
                                  <AlertDialogTitle className="font-fraunces text-steel-blue">Confirmar remoção</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem a certeza que deseja remover a missão "{quest.title}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleQuestDelete(Number(quest.id))}
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
            <DialogTitle className="font-fraunces text-steel-blue">
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
            <DialogTitle className="font-fraunces text-steel-blue">
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
                <Label htmlFor="reward">Recompensa (pontos)</Label>
                <Input
                  id="reward"
                  type="number"
                  min="0"
                  value={achievementFormData.reward}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, reward: parseInt(e.target.value) || 0 })}
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
              <Label htmlFor="icon">Ícone</Label>
              <Input
                id="icon"
                value={achievementFormData.icon}
                onChange={(e) => setAchievementFormData({ ...achievementFormData, icon: e.target.value })}
                placeholder="Nome do ícone ou emoji"
              />
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
            <DialogTitle className="font-fraunces text-steel-blue">
              {editingQuest ? "Editar Missão" : "Nova Missão"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuestSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quest-title">Título *</Label>
                <Input
                  id="quest-title"
                  value={questFormData.title}
                  onChange={(e) => setQuestFormData({ ...questFormData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward">Recompensa (pontos)</Label>
                <Input
                  id="reward"
                  type="number"
                  min="0"
                  value={questFormData.reward}
                  onChange={(e) => setQuestFormData({ ...questFormData, reward: parseInt(e.target.value) || 0 })}
                />
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

            <div className="space-y-2">
              <Label htmlFor="target">Meta *</Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={questFormData.target}
                onChange={(e) => setQuestFormData({ ...questFormData, target: parseInt(e.target.value) || 1 })}
                placeholder="Número necessário para completar"
                required
              />
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
