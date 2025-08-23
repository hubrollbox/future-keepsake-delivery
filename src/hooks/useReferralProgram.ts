import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ReferralData {
  id: string;
  referrer_id: string;
  referred_email: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'expired';
  bonus_keepsakes: number;
  created_at: string;
  completed_at?: string;
}

interface ReferralStats {
  total_referrals: number;
  completed_referrals: number;
  pending_referrals: number;
  total_bonus_keepsakes: number;
  referral_code: string;
}

export const useReferralProgram = () => {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Gerar código de referência único
  const generateReferralCode = (userId: string): string => {
    const prefix = 'FP';
    const userPart = userId.slice(0, 8).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${userPart}${randomPart}`;
  };

  // Buscar estatísticas de referência do usuário
  const fetchReferralStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Buscar referências do usuário
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      if (referralError) throw referralError;

      // Buscar ou criar código de referência do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      let referralCode = profileData?.referral_code;

      // Se não tem código, criar um
      if (!referralCode) {
        referralCode = generateReferralCode(user.id);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ referral_code: referralCode })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      // Calcular estatísticas
      const totalReferrals = referralData?.length || 0;
      const completedReferrals = referralData?.filter(r => r.status === 'completed').length || 0;
      const pendingReferrals = referralData?.filter(r => r.status === 'pending').length || 0;
      const totalBonusKeepsakes = referralData?.reduce((sum, r) => 
        r.status === 'completed' ? sum + r.bonus_keepsakes : sum, 0) || 0;

      setStats({
        total_referrals: totalReferrals,
        completed_referrals: completedReferrals,
        pending_referrals: pendingReferrals,
        total_bonus_keepsakes: totalBonusKeepsakes,
        referral_code: referralCode
      });

      setReferrals(referralData || []);

    } catch (error) {
      console.error('Erro ao buscar estatísticas de referência:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas de referência.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Enviar convite de referência
  const sendReferralInvite = async (email: string) => {
    if (!user || !stats) return false;

    try {
      // Verificar se o email já foi referenciado
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user.id)
        .eq('referred_email', email)
        .single();

      if (existingReferral) {
        toast({
          title: "Aviso",
          description: "Este email já foi convidado anteriormente.",
          variant: "destructive"
        });
        return false;
      }

      // Criar nova referência
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_email: email,
          referral_code: stats.referral_code,
          status: 'pending',
          bonus_keepsakes: 3
        });

      if (insertError) throw insertError;

      // Enviar email de convite (usando Edge Function)
      const { error: emailError } = await supabase.functions.invoke('send-referral-email', {
        body: {
          to: email,
          referrer_name: user.user_metadata?.full_name || 'Um amigo',
          referral_code: stats.referral_code,
          referral_link: `${window.location.origin}/register?ref=${stats.referral_code}`
        }
      });

      if (emailError) {
        console.error('Erro ao enviar email de convite:', emailError);
        // Não falhar se o email não for enviado
      }

      toast({
        title: "Convite Enviado!",
        description: `Convite enviado para ${email}. Você receberá 3 cápsulas grátis quando eles se registrarem!`,
      });

      // Atualizar estatísticas
      await fetchReferralStats();
      return true;

    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Copiar link de referência
  const copyReferralLink = async () => {
    if (!stats) return;

    const referralLink = `${window.location.origin}/register?ref=${stats.referral_code}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link Copiado!",
        description: "Link de referência copiado para a área de transferência.",
      });
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link Copiado!",
        description: "Link de referência copiado para a área de transferência.",
      });
    }
  };

  // Processar referência quando novo usuário se registra
  const processReferral = async (referralCode: string, newUserId: string) => {
    try {
      // Buscar referência pendente
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .eq('status', 'pending')
        .single();

      if (referralError || !referralData) {
        console.log('Código de referência não encontrado ou já usado');
        return false;
      }

      // Marcar referência como completa
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          referred_user_id: newUserId
        })
        .eq('id', referralData.id);

      if (updateError) throw updateError;

      // Adicionar cápsulas bônus ao referenciador
      const { error: bonusError } = await supabase.rpc('add_bonus_keepsakes', {
        user_id: referralData.referrer_id,
        bonus_amount: referralData.bonus_keepsakes
      });

      if (bonusError) {
        console.error('Erro ao adicionar cápsulas bônus:', bonusError);
      }

      return true;

    } catch (error) {
      console.error('Erro ao processar referência:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchReferralStats();
    }
  }, [user, fetchReferralStats]);

  return {
    referrals,
    stats,
    loading,
    sendReferralInvite,
    copyReferralLink,
    processReferral,
    refetch: fetchReferralStats
  };
};