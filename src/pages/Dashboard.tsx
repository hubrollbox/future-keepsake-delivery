
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Mail, Users, Plus, Edit, Trash2, Loader2, Trophy, Target, Award, Zap, Settings, BarChart3, TrendingUp, Package, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";
import UserStats from "@/components/gamification/UserStats";
import AchievementCard from "@/components/gamification/AchievementCard";
import QuestCard from "@/components/gamification/QuestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminData } from "@/hooks/useAdminData";
import DeliveriesBarChart from "@/components/dashboard/DeliveriesBarChart";
import TopUsersRanking from "@/components/dashboard/TopUsersRanking";
import type { Achievement } from "@/components/gamification/AchievementCard";
import type { Quest } from "@/components/gamification/QuestCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { deliveries, loading, deleteDelivery } = useDeliveries();
  const { stats, loading: adminLoading } = useAdminData();
  const isAdmin = profile?.role === "admin";

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "scheduled": return "bg-warm-yellow text-warm-brown";
      case "delivered": return "bg-sage-green text-gentle-black";
      case "cancelled": return "bg-dusty-rose text-gentle-black";
      default: return "bg-misty-gray text-gentle-black";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "scheduled": return "Agendado";
      case "delivered": return "Entregue";
      case "cancelled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tens a certeza que queres eliminar esta entrega?")) {
      await deleteDelivery(id);
    }
  };

  const deliveriesByMonth = React.useMemo(() => {
    const months: { [key: string]: number } = {};
    deliveries.forEach((d) => {
      const date = new Date(d.delivery_date);
      const key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [deliveries]);

  const topUsers = React.useMemo(() => {
    const userMap: { [key: string]: { user_id: string; name: string; count: number } } = {};
    deliveries.forEach((d) => {
      const userId = d.user_id || d.recipient_name || "unknown";
      if (!userMap[userId]) {
        userMap[userId] = { user_id: userId, name: d.recipient_name, count: 0 };
      }
      userMap[userId].count += 1;
    });
    return Object.values(userMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [deliveries]);

  // Profile Header Section
  const ProfileHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-golden-honey to-dusty-rose flex items-center justify-center shadow-soft">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-semibold text-gentle-black">
            Olá, {profile?.full_name || "Guardião Temporal"}
          </h1>
          <p className="text-soft-gray">{user?.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate("/profile")}>
          <Settings className="h-4 w-4 mr-2" />
          Perfil
        </Button>
        {isAdmin && (
          <Button variant="brand" onClick={() => navigate("/admin")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Admin
          </Button>
        )}
      </div>
    </div>
  );

  // Admin Stats Section
  const AdminStatsSection = () => {
    if (!isAdmin) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-semibold text-gentle-black mb-4">Estatísticas Administrativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-soft border-dusty-rose/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-misty-gray">Total Entregas</p>
                  <p className="text-3xl font-bold text-steel-blue">{adminLoading ? "..." : stats.totalDeliveries}</p>
                </div>
                <Package className="h-8 w-8 text-earthy-burgundy" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft border-dusty-rose/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-misty-gray">Entregas Pendentes</p>
                  <p className="text-3xl font-bold text-steel-blue">{adminLoading ? "..." : stats.pendingDeliveries}</p>
                </div>
                <Clock className="h-8 w-8 text-golden-honey" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-dusty-rose/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-misty-gray">Mensagens Digitais</p>
                  <p className="text-3xl font-bold text-steel-blue">{adminLoading ? "..." : stats.digitalMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-dusty-rose" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-dusty-rose/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-misty-gray">Pagamentos (7 dias)</p>
                  <p className="text-3xl font-bold text-steel-blue">{adminLoading ? "..." : stats.recentPayments}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-sage-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-soft border-dusty-rose/20">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-steel-blue">Entregas por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliveriesBarChart data={deliveriesByMonth} />
            </CardContent>
          </Card>

          <Card className="shadow-soft border-dusty-rose/20">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-steel-blue">Top Utilizadores</CardTitle>
            </CardHeader>
            <CardContent>
              <TopUsersRanking users={topUsers} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // User Stats Section
  const UserStatsSection = () => (
    <div className="mb-8">
      <Card className="shadow-soft border-green-200">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-green-900 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            A Tua Jornada Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserStats profile={profile} totalDeliveries={deliveries.length} />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Conquistas
              </h4>
              <AchievementCard 
                achievement={{ 
                  id: "1", 
                  title: "Primeira Entrega", 
                  description: "Enviaste a tua primeira mensagem!", 
                  icon: Award, 
                  unlocked: deliveries.length > 0, 
                  points: 50 
                }} 
              />
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Missões Ativas
              </h4>
              <QuestCard 
                quest={{ 
                  id: "1", 
                  title: "Enviar 5 Mensagens", 
                  description: "Envia 5 mensagens para desbloquear esta missão.", 
                  progress: deliveries.length, 
                  target: 5, 
                  reward: 100 
                }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Time Capsule Section
  const TimeCapsuleSection = () => (
    <div className="mb-8">
      <Card className="shadow-soft border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-serif text-blue-900 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Cápsula do Tempo
          </CardTitle>
          <Button variant="brand" onClick={() => navigate("/create-message")}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Mensagem
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-blue-300 mb-4" />
              <p className="text-gray-500 mb-4">Ainda não tens mensagens na tua cápsula do tempo.</p>
              <Button variant="brand" onClick={() => navigate("/create-message")}>
                Criar a Primeira Mensagem
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {deliveries.slice(0, 5).map((delivery) => (
                <Card key={delivery.id} className="border border-blue-100 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900">{delivery.title || "Mensagem"}</h4>
                        <p className="text-sm text-gray-600">Para: {delivery.recipient_name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(delivery.delivery_date).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusText(delivery.status)}
                      </Badge>
                    </div>
                    {delivery.message && (
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{delivery.message}</p>
                    )}
                    <div className="flex gap-2">
                      {delivery.status === "scheduled" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/edit-delivery/${delivery.id}`)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(delivery.id)}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {deliveries.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => navigate("/deliveries")}>
                    Ver Todas as Mensagens ({deliveries.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-lavender-mist">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <ProfileHeader />
        <AdminStatsSection />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <TimeCapsuleSection />
          </div>
          <div className="xl:col-span-1">
            <UserStatsSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
