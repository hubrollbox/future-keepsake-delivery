
import { useAuth } from "@/hooks/useAuth";

export const useAdmin = () => {
  const { isAdmin, loading } = useAuth();
  
  return { 
    isAdmin, 
    loading 
  };
};
