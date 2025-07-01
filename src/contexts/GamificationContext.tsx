
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import { getCurrentUser } from "@/services/userService";

interface GamificationContextProps {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  refreshAchievements: () => void;
  clearError: () => void;
}

const GamificationContext = createContext<GamificationContextProps | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { achievements, loading, error: achievementsError, refreshAchievements } = useAchievements();
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserError(null);
        const user = await getCurrentUser();
        setUserId(user?.id || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserError("Falha ao carregar dados do utilizador");
      }
    };
    fetchUser();
  }, []);

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
        clearError
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export { GamificationContext };
