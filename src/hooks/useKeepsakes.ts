import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Keepsake {
  id: string;
  title: string;
  delivery_date: string;
  status: KeepsakeStatus;
  type: string;
  message_content: string;
  recipient_email?: string;
  recipient_phone?: string;
  sent_at?: string;
}

export type KeepsakeStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'scheduled';

export const useKeepsakes = () => {
  const [keepsakes, setKeepsakes] = useState<Keepsake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchKeepsakes = useCallback(async () => {
    // Se não há usuário autenticado, não tenta buscar
    if (!user) {
      setKeepsakes([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, message_content, recipient_email, recipient_phone, sent_at')
        .eq('user_id', user.id)
        .order('delivery_date', { ascending: false });

      if (error) {
        // Log detalhado do erro para debugging
        console.error('Erro detalhado ao buscar keepsakes:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId: user?.id
        });
        
        // Se for erro de RLS (não autorizado), não mostra toast de erro
        if (error.code === 'PGRST301' || error.message?.includes('RLS') || error.code === '42501') {
          console.log('Usuário não tem acesso às keepsakes (RLS)');
          setKeepsakes([]);
          return;
        }
        throw error;
      }
      setKeepsakes(data || []);
    } catch (e) {
      console.error('Erro ao carregar keepsakes:', e);
      // Só mostra toast de erro se há usuário autenticado
      if (user) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas cápsulas do tempo.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  // Função para buscar keepsakes com paginação e filtro por status
  const fetchKeepsakesPaginated = async (start = 0, limit = 10, statusFilter?: KeepsakeStatus) => {
    // Se não há usuário autenticado, retorna array vazio sem mostrar erro
    if (!user) {
      return [];
    }

    try {
      let query = supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, message_content, recipient_email, recipient_phone, sent_at')
        .eq('user_id', user.id)
        .order('delivery_date', { ascending: false });

      // Aplicar filtro de status se fornecido
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.range(start, start + limit - 1);

      if (error) {
        // Log detalhado do erro para debugging
        console.error('Erro detalhado ao buscar keepsakes paginados:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId: user?.id,
          statusFilter,
          start,
          limit
        });
        
        // Se for erro de RLS (não autorizado), não mostra toast de erro
        if (error.code === 'PGRST301' || error.message?.includes('RLS') || error.code === '42501') {
          console.log('Usuário não tem acesso às keepsakes (RLS)');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (e) {
      console.error('Erro ao carregar keepsakes paginados:', e);
      // Só mostra toast de erro se não for problema de autenticação
      if (user) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas cápsulas do tempo.",
          variant: "destructive"
        });
      }
      return [];
    }
  };

  // Função para buscar keepsakes por status específico
  const fetchKeepsakesByStatus = async (status: KeepsakeStatus) => {
    // Se não há usuário autenticado, retorna array vazio
    if (!user) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('keepsakes')
        .select('id, title, delivery_date, status, type, message_content, recipient_email, recipient_phone, sent_at')
        .eq('user_id', user.id)
        .eq('status', status)
        .order('delivery_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('Erro ao carregar keepsakes por status:', e);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas cápsulas do tempo.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Função para atualizar um keepsake
  const updateKeepsake = async (id: string, updates: Partial<Keepsake>) => {
    // Se não há usuário autenticado, não permite atualização
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar uma cápsula do tempo.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const dbUpdates: Record<string, unknown> = { ...updates };
      // No need for field mapping since we're using message_content directly
      const { error } = await supabase
        .from('keepsakes')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Cápsula do tempo atualizada com sucesso.",
      });
      
      // Recarregar a lista após atualização
      await fetchKeepsakes();
      return true;
    } catch (e: any) {
      console.error('Erro detalhado ao atualizar keepsake:', {
        error: e,
        code: e?.code,
        message: e?.message,
        keepsakeId: id,
        userId: user?.id,
        updates
      });
      
      let errorMessage = "Não foi possível atualizar a cápsula do tempo.";
      
      if (e?.code === 'PGRST116') {
        errorMessage = "Cápsula do tempo não encontrada ou você não tem permissão para editá-la.";
      } else if (e?.code === '42501' || e?.message?.includes('RLS')) {
        errorMessage = "Você não tem permissão para editar esta cápsula do tempo.";
      } else if (e?.message?.includes('network')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // Função para deletar um keepsake
  const deleteKeepsake = async (id: string) => {
    // Se não há usuário autenticado, não permite exclusão
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para excluir uma cápsula do tempo.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('keepsakes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Cápsula do tempo excluída com sucesso.",
      });
      
      // Recarregar a lista após exclusão
      await fetchKeepsakes();
      return true;
    } catch (e: any) {
      console.error('Erro detalhado ao excluir keepsake:', {
        error: e,
        code: e?.code,
        message: e?.message,
        keepsakeId: id,
        userId: user?.id
      });
      
      let errorMessage = "Não foi possível excluir a cápsula do tempo.";
      
      if (e?.code === 'PGRST116') {
        errorMessage = "Cápsula do tempo não encontrada ou você não tem permissão para excluí-la.";
      } else if (e?.code === '42501' || e?.message?.includes('RLS')) {
        errorMessage = "Você não tem permissão para excluir esta cápsula do tempo.";
      } else if (e?.message?.includes('network')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (e?.code === '23503') {
        errorMessage = "Não é possível excluir esta cápsula pois ela possui dependências.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchKeepsakes();
  }, [fetchKeepsakes]);

  return { 
    keepsakes, 
    loading, 
    refetch: fetchKeepsakes,
    fetchKeepsakesPaginated,
    fetchKeepsakesByStatus,
    updateKeepsake,
    deleteKeepsake
  };
};
