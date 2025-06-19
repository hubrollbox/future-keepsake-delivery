
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, TrendingUp, Clock, Mail, Calendar, Database, Loader2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

const AdminDashboard = () => {
  const { stats, loading } = useAdminData();

  const dashboardStats = [
    {
      title: "Total de Entregas",
      value: stats.totalDeliveries.toString(),
      icon: <Package className="h-5 w-5" />
    },
    {
      title: "Entregas Pendentes (7 dias)",
      value: stats.pendingDeliveries.toString(),
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "Mensagens Digitais",
      value: stats.digitalMessages.toString(),
      icon: <Mail className="h-5 w-5" />
    },
    {
      title: "Itens em Armazém",
      value: stats.warehouseItems.toString(),
      icon: <Database className="h-5 w-5" />
    },
    {
      title: "Pagamentos Recentes (7 dias)",
      value: stats.recentPayments.toString(),
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  // TODO: Fetch recent activity from the database
  const recentActivity: any[] = [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-dusty-rose" />
        <span className="text-steel-blue font-medium ml-2">A carregar dados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-hero-sm text-steel-blue font-fraunces mb-2">
          Painel de <span className="text-earthy-burgundy">Administração</span>
        </h1>
        <p className="text-misty-gray">Visão geral da plataforma keeplar</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="emotion-card border-dusty-rose/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-misty-gray">{stat.title}</p>
                  <p className="text-2xl font-bold text-steel-blue">{stat.value}</p>

                </div>
                <div className="p-3 bg-earthy-burgundy/10 rounded-xl text-earthy-burgundy">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <Clock className="h-5 w-5 text-earthy-burgundy" />
              <span>Atividade Recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Display recent activity here */}
            <p className="text-misty-gray text-sm">Nenhuma atividade recente para mostrar.</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {/* TODO: Implement dynamic quick actions based on user roles/permissions or configuration */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-earthy-burgundy" />
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Example of a quick action button */}
              <button className="p-4 text-left bg-earthy-burgundy/5 hover:bg-earthy-burgundy/10 rounded-xl transition-colors duration-200 group">
                <Users className="h-6 w-6 text-earthy-burgundy mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-steel-blue font-medium text-sm">Gerir Utilizadores</p>
              </button>
              {/* Add more dynamic quick action buttons here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
