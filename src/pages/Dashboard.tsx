import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import useDeliveries from "@/hooks/useDeliveries";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import TimeCapsuleSection from "@/components/dashboard/TimeCapsuleSection";
import { KeepsakesList } from "@/components/dashboard/KeepsakesList";
import { Button } from "@/components/ui/button";
import type { Delivery } from "@/types/admin";
import SEOHead from "@/components/SEOHead";
import GuidedTour from "@/components/GuidedTour";
import PhotoBackground from "@/components/layout/PhotoBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Clock, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import memorialImage from "@/assets/memorial-pc.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, profile } = useAuth();
  const { deliveries, loading: deliveriesLoading, deleteDelivery } = useDeliveries();

  // Transform deliveries to match Delivery interface
  const transformedDeliveries: Delivery[] = deliveries.map(d => ({
    id: d.id,
    title: String(d.title || "Sem título"),
    recipient_name: String(d.location || "Destinatário desconhecido"),
    delivery_date: String(d.delivery_date),
    created_at: String(d.created_at || new Date().toISOString()),
    status: d.status ? String(d.status) : null,
    ...(d.description && { message: String(d.description) })
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-keepla-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-keepla-red mx-auto mb-4"></div>
          <h2 className="text-xl font-serif text-keepla-black">A carregar o seu dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-keepla-black">
      <SEOHead 
        title="Dashboard"
        description="Gere os teus keepsakes, acompanha entregas e descobre as tuas estatísticas. A tua central de memórias."
      />
      <GuidedTour />
      <Navigation />

      {/* Mini Hero */}
      <PhotoBackground 
        image={memorialImage} 
        alt="Memorial de memórias"
        overlay="dark"
        size="compact"
        className="py-8"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-keepla-white/70 font-georgia italic text-lg mb-2">
              Bem-vindo de volta, {profile?.full_name || 'Guardião'}
            </p>
            <h1 className="text-3xl md:text-4xl font-inter font-bold text-keepla-white">
              A Tua Central de <span className="text-keepla-red">Memórias</span>
            </h1>
          </motion.div>
        </div>
      </PhotoBackground>

      <main className="bg-keepla-white">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div data-tour="profile">
            <ProfileHeader />
          </div>

          <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8 mt-8">
            <div className="xl:col-span-2 space-y-6 md:space-y-8">
              <TimeCapsuleSection
                deliveries={transformedDeliveries}
                loading={deliveriesLoading}
                onDelete={deleteDelivery}
              />

              {/* Keepsakes Section */}
              <div className="space-y-3" data-tour="keepsakes-list">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-serif font-semibold text-keepla-black">
                    Minhas Cápsulas
                  </h3>
                  <Button
                    onClick={() => navigate("/create-keepsake")}
                    size="sm"
                    className="flex items-center gap-1 bg-keepla-red hover:bg-keepla-red/90"
                    data-tour="create-keepsake"
                  >
                    <PlusCircle className="h-4 w-4" /> Nova Cápsula
                  </Button>
                </div>

                {!loading ? (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
                      <TabsTrigger value="all" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                        <Package className="h-3 w-3 sm:h-4 sm:w-4" /> 
                        <span className="hidden sm:inline">Todas</span>
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> 
                        <span className="hidden sm:inline">Pendentes</span>
                      </TabsTrigger>
                      <TabsTrigger value="sent" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> 
                        <span className="hidden sm:inline">Enviadas</span>
                      </TabsTrigger>
                      <TabsTrigger value="delivered" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                        <Package className="h-3 w-3 sm:h-4 sm:w-4" /> 
                        <span className="hidden sm:inline">Entregues</span>
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
                  <p className="text-muted-foreground">A carregar cápsulas...</p>
                )}
              </div>

              {/* Botões de Ação Rápida */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/create-keepsake")}
                  className="p-6 text-left hover:shadow-lg transition-all duration-300 bg-keepla-white border-2 border-keepla-red/20 rounded-xl hover:border-keepla-red/40"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-keepla-red/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">💌</span>
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-keepla-black">
                      Nova Cápsula
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Criar uma nova mensagem para o futuro
                  </p>
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="p-6 text-left hover:shadow-lg transition-all duration-300 bg-keepla-white border-2 border-keepla-red/20 rounded-xl hover:border-keepla-red/40"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-keepla-red/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-keepla-black">
                      Perfil
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Gerir as tuas informações pessoais
                  </p>
                </button>
              </div>
            </div>

            {/* Secção de Estatísticas */}
            <div className="xl:col-span-1" data-tour="stats">
              <UserStatsSection
                totalDeliveries={deliveries.length}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
