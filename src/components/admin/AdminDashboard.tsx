
import React from "react";
import { Package, Clock, MessageSquare, Warehouse, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminData } from "@/hooks/useAdminData";

const AdminDashboard = () => {
  const { stats, loading } = useAdminData();

  const statCards = [
    {
      title: "Total de Entregas",
      value: stats.totalDeliveries,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Pendentes (7 dias)",
      value: stats.pendingDeliveries,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Mensagens Digitais",
      value: stats.digitalMessages,
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Itens no Armazém",
      value: stats.warehouseItems,
      icon: Warehouse,
      color: "text-purple-600",
    },
    {
      title: "Pagamentos (7 dias)",
      value: stats.recentPayments,
      icon: CreditCard,
      color: "text-gold",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resumo do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sistema</span>
              <span className="text-green-600 font-medium">Operacional</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Última sincronização</span>
              <span className="text-gray-900 font-medium">Agora mesmo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base de dados</span>
              <span className="text-green-600 font-medium">Conectada</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left px-4 py-2 rounded-md bg-gold/10 text-gold hover:bg-gold/20 transition-colors">
              Ver entregas pendentes
            </button>
            <button className="w-full text-left px-4 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              Processar novos itens
            </button>
            <button className="w-full text-left px-4 py-2 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
              Verificar pagamentos
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
