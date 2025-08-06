
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WarehouseItem {
  id: string;
  client_name: string;
  product_description: string;
  received_date: string;
  photo_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
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

interface AdminStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  digitalMessages: number;
  warehouseItems: number;
  recentPayments: number;
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
      // Fetch total deliveries
      const { count: totalDeliveries } = await supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true });

      // Fetch pending deliveries (next 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      const { count: pendingDeliveries } = await supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled")
        .lte("delivery_date", sevenDaysFromNow.toISOString());

      // Fetch digital messages (deliveries with type digital)
      const { count: digitalMessages } = await supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true })
        .eq("type", "digital");

      // Fetch warehouse items
      const { count: warehouseItems } = await supabase
        .from("warehouse_items")
        .select("*", { count: "exact", head: true });

      // Fetch recent payments (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentPayments } = await supabase
        .from("payments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      // Fetch deliveries for monthly chart
      const { data: deliveries } = await supabase
        .from("deliveries")
        .select("created_at")
        .order("created_at", { ascending: false });

      // Group deliveries by month
      const monthlyData: { [key: string]: number } = {};
      deliveries?.forEach(delivery => {
        const date = new Date(delivery.created_at);
        const monthKey = date.toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      });

      const deliveriesMonthly = Object.entries(monthlyData)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(`01 ${a.month}`).getTime() - new Date(`01 ${b.month}`).getTime())
        .slice(-6);

      // Fetch top users
      const { data: allDeliveries } = await supabase
        .from("deliveries")
        .select("user_id");

      const userDeliveryCount: { [key: string]: number } = {};
      allDeliveries?.forEach(delivery => {
        userDeliveryCount[delivery.user_id] = (userDeliveryCount[delivery.user_id] || 0) + 1;
      });

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
        totalDeliveries: totalDeliveries || 0,
        pendingDeliveries: pendingDeliveries || 0,
        digitalMessages: digitalMessages || 0,
        warehouseItems: warehouseItems || 0,
        recentPayments: recentPayments || 0,
      });

      setDeliveriesByMonth(deliveriesMonthly);
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
        .update({ status })
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Estado do item atualizado com sucesso.",
      });
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
    updateDeliveryStatus,
    updateWarehouseItemStatus,
    refetchStats: fetchStats,
  };
};
