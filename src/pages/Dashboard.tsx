import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Mail, Users, Plus, Edit, Trash2, Loader2, Trophy, Target, Award, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";
import UserStats from "@/components/gamification/UserStats";
import AchievementCard from "@/components/gamification/AchievementCard";
import QuestCard from "@/components/gamification/QuestCard";
import CartButton from "@/components/cart/CartButton";
import CartModal from "@/components/cart/CartModal";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToCSV } from "@/lib/exportToCSV";
import DeliveriesBarChart from "@/components/dashboard/DeliveriesBarChart";
import TopUsersRanking from "@/components/dashboard/TopUsersRanking";
import AdminAchievementsQuests from "@/components/dashboard/AdminAchievementsQuests";
import type { Achievement } from "@/components/gamification/AchievementCard";
import type { Quest } from "@/components/gamification/QuestCard";

// === INÍCIO DA REFATORAÇÃO DO DASHBOARD ===
// Melhorias visuais, layout, espaçamento e usabilidade
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { deliveries, loading, deleteDelivery } = useDeliveries();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);

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

  const digitalDeliveries = deliveries.filter(d => d.type === "digital");
  const physicalDeliveries = deliveries.filter(d => d.type === "physical");

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.title?.toLowerCase().includes(search.toLowerCase()) ||
      delivery.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
      delivery.message?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? delivery.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Métricas
  const total = deliveries.length;
  const scheduled = deliveries.filter(d => d.status === "scheduled").length;
  const delivered = deliveries.filter(d => d.status === "delivered").length;
  const cancelled = deliveries.filter(d => d.status === "cancelled").length;

  // Agrupa entregas por mês para o gráfico
  const deliveriesByMonth = React.useMemo(() => {
    const months: { [key: string]: number } = {};
    deliveries.forEach((d) => {
      const date = new Date(d.delivery_date);
      const key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    // Ordena por mês
    return Object.entries(months).sort().map(([month, count]) => ({
      month,
      count,
    }));
  }, [deliveries]);

  // Ranking dos usuários mais ativos (mock)
  const topUsers = React.useMemo(() => {
    // Agrupa por user_id
    const counts: { [user_id: string]: { count: number; name: string } } = {};
    deliveries.forEach((d) => {
      if (!counts[d.user_id]) counts[d.user_id] = { count: 0, name: d.recipient_name || "Usuário" };
      counts[d.user_id].count++;
    });
    return Object.entries(counts)
      .map(([user_id, { count, name }]) => ({ user_id, count, name }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [deliveries]);

  // Gamification data should be fetched from the database in a production environment
  const achievements: Achievement[] = [];
  const quests: Quest[] = [];

  return (
    <div className="min-h-screen bg-lavender-mist">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-dusty-rose/20">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-golden-honey rounded-full flex items-center justify-center shadow-soft">
              <Clock className="h-5 w-5 text-gentle-black" />
            </div>
            <h1 className="text-xl font-serif font-semibold text-gentle-black">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <CartButton onClick={() => setIsCartOpen(true)} />
            <Button 
              onClick={() => navigate('/create-delivery')}
              variant="brand"
              className="rounded-xl font-medium shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Entrega
            </Button>
            <Button asChild variant="outline" className="ml-2">
              <a href="/profile">Perfil</a>
            </Button>
            <Button
              onClick={signOut}
              variant="gentle"
              className="rounded-xl font-medium ml-2"
            >
              Logout
            </Button>
          </div>
        </div>
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section with Gamification */}
        <div className="mb-12">
          <h2 className="text-4xl font-serif font-semibold text-gentle-black mb-4">
            Bem-vindo, Guardião {profile?.full_name || "Temporal"}! 🎮
          </h2>
          <p className="text-lg text-soft-gray mb-8 leading-relaxed">
            Continue a tua jornada através do tempo. Cada entrega é uma nova aventura!
          </p>
          
          {/* User Stats Card */}
          <UserStats profile={profile} totalDeliveries={deliveries.length} />
        </div>

        {/* Stats Cards with Game Elements */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="emotion-card border-dusty-rose/20 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-dusty-rose to-dusty-rose/80 rounded-2xl flex items-center justify-center shadow-soft">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-semibold text-gentle-black">{deliveries.length}</p>
                  <p className="text-soft-gray font-medium">Entregas Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="emotion-card border-dusty-rose/20 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-golden-honey to-golden-honey/80 rounded-2xl flex items-center justify-center shadow-soft">
                  <Mail className="h-7 w-7 text-gentle-black" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-semibold text-gentle-black">{digitalDeliveries.length}</p>
                  <p className="text-soft-gray font-medium">Portais Digitais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="emotion-card border-dusty-rose/20 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-sage-green to-sage-green/80 rounded-2xl flex items-center justify-center shadow-soft">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-serif font-semibold text-gentle-black">{physicalDeliveries.length}</p>
                  <p className="text-soft-gray font-medium">Cápsulas Físicas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quests Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="emotion-card border-dusty-rose/20 shadow-soft">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 font-serif text-gentle-black">
                <div className="w-6 h-6 bg-dusty-rose rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <span>Missões</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="emotion-card border-dusty-rose/20 shadow-soft">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 font-serif text-gentle-black">
                <div className="w-6 h-6 bg-golden-honey rounded-lg flex items-center justify-center">
                  <Award className="h-4 w-4 text-gentle-black" />
                </div>
                <span>Conquistas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deliveries List */}
        <Card className="emotion-card border-dusty-rose/20 shadow-soft">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center justify-between font-serif text-gentle-black">
              <span className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-golden-honey rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-gentle-black" />
                </div>
                <span>As Tuas Entregas Temporais</span>
              </span>
              <Button 
                onClick={() => navigate('/create-delivery')}
                variant="brand"
                className="rounded-xl font-medium shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Entrega
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filtros e busca */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <input
                type="text"
                placeholder="Buscar por título, destinatário ou mensagem..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 border border-dusty-rose/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-honey"
              />
              <div className="flex gap-2 items-center">
                <button
                  className={`px-4 py-2 rounded-xl border ${!statusFilter ? 'bg-golden-honey text-gentle-black' : 'bg-white text-soft-gray'} border-dusty-rose/30 font-medium`}
                  onClick={() => setStatusFilter(null)}
                >
                  Todos
                </button>
                <button
                  className={`px-4 py-2 rounded-xl border ${statusFilter==='scheduled' ? 'bg-golden-honey text-gentle-black' : 'bg-white text-soft-gray'} border-dusty-rose/30 font-medium`}
                  onClick={() => setStatusFilter('scheduled')}
                >
                  Agendado
                </button>
                <button
                  className={`px-4 py-2 rounded-xl border ${statusFilter==='delivered' ? 'bg-golden-honey text-gentle-black' : 'bg-white text-soft-gray'} border-dusty-rose/30 font-medium`}
                  onClick={() => setStatusFilter('delivered')}
                >
                  Entregue
                </button>
                <button
                  className={`px-4 py-2 rounded-xl border ${statusFilter==='cancelled' ? 'bg-golden-honey text-gentle-black' : 'bg-white text-soft-gray'} border-dusty-rose/30 font-medium`}
                  onClick={() => setStatusFilter('cancelled')}
                >
                  Cancelado
                </button>
                <button
                  className="ml-4 px-4 py-2 rounded-xl border border-sage-green bg-sage-green/10 text-sage-green font-medium hover:bg-sage-green/20 transition"
                  onClick={() => exportToCSV(filteredDeliveries, "entregas.csv")}
                  disabled={filteredDeliveries.length === 0}
                >
                  Exportar CSV
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 py-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-dusty-rose/20 rounded-2xl p-6 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="flex space-x-2 ml-6">
                        <Skeleton className="h-8 w-8 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-golden-honey to-golden-honey/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <Target className="h-10 w-10 text-gentle-black" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-gentle-black mb-3">A tua jornada temporal está prestes a começar!</h3>
                <p className="text-soft-gray mb-6 leading-relaxed">Cada mensagem é uma ponte entre o presente e o futuro.</p>
                <Button
                  onClick={() => navigate('/create-delivery')}
                  variant="brand"
                  className="rounded-xl font-medium shadow-soft"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Entrega
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border border-dusty-rose/20 rounded-2xl p-6 hover:shadow-soft transition-all duration-300 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <h3 className="font-serif font-semibold text-xl text-gentle-black">{delivery.title || "Missão Temporal"}</h3>
                          <Badge className={`${getStatusColor(delivery.status)} rounded-full px-3 py-1 font-medium`}>
                            {getStatusText(delivery.status)}
                          </Badge>
                          <Badge className="bg-misty-gray text-gentle-black rounded-full px-3 py-1 font-medium">
                            {delivery.type === "digital" ? "Portal Digital" : "Cápsula Física"}
                          </Badge>
                        </div>
                        
                        {delivery.recipient_name && (
                          <p className="text-soft-gray mb-3 leading-relaxed">
                            <strong className="font-medium">Destinatário:</strong> {delivery.recipient_name}
                          </p>
                        )}
                        
                        <p className="text-soft-gray mb-3 leading-relaxed">
                          <strong className="font-medium">Data de entrega:</strong> {new Date(delivery.delivery_date).toLocaleDateString('pt-PT')}
                        </p>
                        
                        {delivery.delivery_address && (
                          <p className="text-soft-gray mb-3 leading-relaxed">
                            <strong className="font-medium">Local:</strong> {delivery.delivery_address}
                          </p>
                        )}
                        
                        {delivery.message && (
                          <p className="text-soft-gray italic leading-relaxed bg-lavender-mist/30 p-4 rounded-xl">
                            "{delivery.message}"
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-6">
                        <Button size="sm" variant="outline" className="border-dusty-rose/30 text-soft-gray hover:bg-dusty-rose/10 rounded-xl">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10 rounded-xl"
                          onClick={() => handleDelete(delivery.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Métricas e gráfico */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-dusty-rose/20 shadow-soft">
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-3xl font-serif font-bold text-gentle-black">{total}</span>
              <span className="text-soft-gray font-medium mt-2">Total de Entregas</span>
            </CardContent>
          </Card>
          <Card className="border-dusty-rose/20 shadow-soft">
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-3xl font-serif font-bold text-warm-yellow">{scheduled}</span>
              <span className="text-soft-gray font-medium mt-2">Agendadas</span>
            </CardContent>
          </Card>
          <Card className="border-dusty-rose/20 shadow-soft">
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-3xl font-serif font-bold text-sage-green">{delivered}</span>
              <span className="text-soft-gray font-medium mt-2">Entregues</span>
            </CardContent>
          </Card>
          <Card className="border-dusty-rose/20 shadow-soft">
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-3xl font-serif font-bold text-dusty-rose">{cancelled}</span>
              <span className="text-soft-gray font-medium mt-2">Canceladas</span>
            </CardContent>
          </Card>
        </div>
        <div className="mb-12">
          <h3 className="text-lg font-serif font-semibold text-gentle-black mb-2">Entregas por mês</h3>
          <DeliveriesBarChart data={deliveriesByMonth} />
        </div>
        <div className="mb-12">
          <TopUsersRanking users={topUsers} />
        </div>

        {/* Admin Achievements and Quests Management (Mock) */}
        <div className="mb-12">
          <h3 className="text-lg font-serif font-semibold text-gentle-black mb-4">Administração de Conquistas e Missões</h3>
          <AdminAchievementsQuests />
        </div>

        {/* Motivational Quote with Game Theme */}
        <div className="mt-12 bg-gradient-to-r from-lavender-mist to-misty-gray/30 border border-dusty-rose/20 rounded-2xl p-8 shadow-soft">
          <p className="text-center text-lg font-serif text-gentle-black italic leading-relaxed">
            "Cada missão completada te aproxima do título de Mestre Temporal! ✨"
          </p>
          <p className="text-center text-golden-honey font-medium mt-2 font-serif">
            — Presente no futuro
          </p>
        </div>
      </div>
    </div>
  );
};

// === FIM DA REFATORAÇÃO DO DASHBOARD ===
export default Dashboard;
