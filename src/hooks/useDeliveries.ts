
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Delivery {
  id: string;
  title: string;
  description: string | null;
  delivery_date: string;
  created_at: string;
  status: string;
  type: string;
  recipient_email: string | null;
  recipient_name: string | null;
  delivery_address: string | null;
  message: string | null;
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
      // Buscar keepsakes com dados dos recipients
      const { data, error } = await supabase
        .from("keepsakes")
        .select(`
          id,
          title,
          message,
          delivery_date,
          created_at,
          status,
          type,
          recipients (
            name,
            email,
            delivery_channel
          )
        `)
        .eq("user_id", user.id)
        .order("delivery_date", { ascending: true });

      if (error) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível carregar as cápsulas.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Mapear os dados para o formato esperado
      const mappedData = (data || []).map((keepsake: any) => ({
        id: keepsake.id,
        title: keepsake.title,
        description: keepsake.message,
        delivery_date: keepsake.delivery_date,
        created_at: keepsake.created_at,
        status: keepsake.status,
        type: keepsake.type,
        message: keepsake.message,
        recipient_name: keepsake.recipients?.[0]?.name || "Sem destinatário",
        recipient_email: keepsake.recipients?.[0]?.email || null,
        delivery_address: null, // Keepsakes não têm endereço de entrega físico
        user_id: user.id
      }));
      
      setDeliveries(mappedData);
    } catch (error: any) {
      console.error("Error fetching deliveries:", typeof error === "object" ? JSON.stringify(error, null, 2) : error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar as cápsulas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      const { error } = await supabase
        .from("keepsakes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cápsula eliminada com sucesso.",
      });

      fetchDeliveries();
    } catch (error) {
      console.error("Error deleting delivery:", typeof error === "object" ? JSON.stringify(error, null, 2) : error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a cápsula.",
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
