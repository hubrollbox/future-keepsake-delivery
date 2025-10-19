
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, TrendingUp, Clock, Mail, Calendar, Database, Loader2 } from "lucide-react";
import useAdminData from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";
import DeliveriesBarChart from "@/components/dashboard/DeliveriesBarChart";
import TopUsersRanking from "@/components/dashboard/TopUsersRanking";

interface RecentDelivery {
  id: string;
  delivery_date: string;
  status: string;
  title: string;
}

interface RecentWarehouseItem {
  id: string;
  client_name: string;
  product_description: string;
  received_date: string;
  status: string;
}

const AdminDashboard = () => {
  const { stats, deliveriesByMonth, topUsers, loading } = useAdminData();
  const [recentDeliveries, setRecentDeliveries] = useState<RecentDelivery[]>([]);
  const [warehouseRecords, setWarehouseRecords] = useState<RecentWarehouseItem[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const fetchRecentData = useCallback(async () => {
    setLoadingLists(true);
    try {
      // Fetch upcoming deliveries (next 30 days)
      const now = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(now.getDate() + 30);
      
      const { data: deliveriesData } = await supabase
        .from("deliveries")
        .select("id, delivery_date, status, title")
        .gte("delivery_date", now.toISOString())
        .lte("delivery_date", thirtyDays.toISOString())
        .order("delivery_date", { ascending: true })
        .limit(10);
      
      setRecentDeliveries(deliveriesData || []);
      
      // Fetch latest warehouse records
      const { data: warehouseData } = await supabase
        .from("warehouse_items")
        .select("id, client_name, product_description, received_date, status")
        .order("received_date", { ascending: false })
        .limit(10);
      
      setWarehouseRecords(warehouseData || []);
    } catch (error) {
      console.error("Error fetching recent data:", error);
    } finally {
      setLoadingLists(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentData();
  }, [fetchRecentData]);

  const dashboardStats = [
    {
      title: "Total de Entregas",
      value: ((stats as any)?.totalDeliveries || 0).toString(),
      icon: <Package className="h-5 w-5" />,
      color: "text-earthy-burgundy"
    },
    {
      title: "Entregas Pendentes (7 dias)",
      value: ((stats as any)?.pendingDeliveries || 0).toString(),
      icon: <Clock className="h-5 w-5" />,
      color: "text-golden-honey"
    },
    {
      title: "Mensagens Digitais",
      value: ((stats as any)?.digitalMessages || 0).toString(),
      icon: <Mail className="h-5 w-5" />,
      color: "text-dusty-rose"
    },
    {
      title: "Itens em Armazém",
      value: ((stats as any)?.warehouseItems || 0).toString(),
      icon: <Database className="h-5 w-5" />,
      color: "text-sage-green"
    },
    {
      title: "Pagamentos Recentes (7 dias)",
      value: ((stats as any)?.recentPayments || 0).toString(),
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-steel-blue"
    }
  ];

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
        <p className="text-misty-gray">Visão geral da plataforma FuturoPresente</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="emotion-card border-dusty-rose/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-misty-gray">{stat.title}</p>
                  <p className="text-2xl font-bold text-steel-blue">{stat.value}</p>
                </div>
                <div className={`p-3 bg-earthy-burgundy/10 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Deliveries by Month Chart */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-earthy-burgundy" />
              <span>Entregas por Mês</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveriesBarChart data={deliveriesByMonth} />
          </CardContent>
        </Card>

        {/* Top Users Ranking */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <Users className="h-5 w-5 text-earthy-burgundy" />
              <span>Top Utilizadores</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopUsersRanking users={topUsers as any} />
          </CardContent>
        </Card>

        {/* Upcoming Deliveries */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-earthy-burgundy" />
              <span>Próximas Entregas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLists ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                A carregar entregas...
              </div>
            ) : recentDeliveries.length === 0 ? (
              <p className="text-misty-gray text-sm">Nenhuma entrega agendada para os próximos 30 dias.</p>
            ) : (
              <div className="space-y-3">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex justify-between items-center py-2 border-b border-lavender-mist last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-steel-blue">{delivery.title || "Mensagem"}</p>
                      <p className="text-sm text-misty-gray">Entrega: {delivery.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-misty-gray">
                        {new Date(delivery.delivery_date).toLocaleDateString('pt-PT')}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        delivery.status === 'scheduled' ? 'bg-golden-honey/20 text-golden-honey' :
                        delivery.status === 'delivered' ? 'bg-sage-green/20 text-sage-green' :
                        'bg-misty-gray/20 text-misty-gray'
                      }`}>
                        {delivery.status === 'scheduled' ? 'Agendado' :
                         delivery.status === 'delivered' ? 'Entregue' : 
                         delivery.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Warehouse Records */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <Package className="h-5 w-5 text-earthy-burgundy" />
              <span>Últimos Registos em Armazém</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLists ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                A carregar registos...
              </div>
            ) : warehouseRecords.length === 0 ? (
              <p className="text-misty-gray text-sm">Nenhum registo encontrado no armazém.</p>
            ) : (
              <div className="space-y-3">
                {warehouseRecords.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-lavender-mist last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-steel-blue">{item.client_name}</p>
                      <p className="text-sm text-misty-gray">{item.product_description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-misty-gray">
                        {new Date(item.received_date).toLocaleDateString('pt-PT')}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'stored' ? 'bg-steel-blue/20 text-steel-blue' :
                        item.status === 'delivered' ? 'bg-sage-green/20 text-sage-green' :
                        'bg-misty-gray/20 text-misty-gray'
                      }`}>
                        {item.status === 'stored' ? 'Armazenado' :
                         item.status === 'delivered' ? 'Entregue' : 
                         item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
