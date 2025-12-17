import { supabase } from "@/integrations/supabase/client";

export type GamificationActionType = 
  | 'register'
  | 'first_blog_visit'
  | 'daily_login'
  | 'blog_visit'
  | 'content_view'
  | 'article_read'
  | 'like_given'
  | 'like_received'
  | 'comment_approved'
  | 'comment_reply'
  | 'share_external'
  | 'click_external'
  | 'conversion_new_user'
  | 'invite_accepted';

interface PointResult {
  success: boolean;
  points_added: number;
  new_total: number;
  message: string;
}

export const gamificationService = {
  /**
   * Registra um evento de pontuação.
   * A validação real acontece no banco de dados (RPC add_points).
   */
  async trackEvent(actionType: GamificationActionType, metadata: any = {}): Promise<PointResult | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('User not logged in, skipping gamification event');
        return null;
      }

      // Chama a função segura do banco de dados
      const { data, error } = await supabase
        .rpc('add_points', {
          p_user_id: user.id,
          p_action_type: actionType,
          p_metadata: metadata
        });

      if (error) {
        console.error('Error tracking gamification event:', error);
        return null;
      }

      const result = data as PointResult;
      
      if (result.success) {
        console.log(`Gamification: +${result.points_added} points for ${actionType}. Total: ${result.new_total}`);
      } else {
        // Silently fail for limits/anti-fraud (don't annoy user)
        console.debug(`Gamification skipped: ${result.message}`);
      }

      return result;
    } catch (e) {
      console.error('Unexpected error in gamification service:', e);
      return null;
    }
  },

  /**
   * Busca as estatísticas do usuário atual.
   */
  async getUserStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user stats:', error);
      return null;
    }

    return data;
  },

  /**
   * Helper para tracking de leitura (ex: chamar após 30s na página)
   */
  trackReadingTime(articleId: string) {
    // Implementação simples de timer
    const TIMER_DURATION = 60000; // 60 segundos para contar como leitura
    
    const timerId = setTimeout(() => {
      this.trackEvent('article_read', { article_id: articleId, duration_ms: TIMER_DURATION });
    }, TIMER_DURATION);

    return () => clearTimeout(timerId); // Retorna função de cleanup
  }
};
