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
import { LogOut } from "lucide-react";
import type { Achievement } from "@/components/gamification/AchievementCard";
import type { Quest } from "@/components/gamification/QuestCard";

// === INÍCIO DA REFATORAÇÃO DO DASHBOARD ===
// NOVO DASHBOARD: Perfil, Cápsula do Tempo, Árvore da Memória
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { deliveries, loading, deleteDelivery } = useDeliveries();
  const isAdmin = profile?.role === "admin";
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);

  // --- Helper functions moved inside component ---
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

  // --- PROFILE SECTION ---
  const ProfileSection = () => (
    <section className="mb-6">
      <Card className="shadow-soft border-dusty-rose/20">
        <CardHeader className="flex flex-col items-center gap-2 pb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-golden-honey to-dusty-rose flex items-center justify-center shadow-soft mb-2">
            <Users className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl font-serif font-semibold text-gentle-black text-center">{profile?.full_name || "Guardião Temporal"}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Mail className="h-5 w-5 text-soft-gray" />
            <span className="text-soft-gray font-medium">{user?.email}</span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-golden-honey" />
            <span className="font-medium text-gentle-black">Nível:</span>
            <span className="font-serif text-xl text-gentle-black">{profile?.level || 1}</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-golden-honey" />
            <span className="font-medium text-gentle-black">Pontos:</span>
            <span className="font-serif text-xl text-gentle-black">{profile?.total_points || 0}</span>
          </div>
          <Button variant="gentle" className="rounded-xl font-medium mt-4" onClick={signOut}>
            <LogOut className="h-5 w-5 mr-2" /> Sair
          </Button>
        </CardContent>
      </Card>
    </section>
  );

  // --- TIME CAPSULE SECTION ---
  const TimeCapsuleSection = () => (
    <section className="mb-6">
      <Card className="shadow-soft border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-blue-900">Cápsula do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="flex flex-col gap-4">
              {deliveries.length === 0 ? (
                <p className="text-gray-500">Nenhuma mensagem ou entrega encontrada.</p>
              ) : (
                deliveries.map((delivery) => (
                  <Card key={delivery.id} className="border border-blue-100 bg-blue-50">
                    <CardContent className="flex flex-col gap-2 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-blue-900">{delivery.title || "Mensagem"}</h4>
                          <p className="text-xs text-gray-600">Para: {delivery.recipient_name}</p>
                        </div>
                        <Badge className={getStatusColor(delivery.status)}>{getStatusText(delivery.status)}</Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{delivery.message}</p>
                      <div className="flex gap-2 mt-2">
                        {delivery.status === "scheduled" && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/edit-delivery/${delivery.id}`)}>
                            <Edit className="h-4 w-4 mr-1" /> Editar
                          </Button>
                        )}
                        {delivery.status === "scheduled" && (
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(delivery.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Cancelar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );

  // --- MEMORY TREE (GAMIFICATION) SECTION ---
  const MemoryTreeSection = () => (
    <section className="mb-6">
      <Card className="shadow-soft border-green-200">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-green-900">Árvore da Memória</CardTitle>
        </CardHeader>
        <CardContent>
          <UserStats profile={profile} totalDeliveries={deliveries.length} />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-800">Conquistas</h4>
              <AchievementCard achievement={{ id: "1", title: "Primeira Entrega", description: "Enviaste a tua primeira mensagem!", icon: Award, unlocked: true, points: 50 }} />
              {/* Map real achievements here */}
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-800">Missões</h4>
              <QuestCard quest={{ id: "1", title: "Enviar 5 Mensagens", description: "Envia 5 mensagens para desbloquear esta missão.", progress: deliveries.length, target: 5, reward: 100 }} />
              {/* Map real quests here */}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );

  // --- ADMIN SECTION (if admin) ---
  const AdminSection = () => (
    isAdmin ? (
      <section className="mb-6">
        <Card className="shadow-soft border-pink-200">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-pink-900">Administração</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-gray-700">Acesso total a todas as informações e ferramentas administrativas.</p>
            <AdminAchievementsQuests />
            <DeliveriesBarChart data={deliveriesByMonth} />
            <TopUsersRanking users={topUsers} />
          </CardContent>
        </Card>
      </section>
    ) : null
  );

  // --- FEATURED PRODUCT PROMOTION SECTION ---
  const FeaturedProductSection = () => (
    <section className="mb-6">
      <Card className="shadow-lg border-2 border-golden-honey bg-yellow-50 animate-pulse-slow">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <span className="uppercase tracking-widest text-xs font-bold text-golden-honey">Promoção</span>
          <CardTitle className="text-2xl font-serif font-semibold text-gentle-black text-center">Produto em Destaque: Caixa do Tempo Premium</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <img
            src="/Capsula do Tempo.png"
            alt="Caixa do Tempo Premium"
            className="w-32 h-32 object-contain rounded-lg shadow-md mb-2"
          />
          <h2 className="font-bold text-center text-lg">Caixa do Tempo Premium</h2>
          <p className="text-center text-sm">Oferta especial: Ganhe um mimo exclusivo na sua primeira compra!</p>
          <a href="/products" className="mt-2">
            <Button variant="brand">
              Aproveitar Oferta
            </Button>
          </a>
        </CardContent>
      </Card>
    </section>
  );

  return (
    <main
      className="container mx-auto px-2 py-4 max-w-2xl flex flex-col gap-6"
      style={{
        backgroundImage: "url('/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        borderRadius: '2rem',
      }}
    >
      {/* Conteúdo do Dashboard permanece igual, sem produto em destaque */}
      <ProfileSection />
      <TimeCapsuleSection />
      <MemoryTreeSection />
      <AdminSection />
    </main>
  );
};

// === FIM DA REFATORAÇÃO DO DASHBOARD ===
export default Dashboard;
