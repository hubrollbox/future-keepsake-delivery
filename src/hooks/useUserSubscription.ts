import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PlanLimits {
  ai_quota_daily: number;
  keepsakes_monthly: number;
  max_message_length: number;
  media_attachments: boolean;
  delivery_methods: string[];
  backup_enabled: boolean;
  family_accounts?: number;
  collaborative_keepsakes?: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan_type: 'free' | 'premium' | 'family';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  paid_at: string | null;
  created_at: string;
}

interface UseUserSubscriptionReturn {
  subscription: UserSubscription | null;
  planLimits: PlanLimits | null;
  paymentHistory: PaymentHistory[];
  loading: boolean;
  error: string | null;
  
  // Funções de verificação
  canUseFeature: (feature: keyof PlanLimits) => boolean;
  hasActiveSubscription: () => boolean;
  isSubscriptionExpired: () => boolean;
  getDaysUntilExpiry: () => number | null;
  
  // Funções de ação
  refreshSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<boolean>;
  createStripeCustomer: () => Promise<string | null>;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    ai_quota_daily: 3,
    keepsakes_monthly: 3,
    max_message_length: 500,
    media_attachments: false,
    delivery_methods: ['email'],
    backup_enabled: false
  },
  premium: {
    ai_quota_daily: 50,
    keepsakes_monthly: -1, // ilimitado
    max_message_length: -1, // ilimitado
    media_attachments: true,
    delivery_methods: ['email', 'sms', 'whatsapp'],
    backup_enabled: true
  },
  family: {
    ai_quota_daily: 100,
    keepsakes_monthly: -1, // ilimitado
    max_message_length: -1, // ilimitado
    media_attachments: true,
    delivery_methods: ['email', 'sms', 'whatsapp'],
    backup_enabled: true,
    family_accounts: 6,
    collaborative_keepsakes: true
  }
} as const;

export function useUserSubscription(): UseUserSubscriptionReturn {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados da assinatura
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setPlanLimits(PLAN_LIMITS.free);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar assinatura do usuário
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      // Se não tem assinatura, criar uma gratuita
      if (!subscriptionData) {
        const { data: newSubscription, error: createError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_type: 'free',
            status: 'active'
          })
          .select()
          .single();

        if (createError) throw createError;
        
        setSubscription(newSubscription);
        setPlanLimits(PLAN_LIMITS.free);
      } else {
        setSubscription(subscriptionData);
        setPlanLimits(PLAN_LIMITS[subscriptionData.plan_type] || PLAN_LIMITS.free);
      }

      // Buscar histórico de pagamentos
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (paymentsError) throw paymentsError;
      
      setPaymentHistory(paymentsData || []);

    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar assinatura');
      // Em caso de erro, definir como plano gratuito
      setPlanLimits(PLAN_LIMITS.free);
    } finally {
      setLoading(false);
    }
  };

  // Verificar se pode usar uma funcionalidade
  const canUseFeature = (feature: keyof PlanLimits): boolean => {
    if (!planLimits) return false;
    
    const featureValue = planLimits[feature];
    
    // Para valores booleanos
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    
    // Para arrays (delivery_methods)
    if (Array.isArray(featureValue)) {
      return featureValue.length > 0;
    }
    
    // Para números (-1 significa ilimitado)
    if (typeof featureValue === 'number') {
      return featureValue !== 0;
    }
    
    return false;
  };

  // Verificar se tem assinatura ativa
  const hasActiveSubscription = (): boolean => {
    if (!subscription) return false;
    return subscription.status === 'active' && subscription.plan_type !== 'free';
  };

  // Verificar se a assinatura expirou
  const isSubscriptionExpired = (): boolean => {
    if (!subscription || !subscription.current_period_end) return false;
    return new Date(subscription.current_period_end) < new Date();
  };

  // Obter dias até expirar
  const getDaysUntilExpiry = (): number | null => {
    if (!subscription || !subscription.current_period_end) return null;
    
    const expiryDate = new Date(subscription.current_period_end);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Atualizar dados da assinatura
  const refreshSubscription = async (): Promise<void> => {
    await fetchSubscription();
  };

  // Cancelar assinatura
  const cancelSubscription = async (): Promise<boolean> => {
    if (!subscription || !subscription.stripe_subscription_id) {
      toast.error('Nenhuma assinatura ativa encontrada');
      return false;
    }

    try {
      // Chamar Edge Function para cancelar no Stripe
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: {
          subscription_id: subscription.stripe_subscription_id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Assinatura cancelada com sucesso');
        await refreshSubscription();
        return true;
      } else {
        throw new Error(data.error || 'Erro ao cancelar assinatura');
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      toast.error('Erro ao cancelar assinatura');
      return false;
    }
  };

  // Criar customer no Stripe
  const createStripeCustomer = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-customer', {
        body: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email
        }
      });

      if (error) throw error;

      if (data.customer_id) {
        // Atualizar perfil com customer_id
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: data.customer_id })
          .eq('id', user.id);

        return data.customer_id;
      }

      return null;
    } catch (err) {
      console.error('Error creating Stripe customer:', err);
      return null;
    }
  };

  // Efeito para carregar dados quando usuário muda
  useEffect(() => {
    fetchSubscription();
  }, [user]);

  // Efeito para verificar expiração periodicamente
  useEffect(() => {
    if (!subscription) return;

    const checkExpiry = () => {
      if (isSubscriptionExpired()) {
        toast.warning('Sua assinatura expirou. Renove para continuar usando os recursos premium.');
        refreshSubscription();
      }
    };

    // Verificar a cada hora
    const interval = setInterval(checkExpiry, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [subscription]);

  return {
    subscription,
    planLimits,
    paymentHistory,
    loading,
    error,
    canUseFeature,
    hasActiveSubscription,
    isSubscriptionExpired,
    getDaysUntilExpiry,
    refreshSubscription,
    cancelSubscription,
    createStripeCustomer
  };
}