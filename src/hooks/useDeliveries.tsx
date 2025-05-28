
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
          description: "Não foi possível carregar as entregas.",
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

  const createDelivery = async (deliveryData: Partial<Delivery>) => {
    if (!user) return { error: "User not authenticated" };

    try {
      const { data, error } = await supabase
        .from("deliveries")
        .insert([
          {
            ...deliveryData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating delivery:", error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a entrega.",
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
          description: "Não foi possível atualizar a entrega.",
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
          description: "Não foi possível eliminar a entrega.",
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
