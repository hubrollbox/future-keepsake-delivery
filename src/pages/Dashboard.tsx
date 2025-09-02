import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import TimeCapsuleSection from "@/components/dashboard/TimeCapsuleSection";
import { KeepsakesList } from "@/components/dashboard/KeepsakesList";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Clock, Package, CheckCircle } from "lucide-react";



const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { deliveries, loading: deliveriesLoading, deleteDelivery } = useDeliveries();

// Estado para confirmação de eliminação removido (gerido dentro de KeepsakesList)


  if (loading) {
    return (
      <div className="min-h-screen bg-lavender-mist flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dusty-rose mx-auto mb-4"></div>
          <h2 className="text-xl font-serif text-steel-blue">A carregar o seu dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      <main className="dashboard-layout container mx-auto max-w-7xl">
        <ProfileHeader />

        <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
          <div className="xl:col-span-2 space-y-6 md:space-y-8">
            <TimeCapsuleSection
              deliveries={deliveries as any[]}
              loading={deliveriesLoading}
              onDelete={deleteDelivery}
            />

            {/* Keepsakes Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif font-semibold text-steel-blue">
                  Minhas Cápsulas
                </h3>
                <Button
                  onClick={() => navigate("/create-keepsake")}
                  size="sm"
                  className="flex items-center gap-1 bg-dusty-rose hover:bg-dusty-rose/90"
                >
                  <PlusCircle className="h-4 w-4" /> Nova Cápsula
                </Button>
              </div>

              {!loading ? (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
                    <TabsTrigger value="all" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4" /> 
                      <span className="hidden xs:inline sm:inline">Todas</span>
                      <span className="xs:hidden sm:hidden">All</span>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> 
                      <span className="hidden xs:inline sm:inline">Pendentes</span>
                      <span className="xs:hidden sm:hidden">Pend</span>
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> 
                      <span className="hidden xs:inline sm:inline">Enviadas</span>
                      <span className="xs:hidden sm:hidden">Env</span>
                    </TabsTrigger>
                    <TabsTrigger value="delivered" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4" /> 
                      <span className="hidden xs:inline sm:inline">Entregues</span>
                      <span className="xs:hidden sm:hidden">Entr</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <KeepsakesList />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4">
                    <KeepsakesList statusFilter="pending" />
                  </TabsContent>
                  <TabsContent value="sent" className="mt-4">
                    <KeepsakesList statusFilter="sent" />
                  </TabsContent>
                  <TabsContent value="delivered" className="mt-4">
                    <KeepsakesList statusFilter="delivered" />
                  </TabsContent>
                </Tabs>
              ) : (
                <p className="text-soft-gray">A carregar cápsulas...</p>
              )}
            </div>

            {/* Botões de Ação Rápida */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/create-keepsake")}
                className="emotion-card p-6 text-left hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-warm-cream to-sandy-beige border-2 border-dusty-rose/20"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-dusty-rose/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">💌</span>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-steel-blue">
                    Nova Cápsula
                  </h3>
                </div>
                <p className="text-sm text-misty-gray">
                  Criar uma nova mensagem para o futuro
                </p>
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="emotion-card p-6 text-left hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-warm-cream to-sandy-beige border-2 border-dusty-rose/20"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-dusty-rose/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-steel-blue">
                    Perfil
                  </h3>
                </div>
                <p className="text-sm text-misty-gray">
                  Gerir as tuas informações pessoais
                </p>
              </button>
            </div>
          </div>

          {/* Secção de Estatísticas */}
          <div className="xl:col-span-1">
            <UserStatsSection
              profile={profile}
              totalDeliveries={deliveries.length}
            />
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;