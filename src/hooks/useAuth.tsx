import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  plan_type: string;
  total_points: number;
  level: number;
  created_at: string;
  updated_at: string;
  role: string | null;
}

import { useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  return useAuthContext();
}
      const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      // Combine profile with role information
      const profileWithRole = {
        ...profileData,
        role: adminRole?.role || 'user'
      };

      setProfile(profileWithRole);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao entrar",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
      });

      return { error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/login`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: 'user', // Default role for new users
          },
        },
      });

      if (error) {
        toast({
          title: "Erro ao registar",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Bem-vindo, Guardião!",
        description: "Verifica o teu email para confirmar o registo.",
      });

      return { error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Até breve!",
        description: "Sessão terminada com sucesso.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
