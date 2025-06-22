import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any } | { error: null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any } | { error: null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        if (error && typeof error === "object" && "name" in error && error.name === "AuthSessionMissingError") {
          toast({ title: "Sessão ausente", description: "Por favor, faça login novamente.", variant: "destructive" });
          setSession(null);
          setUser(null);
          setProfile(null);
        } else {
          console.error("Error getting session:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (profileError) {
        console.error("Error fetching profile:", typeof profileError === "object" ? JSON.stringify(profileError, null, 2) : profileError);
        return;
      }
      const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", userId)
        .single();
      const profileWithRole = {
        ...profileData,
        role: adminRole?.role || 'user'
      };
      setProfile(profileWithRole);
    } catch (error) {
      console.error("Error fetching user profile:", typeof error === "object" ? JSON.stringify(error, null, 2) : error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
        return { error };
      }
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
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
          data: { full_name: fullName, role: 'user' },
        },
      });
      if (error) {
        toast({ title: "Erro ao registar", description: error.message, variant: "destructive" });
        return { error };
      }
      toast({ title: "Bem-vindo, Guardião!", description: "Verifica o teu email para confirmar o registo." });
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
        toast({ title: "Erro ao sair", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Até breve!", description: "Sessão terminada com sucesso." });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};