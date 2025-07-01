
import Navigation from "@/components/Navigation";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import AdminStatsSection from "@/components/dashboard/AdminStatsSection";
import UserStatsSection from "@/components/dashboard/UserStatsSection";
import TimeCapsuleSection from "@/components/dashboard/TimeCapsuleSection";
import DashboardMenu from "@/components/dashboard/DashboardMenu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { deliveries, loading, deleteDelivery } = useDeliveries();
  const isAdmin = profile?.role === "admin";

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const deliveriesByMonth = React.useMemo(() => {
    const months: { [key: string]: number } = {};
    deliveries.forEach((d) => {
      const date = new Date(d.delivery_date);
      const key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [deliveries]);

  const topUsers = React.useMemo(() => {
    const userMap: { [key: string]: { user_id: string; name: string; count: number } } = {};
    deliveries.forEach((d) => {
      const userId = d.user_id || d.recipient_name || "unknown";
      if (!userMap[userId]) {
        userMap[userId] = { user_id: userId, name: d.recipient_name, count: 0 };
      }
      userMap[userId].count += 1;
    });
    return Object.values(userMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [deliveries]);

  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      {user && <DashboardMenu />}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <ProfileHeader />
        
        {isAdmin && (
          <AdminStatsSection 
            deliveriesByMonth={deliveriesByMonth}
            topUsers={topUsers}
          />
        )}
        
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
