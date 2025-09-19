import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface AIQuotaData {
  used: number;
  limit: number;
  remaining: number;
  tier: 'free' | 'premium' | 'family';
  canUseAI: boolean;
  resetDate: string;
}

const QUOTA_LIMITS = {
  free: 3,
  premium: 50,
  family: 100
} as const;

export function useAIQuota() {
  const { user } = useAuth();
  const [quota, setQuota] = useState<AIQuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const userId = user.id as string;
    if (!userId) {
      setError('User ID not available');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Buscar dados do perfil do usuário com informações do plano
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            plan_type,
            status,
            current_period_end
          )
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Determinar o tier baseado no plano
      let tier: 'free' | 'premium' | 'family' = 'free';
      if (profile?.subscriptions && Array.isArray(profile.subscriptions) && profile.subscriptions.length > 0) {
        const subscription = profile.subscriptions[0];
        if (subscription.plan_type === 'premium') {
          tier = 'premium';
        } else if (subscription.plan_type === 'family') {
          tier = 'family';
        }
      }

      const limit = QUOTA_LIMITS[tier];
      const today = new Date().toISOString().split('T')[0];

      // Buscar uso atual da API
      const { data: usage, error: usageError } = await supabase
        .from('api_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      // Se não há registro para hoje, criar um
      let currentUsage = 0;
      if (usageError && usageError.code === 'PGRST116') {
        // Registro não existe, criar um novo
        const { data: newUsage, error: createError } = await supabase
          .from('api_usage')
          .insert({
            user_id: userId,
            date: today,
            huggingface_requests: 0
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        currentUsage = newUsage?.huggingface_requests || 0;
      } else if (usageError) {
        throw usageError;
      } else {
        currentUsage = usage?.huggingface_requests || 0;
      }

      const quotaData: AIQuotaData = {
        used: currentUsage,
        limit,
        remaining: Math.max(0, limit - currentUsage),
        tier,
        canUseAI: currentUsage < limit,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] || ''
      };

      setQuota(quotaData);
    } catch (err) {
      console.error('Error fetching AI quota:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quota');
      toast.error('Erro ao carregar cota de IA');
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async () => {
    if (!user?.id || !quota) {
      throw new Error('User not authenticated or quota not loaded');
    }

    const userId = user.id; // user.id is guaranteed to be string here

    try {
      const today = new Date().toISOString().split('T')[0];
      const newUsage = quota.used + 1;

      const { error } = await supabase
        .from('api_usage')
        .upsert({
          user_id: userId,
          date: today,
          huggingface_requests: newUsage
        });

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setQuota(prev => prev ? {
        ...prev,
        used: newUsage,
        remaining: Math.max(0, prev.limit - newUsage),
        canUseAI: newUsage < prev.limit
      } : null);

    } catch (err) {
      console.error('Error incrementing usage:', err);
      throw err;
    }
  };

  const getQuotaStatus = () => {
    if (!quota) return null;

    const percentage = (quota.used / quota.limit) * 100;
    
    if (percentage >= 100) {
      return {
        status: 'exceeded' as const,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        message: 'Limite diário atingido'
      };
    } else if (percentage >= 80) {
      return {
        status: 'warning' as const,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        message: 'Próximo do limite'
      };
    } else {
      return {
        status: 'normal' as const,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        message: 'Dentro do limite'
      };
    }
  };

  const getUpgradeMessage = () => {
    if (!quota) return null;

    switch (quota.tier) {
      case 'free':
        return {
          title: 'Upgrade para Premium',
          description: 'Tenha 50 sugestões de IA por dia',
          benefits: ['50 sugestões diárias', 'Suporte prioritário', 'Recursos avançados']
        };
      case 'premium':
        return {
          title: 'Upgrade para Family',
          description: 'Tenha 100 sugestões de IA por dia',
          benefits: ['100 sugestões diárias', 'Compartilhamento familiar', 'Recursos premium']
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchQuota();
  }, [user]);

  // Recarregar quota a cada hora para capturar resets
  useEffect(() => {
    const interval = setInterval(fetchQuota, 60 * 60 * 1000); // 1 hora
    return () => clearInterval(interval);
  }, [user]);

  return {
    quota,
    loading,
    error,
    fetchQuota,
    incrementUsage,
    getQuotaStatus,
    getUpgradeMessage,
    canUseAI: quota?.canUseAI ?? false
  };
}