import Navigation from "@/components/Navigation";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useRealtimeDeliveries } from "@/hooks/useRealtimeDeliveries";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import TimeCapsuleSection from "@/components/dashboard/TimeCapsuleSection";
import { KeepsakesList } from "@/components/dashboard/KeepsakesList";
import { useKeepsakes } from "@/hooks/useKeepsakes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Clock, Package, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const isAdmin = profile?.role === "admin";
  const { deliveries, loading: deliveriesLoading, deleteDelivery } = useDeliveries();
  const { keepsakes, loading: keepsakesLoading, refetch: refetchKeepsakes } = useKeepsakes();
  const { toast } = useToast();

  // Estado para confirmação de eliminação
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  // Apenas usar notificações em tempo real para utilizadores normais
  React.useEffect(() => {
    if (!loading && user && !isAdmin) {
      useRealtimeDeliveries();
    }
  }, [loading, user, isAdmin]);

  // Redirecionamento único
  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (isAdmin) {
        navigate("/admin");
      }
    }
  }, [loading, user, isAdmin, navigate]);

  const deleteKeepsake = async (id: string) => {
    try {
      const { error } = await supabase.from("keepsakes").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Cápsula eliminada" });
      refetchKeepsakes();
    } catch (e: any) {
      toast({
        title: "Erro ao eliminar",
        description: e?.message || "Tenta novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

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
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <ProfileHeader />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <TimeCapsuleSection
              deliveries={deliveries}
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

              {keepsakesLoading ? (
                <p className="text-soft-gray">A carregar cápsulas...</p>
              ) : (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="flex items-center gap-1">
                      <Package className="h-4 w-4" /> Todas
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Pendentes
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Enviadas
                    </TabsTrigger>
                    <TabsTrigger value="delivered" className="flex items-center gap-1">
                      <Package className="h-4 w-4" /> Entregues
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <KeepsakesList keepsakes={keepsakes} onDelete={handleDeleteClick} />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4">
                    <KeepsakesList
                      keepsakes={keepsakes.filter((k) => k.status === "pending")}
                      onDelete={handleDeleteClick}
                    />
                  </TabsContent>
                  <TabsContent value="sent" className="mt-4">
                    <KeepsakesList
                      keepsakes={keepsakes.filter((k) => k.status === "sent")}
                      onDelete={handleDeleteClick}
                    />
                  </TabsContent>
                  <TabsContent value="delivered" className="mt-4">
                    <KeepsakesList
                      keepsakes={keepsakes.filter((k) => k.status === "delivered")}
                      onDelete={handleDeleteClick}
                    />
                  </TabsContent>
                </Tabs>
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

      {/* Dialog de confirmação de eliminação */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cápsula</DialogTitle>
            <p className="text-sm text-soft-gray">
              Tens a certeza que queres eliminar esta cápsula? Esta ação não pode ser
              desfeita.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDeleteId) deleteKeepsake(pendingDeleteId);
                setConfirmOpen(false);
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;