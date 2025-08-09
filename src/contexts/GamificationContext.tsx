
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import { getCurrentUser } from "@/services/userService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface GamificationContextProps {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  refreshAchievements: () => void;
  clearError: () => void;
  addPoints: (points: number, reason: string) => Promise<void>;
  checkAchievements: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextProps | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile, refreshProfile } = useAuth();
  const { achievements, loading, error: achievementsError, refreshAchievements } = useAchievements();
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserError(null);
        // User is already fetched by useAuth, so we can rely on it
        if (!user) return;
        // No need to set userId state here, useAuth provides it
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserError("Falha ao carregar dados do utilizador");
      }
    };
    fetchUser();
  }, [user]);

  const addPoints = useCallback(async (points: number, reason: string) => {
    if (!user || !profile) return;

    try {
      const newTotalPoints = (profile.total_points || 0) + points;

      const { data, error } = await supabase
        .from('profiles')
        .update({ total_points: newTotalPoints })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      console.log(`Pontos adicionados: ${points} por ${reason}. Total: ${newTotalPoints}`);
      await refreshProfile(); // Refresh profile to get updated points
      await checkAchievements(); // Check for new achievements after adding points
    } catch (error) {
      console.error("Erro ao adicionar pontos:", error);
    }
  }, [user, profile, refreshProfile]);

  const checkAchievements = useCallback(async () => {
    if (!user || !profile) return;

    try {
      // Fetch all achievements that are not yet unlocked by the user
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');

      if (achievementsError) throw achievementsError;

      const { data: userUnlockedAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (userAchievementsError) throw userAchievementsError;

      const unlockedIds = new Set(userUnlockedAchievements.map(ua => ua.achievement_id));

      const achievementsToUnlock = allAchievements.filter(achievement =>
        !unlockedIds.has(achievement.id) && (profile.total_points || 0) >= achievement.points
      );

      if (achievementsToUnlock.length > 0) {
        const newUnlockedEntries = achievementsToUnlock.map(achievement => ({
          user_id: user.id,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString(),
        }));

        const { error: insertError } = await supabase
          .from('user_achievements')
          .insert(newUnlockedEntries);

        if (insertError) throw insertError;

        console.log(`Conquistas desbloqueadas: ${achievementsToUnlock.map(a => a.title).join(', ')}`);
        refreshAchievements(); // Refresh achievements context
      }
    } catch (error) {
      console.error("Erro ao verificar conquistas:", error);
    }
  }, [user, profile, refreshAchievements]);

  useEffect(() => {
    // Initial check when user and profile are loaded
    if (user && profile) {
      checkAchievements();
    }
  }, [user, profile, checkAchievements]);

  const clearError = () => {
    setUserError(null);
  };

  const combinedError = achievementsError || userError;

  return (
    <GamificationContext.Provider 
      value={{
        achievements,
        loading,
        error: combinedError,
        refreshAchievements,
        clearError,
        addPoints,
        checkAchievements
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export { GamificationContext };
