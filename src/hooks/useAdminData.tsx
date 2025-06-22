
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchAdminStats } from "@/services/adminService";

export interface AdminStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  digitalMessages: number;
  warehouseItems: number;
  recentPayments: number;
}

export interface WarehouseItem {
  id: string;
  client_name: string;
  product_description: string;
  status: string;
  received_date: string;
  photo_url: string | null;
  delivery_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  stripe_payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  client_email: string;
  client_name: string | null;
  service_type: string | null;
  payment_date: string | null;
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const { deliveriesRes, digitalMsgRes, warehouseRes, paymentsRes } = await fetchAdminStats();
      const totalDeliveries = deliveriesRes.data?.length || 0;
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const pendingDeliveries = deliveriesRes.data?.filter(delivery => {
        const deliveryDate = new Date(delivery.delivery_date);
        return delivery.status === 'pendente' && deliveryDate >= now && deliveryDate <= nextWeek;
      }).length || 0;
      setStats({
        totalDeliveries,
        pendingDeliveries,
        digitalMessages: digitalMsgRes.data?.length || 0,
        warehouseItems: warehouseRes.data?.length || 0,
        recentPayments: paymentsRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas.",
        variant: "destructive",
      });
    }
    setLoading(false);
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
    loading,
    fetchStats,
    updateDeliveryStatus,
    updateWarehouseItemStatus,
  };
};
