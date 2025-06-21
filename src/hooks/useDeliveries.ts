
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Delivery {
  id: string;
  title: string;
  description: string | null;
  delivery_date: string;
  status: string;
  type: string;
  recipient_email: string | null;
  recipient_name: string | null;
  delivery_address: string | null;
  message: string | null;
  created_at: string;
  user_id: string;
}

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDeliveries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .eq("user_id", user.id)
        .order("delivery_date", { ascending: true });

      if (error) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível carregar as entregas.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      // Map the data to include missing fields as null if they don't exist
      const mappedData = (data || []).map((delivery: any) => ({
        ...delivery,
        recipient_name: delivery.recipient_name || null,
        delivery_address: delivery.delivery_address || null,
        message: delivery.message || null,
      }));
      setDeliveries(mappedData);
    } catch (error: any) {
      console.error("Error fetching deliveries:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as entregas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      const { error } = await supabase
        .from("deliveries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Entrega eliminada com sucesso.",
      });

      fetchDeliveries();
    } catch (error) {
      console.error("Error deleting delivery:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a entrega.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [user]);

  return {
    deliveries,
    loading,
    deleteDelivery,
    refetch: fetchDeliveries,
  };
};
