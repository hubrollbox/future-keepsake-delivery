
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, MessageSquare, TrendingUp, Database } from "lucide-react";
import useAdminData from "@/hooks/useAdminData";
import DeliveriesBarChart from "./DeliveriesBarChart";
import TopUsersRanking from "./TopUsersRanking";

const AdminStatsSection = () => {
  const { stats, deliveriesByMonth, topUsers, loading } = useAdminData();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-semibold text-gentle-black mb-4">Estatísticas Administrativas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card className="shadow-soft border-dusty-rose/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-misty-gray">Total Entregas</p>
                <p className="text-3xl font-bold text-steel-blue">{loading ? "..." : stats?.totalDeliveries || 0}</p>
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
                <p className="text-3xl font-bold text-steel-blue">{loading ? "..." : stats?.pendingDeliveries || 0}</p>
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
                <p className="text-3xl font-bold text-steel-blue">{loading ? "..." : stats?.digitalMessages || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-dusty-rose" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-dusty-rose/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-misty-gray">Itens em Armazém</p>
                <p className="text-3xl font-bold text-steel-blue">{loading ? "..." : stats?.warehouseItems || 0}</p>
              </div>
              <Database className="h-8 w-8 text-sage-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-dusty-rose/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-misty-gray">Pagamentos (7 dias)</p>
                <p className="text-3xl font-bold text-steel-blue">{loading ? "..." : stats?.recentPayments || 0}</p>
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

export default AdminStatsSection;
