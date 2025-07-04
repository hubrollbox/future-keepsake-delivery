
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "../components/ui/use-toast";

export interface AdminStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  digitalMessages: number;
  warehouseItems: number;
  recentPayments: number;
}

export interface DeliveriesByMonth {
  month: string;
  count: number;
}

export interface TopUser {
  user_id: string;
  name: string;
  count: number;
}

export interface WarehouseItem {
  id: string;
  client_name: string;
  product_description: string;
  status: string;
  received_date: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  user_id: string;
  service_type: string | null;
  created_at: string;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    digitalMessages: 0,
    warehouseItems: 0,
    recentPayments: 0,
  });
  
  const [deliveriesByMonth, setDeliveriesByMonth] = useState<DeliveriesByMonth[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total deliveries
      const { data: deliveries, error: deliveriesError } = await supabase
        .from("deliveries")
        .select("id, delivery_date, status, created_at");
      
      if (deliveriesError) throw deliveriesError;

      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("id");
      
      if (messagesError) throw messagesError;

      // Fetch warehouse items
      const { data: warehouseItems, error: warehouseError } = await supabase
        .from("warehouse_items")
        .select("id");
      
      if (warehouseError) throw warehouseError;

      // Fetch recent payments (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select("id")
        .gte("created_at", sevenDaysAgo.toISOString());
      
      if (paymentsError) throw paymentsError;

      // Calculate pending deliveries (next 7 days)
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const pendingDeliveries = deliveries?.filter(delivery => {
        const deliveryDate = new Date(delivery.delivery_date);
        return delivery.status === 'scheduled' && deliveryDate >= now && deliveryDate <= nextWeek;
      }).length || 0;

      // Process deliveries by month
      const monthlyData: { [key: string]: number } = {};
      deliveries?.forEach(delivery => {
        const date = new Date(delivery.created_at);
        const monthKey = date.toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      });

      const deliveriesByMonthData = Object.entries(monthlyData)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(`01 ${a.month}`).getTime() - new Date(`01 ${b.month}`).getTime())
        .slice(-6); // Last 6 months

      // Get top users by delivery count
      const userDeliveryCount: { [key: string]: number } = {};
      deliveries?.forEach(delivery => {
        userDeliveryCount[delivery.user_id] = (userDeliveryCount[delivery.user_id] || 0) + 1;
      });

      // Get user profiles for top users
      const topUserIds = Object.entries(userDeliveryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([userId]) => userId);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", topUserIds);

      const topUsersData = topUserIds.map(userId => ({
        user_id: userId,
        name: profiles?.find(p => p.id === userId)?.full_name || "Utilizador Anónimo",
        count: userDeliveryCount[userId]
      }));

      setStats({
        totalDeliveries: deliveries?.length || 0,
        pendingDeliveries,
        digitalMessages: messages?.length || 0,
        warehouseItems: warehouseItems?.length || 0,
        recentPayments: payments?.length || 0,
      });

      setDeliveriesByMonth(deliveriesByMonthData);
      setTopUsers(topUsersData);

    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("deliveries")
        .update({ status })
        .eq("id", deliveryId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Estado da entrega atualizado com sucesso.",
      });

      fetchStats();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o estado da entrega.",
        variant: "destructive",
      });
    }
  };

  const updateWarehouseItemStatus = async (itemId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("warehouse_items")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Estado do item atualizado com sucesso.",
      });

      fetchStats();
    } catch (error) {
      console.error("Error updating warehouse item status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o estado do item.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    deliveriesByMonth,
    topUsers,
    loading,
    fetchStats,
    updateDeliveryStatus,
    updateWarehouseItemStatus,
  };
};
