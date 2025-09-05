
import React from 'react';
import { useAuthContext } from "@/contexts/useAuthContext";

export const useAuth = () => {
  return useAuthContext();
};

export type { UserProfile } from "@/contexts/useAuthContext";
