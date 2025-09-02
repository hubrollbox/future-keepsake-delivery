import { createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface GamificationContextType {
  addPoints: (points: number, reason: string) => Promise<void>;
  checkAchievements: (currentPoints?: number) => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, refreshProfile } = useAuth();

  const checkAchievements = useCallback(async (currentPoints?: number) => {
    if (!user || !profile) return;

    try {
      // Fetch all achievements that are not yet unlocked by the user
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');

      if (achievementsError) throw achievementsError;

      // Check for new achievements based on points
      const pointsToCheck = currentPoints || profile.total_points || 0;
      
      for (const achievement of allAchievements || []) {
        if (pointsToCheck >= achievement.points) {
          // Check if user already has this achievement
          const { data: existingAchievement } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', user.id)
            .eq('achievement_id', achievement.id)
            .single();

          if (!existingAchievement) {
            // Award the achievement
            await supabase
              .from('user_achievements')
              .insert({
                user_id: user.id,
                achievement_id: achievement.id
              });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar conquistas:", error);
    }
  }, [user, profile]);

  const addPoints = useCallback(async (points: number, reason: string) => {
    if (!user || !profile) return;

    try {
      const newTotalPoints = (profile.total_points || 0) + points;

      // Update user's total points
      const { error } = await supabase
        .from('profiles')
        .update({ 
          total_points: newTotalPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .single();

      if (error) throw error;

      console.log(`Pontos adicionados: ${points} por ${reason}. Total: ${newTotalPoints}`);
      await refreshProfile(); // Refresh profile to get updated points
      await checkAchievements(newTotalPoints); // Check for new achievements after adding points
    } catch (error) {
      console.error("Erro ao adicionar pontos:", error);
    }
  }, [user, profile, refreshProfile, checkAchievements]);

  const value = {
    addPoints,
    checkAchievements,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};