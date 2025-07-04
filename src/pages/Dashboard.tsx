
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
  const { user, profile } = useAuth();
  const { deliveries, loading, deleteDelivery } = useDeliveries();
  const isAdmin = profile?.role === "admin";

  // Initialize real-time notifications
  useRealtimeDeliveries();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
              loading={loading}
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
