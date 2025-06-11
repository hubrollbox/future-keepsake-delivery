
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Delivery {
  id: string;
  user_id: string;
  title: string | null;
  delivery_type: string;
  delivery_date: string;
  delivery_address: string | null;
  delivery_method: string | null;
  scheduled_time: string | null;
  timezone: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  message: string | null;
  status: string | null;
  points_earned: number | null;
  created_at: string | null;
}

export interface CreateDeliveryData {
  title?: string;
  delivery_type: string;
  delivery_date: string;
  delivery_address?: string;
  delivery_method?: string;
  scheduled_time?: string;
  timezone?: string;
  recipient_name?: string;
  recipient_email?: string;
  message?: string;
  status?: string;
  points_earned?: number;
}

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDeliveries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching deliveries:", error);
        toast({
          title: "Erro",
          description: `Não foi possível carregar as entregas: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      setDeliveries(data || []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDelivery = async (deliveryData: CreateDeliveryData) => {
    if (!user) return { error: "User not authenticated" };

    // Garantir que os campos obrigatórios estão presentes
    if (!deliveryData.delivery_type || !deliveryData.delivery_date) {
      return { error: "Delivery type and delivery date are required" };
    }

    try {
      const { data, error } = await supabase
        .from("deliveries")
        .insert([
          {
            user_id: user.id,
            delivery_type: deliveryData.delivery_type,
            delivery_date: deliveryData.delivery_date,
            title: deliveryData.title || null,
            delivery_address: deliveryData.delivery_address || null,
            delivery_method: deliveryData.delivery_method || 'email',
            scheduled_time: deliveryData.scheduled_time || null,
            timezone: deliveryData.timezone || 'Europe/Lisbon',
            recipient_name: deliveryData.recipient_name || null,
            recipient_email: deliveryData.recipient_email || null,
            message: deliveryData.message || null,
            status: deliveryData.status || 'pendente',
            points_earned: deliveryData.points_earned || 0,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating delivery:", error);
        toast({
          title: "Erro",
          description: `Não foi possível criar a entrega: ${error.message}`,
          variant: "destructive",
        });
        return { error };
      }

      setDeliveries(prev => [data, ...prev]);
      toast({
        title: "Sucesso!",
        description: "Entrega criada com sucesso.",
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error creating delivery:", error);
      return { error };
    }
  };

  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating delivery:", error);
        toast({
          title: "Erro",
          description: `Não foi possível atualizar a entrega: ${error.message}`,
          variant: "destructive",
        });
        return { error };
      }

      setDeliveries(prev =>
        prev.map(delivery => (delivery.id === id ? data : delivery))
      );

      toast({
        title: "Sucesso!",
        description: "Entrega atualizada com sucesso.",
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error updating delivery:", error);
      return { error };
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      const { error } = await supabase
        .from("deliveries")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting delivery:", error);
        toast({
          title: "Erro",
          description: `Não foi possível eliminar a entrega: ${error.message}`,
          variant: "destructive",
        });
        return { error };
      }

      setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
      toast({
        title: "Sucesso!",
        description: "Entrega eliminada com sucesso.",
      });

      return { error: null };
    } catch (error) {
      console.error("Error deleting delivery:", error);
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchDeliveries();
    }
  }, [user]);

  return {
    deliveries,
    loading,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    refetch: fetchDeliveries,
  };
};
