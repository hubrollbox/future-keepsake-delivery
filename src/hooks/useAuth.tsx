
import { useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};

export type { UserProfile } from "@/contexts/AuthContext";
