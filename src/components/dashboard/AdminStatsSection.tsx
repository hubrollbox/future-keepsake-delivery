
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, MessageSquare, TrendingUp, Database } from "lucide-react";

const AdminStatsSection = () => {
  // Disabled useAdminData for MVP simplification
  const stats = {
    totalDeliveries: 0,
    pendingDeliveries: 0,
    digitalMessages: 0,
    warehouseItems: 0,
    recentPayments: 0,
  };
  const loading = false;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-semibold text-keepla-gray-800 mb-4">Estatísticas Administrativas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card className="shadow-soft border-keepla-gray/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-keepla-gray">Total Entregas</p>
                <p className="text-3xl font-bold text-keepla-gray-800">0</p>
              </div>
              <Package className="h-8 w-8 text-keepla-gray" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft border-keepla-gray/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-keepla-gray">Entregas Pendentes</p>
                <p className="text-3xl font-bold text-keepla-gray-800">0</p>
              </div>
              <Clock className="h-8 w-8 text-keepla-gray" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-keepla-gray/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-keepla-gray">Mensagens Digitais</p>
                <p className="text-3xl font-bold text-keepla-gray-800">0</p>
              </div>
              <MessageSquare className="h-8 w-8 text-keepla-gray" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-keepla-gray/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-keepla-gray">Itens em Armazém</p>
                <p className="text-3xl font-bold text-keepla-gray-800">0</p>
              </div>
              <Database className="h-8 w-8 text-keepla-gray" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-keepla-gray/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-keepla-gray">Pagamentos (7 dias)</p>
                <p className="text-3xl font-bold text-keepla-gray-800">0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-keepla-gray" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatsSection;
