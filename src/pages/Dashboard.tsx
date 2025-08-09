
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { deliveries, loading: deliveriesLoading, deleteDelivery } = useDeliveries();
  const isAdmin = profile?.role === "admin";

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
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <TimeCapsuleSection 
              deliveries={deliveries}
              loading={deliveriesLoading}
              onDelete={deleteDelivery}
            />
          </div>
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
