
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  role?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 [AuthContext] Fetching profile for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('DEBUG: profileData', profileData);
      console.log('DEBUG: profileError', JSON.stringify(profileError, null, 2));

      if (profileError) {
        if (profileError.code === 'PGRST116') { // PGRST116 means no rows found
          console.warn('⚠️ [AuthContext] Profile not found for user:', userId, profileError.message);
          setProfile(null);
          setIsAdmin(false);
          return; // Exit early as no profile to process
        } else {
          console.error('❌ [AuthContext] Error fetching profile:', profileError.message, JSON.stringify(profileError, null, 2));
          throw profileError;
        }
      }

      console.log('📊 [AuthContext] Profile data received:', profileData);

      // If profileData is null, it means no profile was found or an error occurred that was handled above.
      // In this case, we should not proceed with fetching admin roles.
      if (!profileData) {
        setProfile(null);
        setIsAdmin(false);
        return;
      }

      // Check admin status
      const { data: adminData, error: adminError } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (adminError && adminError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for non-admins
        console.warn('⚠️ [AuthContext] Warning fetching admin role:', adminError.message, adminError);
      }

      console.log('👑 [AuthContext] Admin data received:', adminData);

      const userProfile = {
        ...profileData,
        role: adminData?.role || null
      };

      console.log('✅ [AuthContext] Final profile set:', userProfile);
      setProfile(userProfile);
      setIsAdmin(adminData?.role === 'admin');
    } catch (error) {
      console.error('❌ [AuthContext] Error in fetchProfile:', JSON.stringify(error, null, 2));
      setProfile(null);
      setIsAdmin(false);
    }
    return; // Explicit return to avoid 'control reached end of function without RETURN' warning
  };

  const refreshProfile = async () => {
    if (user?.id) {
      console.log('🔄 [AuthContext] Refreshing profile for user:', user.id);
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log('🚀 [AuthContext] AuthProvider initializing...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔐 [AuthContext] Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('👤 [AuthContext] User found, fetching profile...');
          // Use setTimeout to avoid blocking the auth callback
          // Adiciona um pequeno atraso para dar tempo ao trigger de criar o perfil
          setTimeout(() => {
            if (currentSession.user?.id) {
              console.log('⏳ [AuthContext] Attempting to fetch profile after delay for user:', currentSession.user.id);
              fetchProfile(currentSession.user.id);
            } else {
              console.warn('⚠️ [AuthContext] User ID not available after delay, cannot fetch profile.');
            }
          }, 1000); // Atraso de 1 segundo
        } else {
          console.log('👤 [AuthContext] No user, clearing profile...');
          setProfile(null);
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log('🔍 [AuthContext] Checking existing session:', existingSession?.user?.id);
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        console.log('👤 [AuthContext] Existing user found, fetching profile...');
        if (existingSession.user?.id) {
          console.log('⏳ [AuthContext] Attempting to fetch profile for existing session user:', existingSession.user.id);
          fetchProfile(existingSession.user.id);
        } else {
          console.warn('⚠️ [AuthContext] Existing session user ID not available, cannot fetch profile.');
        }
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🧹 [AuthContext] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email || !password) {
        return { error: { message: 'Email e palavra-passe são obrigatórios' } };
      }

      if (!email.includes('@')) {
        return { error: { message: 'Por favor, introduza um email válido' } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });


      if (error) {
        let errorMessage = 'Erro ao fazer login';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciais inválidas. Verifique o seu email e palavra-passe.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme o seu email antes de fazer login.';
        }
        
        toast({
          title: 'Erro de Login',
          description: errorMessage,
          variant: 'destructive'
        });
      }

      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email || !password) {
        return { error: { message: 'Email e palavra-passe são obrigatórios' } };
      }

      if (!email.includes('@')) {
        return { error: { message: 'Por favor, introduza um email válido' } };
      }

      if (password.length < 6) {
        return { error: { message: 'A palavra-passe deve ter pelo menos 6 caracteres' } };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName?.trim() || '',
            phone: phone || ''
          }
        }
      });

      if (error) {
        let errorMessage = 'Erro ao criar conta';
        if (error.message.includes('User already registered')) {
          errorMessage = 'Já existe uma conta com este email.';
        }
        
        toast({
          title: 'Erro de Registo',
          description: errorMessage,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Conta Criada',
          description: 'Verifique o seu email para confirmar a sua conta.',
        });
      }

      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      

      if (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao fazer logout',
          variant: 'destructive'
        });
      } else {
        // Clear all state
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsAdmin(false);
        
        toast({
          title: 'Logout',
          description: 'Logout efetuado com sucesso',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
