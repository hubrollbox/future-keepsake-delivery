
import Navigation from "@/components/Navigation";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useRealtimeDeliveries } from "@/hooks/useRealtimeDeliveries";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import AdminStatsSection from "@/components/dashboard/AdminStatsSection";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import TimeCapsuleSection from "@/components/dashboard/TimeCapsuleSection";
import { useKeepsakes } from "@/hooks/useKeepsakes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { deliveries, loading: deliveriesLoading, deleteDelivery } = useDeliveries();
  const { keepsakes, loading: keepsakesLoading, refetch: refetchKeepsakes } = useKeepsakes();
  const isAdmin = profile?.role === "admin";
  const { toast } = useToast();

  const deleteKeepsake = async (id: string) => {
    try {
      if (!confirm("Eliminar esta cápsula?")) return;
      const { error } = await supabase.from('keepsakes').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Cápsula eliminada" });
      refetchKeepsakes();
    } catch (e: any) {
      toast({ title: "Erro ao eliminar", description: e?.message || "Tenta novamente.", variant: "destructive" });
    }
  };

  // Initialize real-time notifications
  useRealtimeDeliveries();

  console.log('📊 Dashboard render state:', { 
    user: !!user, 
    profile: !!profile, 
    loading,
    profileData: profile 
  });

  React.useEffect(() => {
    if (!loading && !user) {
      console.log('🚪 No user found, redirecting to login');
      navigate("/login");
    }
  }, [user, loading, navigate]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-lavender-mist flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-serif text-steel-blue mb-4">Sessão não encontrada</h2>
          <p className="text-soft-gray">A redireccionar para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <ProfileHeader />
        
        {isAdmin && <AdminStatsSection />}
        
        {isAdmin ? (
          // Layout para Admin
          <div className="space-y-8">
            <TimeCapsuleSection 
              deliveries={deliveries}
              loading={deliveriesLoading}
              onDelete={deleteDelivery}
            />

            {/* Keepsakes Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-serif font-semibold text-steel-blue">Minhas Cápsulas</h3>
              {keepsakesLoading ? (
                <p className="text-misty-gray">A carregar cápsulas...</p>
              ) : (
                <ul className="space-y-2">
                  {keepsakes.map(k => (
                    <li key={k.id} className="p-3 bg-warm-cream border border-dusty-rose/20 rounded-md flex items-center justify-between gap-3">
                      <div>
                        <p className="text-steel-blue font-medium">{k.title}</p>
                        <p className="text-sm text-misty-gray">Entrega: {new Date(k.delivery_date).toLocaleDateString('pt-PT')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-dusty-rose/10 text-dusty-rose">{k.status || 'scheduled'}</span>
                        <Button variant="outline" size="sm" onClick={() => deleteKeepsake(k.id)}>Apagar</Button>
                      </div>
                    </li>
                  ))}
                  {keepsakes.length === 0 && (
                    <p className="text-misty-gray">Sem cápsulas ainda.</p>
                  )}
                </ul>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/admin")}
                className="emotion-card p-6 text-left hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-warm-cream to-sandy-beige border-2 border-dusty-rose/20"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-dusty-rose/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-steel-blue">Painel Admin</h3>
                </div>
                <p className="text-sm text-misty-gray">Acesso completo ao sistema</p>
              </button>
              
              <button
                onClick={() => navigate("/create-keepsake")}
                className="emotion-card p-6 text-left hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-warm-cream to-sandy-beige border-2 border-dusty-rose/20"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-dusty-rose/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">💌</span>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-steel-blue">Nova Cápsula</h3>
                </div>
                <p className="text-sm text-misty-gray">Criar uma nova mensagem</p>
              </button>
              
              <button
                onClick={() => navigate("/profile")}
                className="emotion-card p-6 text-left hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-warm-cream to-sandy-beige border-2 border-dusty-rose/20"
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-dusty-rose/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-steel-blue">Perfil</h3>
                </div>
                <p className="text-sm text-misty-gray">Gerir informações</p>
              </button>
            </div>
          </div>
        ) : (
          // Layout para Utilizador Normal
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <TimeCapsuleSection 
                deliveries={deliveries}
                loading={deliveriesLoading}
                onDelete={deleteDelivery}
              />

              {/* Keepsakes Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-serif font-semibold text-steel-blue">Minhas Cápsulas</h3>
                {keepsakesLoading ? (
                  <p className="text-misty-gray">A carregar cápsulas...</p>
                ) : (
                <ul className="space-y-2">
                  {keepsakes.map(k => (
                    <li key={k.id} className="p-3 bg-warm-cream border border-dusty-rose/20 rounded-md flex items-center justify-between gap-3">
                      <div>
                        <p className="text-steel-blue font-medium">{k.title}</p>
                        <p className="text-sm text-misty-gray">Entrega: {new Date(k.delivery_date).toLocaleDateString('pt-PT')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-dusty-rose/10 text-dusty-rose">{k.status || 'scheduled'}</span>
                        <Button variant="outline" size="sm" onClick={() => deleteKeepsake(k.id)}>Apagar</Button>
                      </div>
                    </li>
                  ))}
                  {keepsakes.length === 0 && (
                    <p className="text-misty-gray">Sem cápsulas ainda.</p>
                  )}
                </ul>
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
                    <h3 className="text-lg font-serif font-semibold text-steel-blue">Nova Cápsula</h3>
                  </div>
                  <p className="text-sm text-misty-gray">Criar uma nova mensagem para o futuro</p>
                </button>
                
                <button
                  onClick={() => navigate("/profile")}
                  className="emotion-card p-6 text-left hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-warm-cream to-sandy-beige border-2 border-dusty-rose/20"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-dusty-rose/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-steel-blue">Perfil</h3>
                  </div>
                  <p className="text-sm text-misty-gray">Gerir as tuas informações pessoais</p>
                </button>
              </div>
            </div>
            
            <div className="xl:col-span-1">
              <UserStatsSection 
                profile={profile}
                totalDeliveries={deliveries.length}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
