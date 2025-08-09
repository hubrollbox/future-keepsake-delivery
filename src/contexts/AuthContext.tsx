
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
  plan_id: string | null;
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
      console.log('🔍 [AuthContext] fetchProfile: Starting for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('DEBUG: profileData', profileData);
      console.log('DEBUG: profileError', JSON.stringify(profileError, null, 2));

      if (profileError) {
        console.error('❌ [AuthContext] Error fetching profile:', profileError.message, JSON.stringify(profileError, null, 2));
        // Tentar fallback para dados básicos do auth.user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const fallbackProfile: UserProfile = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Utilizador',
            email: authUser.email || null,
            avatar_url: authUser.user_metadata?.avatar_url || null,
            plan_type: 'free',
            total_points: 0,
            level: 1,
            created_at: authUser.created_at,
            updated_at: authUser.last_sign_in_at || authUser.created_at,
            plan_id: null,
            role: null
          };
          setProfile(fallbackProfile);
          setIsAdmin(false);
          return;
        } else {
          setProfile(null);
          setIsAdmin(false);
          return; // Exit early as no profile to process
        }
      }

      console.log('📊 [AuthContext] fetchProfile: Profile data received:', profileData);

      // If profileData is null, it means no profile was found or an error occurred that was handled above.
      // In this case, we should create a fallback profile.
      if (!profileData) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const fallbackProfile: UserProfile = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Utilizador',
            email: authUser.email || null,
            avatar_url: authUser.user_metadata?.avatar_url || null,
            plan_type: 'free',
            total_points: 0,
            level: 1,
            created_at: authUser.created_at,
            updated_at: authUser.last_sign_in_at || authUser.created_at,
            plan_id: null,
            role: null
          };
          setProfile(fallbackProfile);
          setIsAdmin(false);
          return;
        } else {
          setProfile(null);
          setIsAdmin(false);
          return;
        }
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

      console.log('👑 [AuthContext] fetchProfile: Admin data received:', adminData);

      const userProfile = {
        ...profileData,
        plan_type: 'free', // Default if not in schema
        role: adminData?.role || null
      };

      console.log('✅ [AuthContext] fetchProfile: Final profile set:', userProfile);
      setProfile(userProfile);
      setIsAdmin(adminData?.role === 'admin');
    } catch (error) {
      console.error('❌ [AuthContext] Error in fetchProfile:', JSON.stringify(error, null, 2));
      
      // Create fallback profile even on error to avoid infinite loading
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const fallbackProfile: UserProfile = {
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Utilizador',
          email: authUser.email || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          plan_type: 'free',
          total_points: 0,
          level: 1,
          created_at: authUser.created_at,
          updated_at: authUser.last_sign_in_at || authUser.created_at,
          plan_id: null,
          role: null
        };
        setProfile(fallbackProfile);
      } else {
        setProfile(null);
      }
      setIsAdmin(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      console.log('🔄 [AuthContext] refreshProfile: Starting for user:', user.id);
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log('🚀 [AuthContext] AuthProvider: Initializing...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔐 [AuthContext] onAuthStateChange: Event:', event, 'User ID:', currentSession?.user?.id, 'Current Loading:', loading, 'Current User:', !!user, 'Current Profile:', !!profile);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log('👤 [AuthContext] onAuthStateChange: User found, fetching profile...');
          if (currentSession.user?.id) {
            console.log('⏳ [AuthContext] Attempting to fetch profile immediately for user:', currentSession.user.id);
            await fetchProfile(currentSession.user.id); // Await fetchProfile
          } else {
            console.warn('⚠️ [AuthContext] onAuthStateChange: User ID not available, cannot fetch profile.');
          }
        } else {
          console.log('👤 [AuthContext] onAuthStateChange: No user, clearing profile...');
          setProfile(null);
          setIsAdmin(false);
        }

        setLoading(false);
        console.log('✅ [AuthContext] onAuthStateChange: Loading set to false. User:', !!(currentSession?.user), 'Profile:', !!profile);
      }
    );

    // THEN check for existing session
    const checkSessionAndFetchProfile = async () => {
      console.log('🔍 [AuthContext] getSession: Checking existing session...');
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        console.log('👤 [AuthContext] getSession: Existing user found, fetching profile...');
        if (existingSession.user?.id) {
          await fetchProfile(existingSession.user.id); // Wait for profile fetch
        } else {
          console.warn('⚠️ [AuthContext] getSession: Existing session user ID not available, cannot fetch profile.');
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      console.log('✅ [AuthContext] getSession: Initial check complete. User:', !!(existingSession?.user), 'Profile will be set by fetchProfile');
      setLoading(false); // Set loading to false after initial session check and profile fetch
    };

    checkSessionAndFetchProfile();

    return () => {
      console.log('🧹 [AuthContext] Cleanup: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔑 [AuthContext] signIn: Attempting sign-in for email:', email);
      
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
        console.error('❌ [AuthContext] signUp: Error during sign-up:', error);
        let errorMessage = 'Erro ao criar conta';
        if (error.message.includes('User already registered')) {
          errorMessage = 'Já existe uma conta com este email.';
        }
        toast({
          title: 'Erro de Registo',
          description: errorMessage,
          variant: 'destructive'
        });
        return { error };
      }

      // Create a profile entry for the new user
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || data.user.email?.split('@')[0] || 'Novo Utilizador',
        });

        if (profileError) {
          console.error('❌ [AuthContext] signUp: Error creating profile:', profileError);
          toast({
            title: 'Erro no Perfil',
            description: 'Não foi possível criar o perfil do utilizador. Por favor, contacte o suporte.',
            variant: 'destructive',
          });
          // Consider rolling back user creation or handling this more gracefully
          return { error: profileError };
        } else {
          toast({
            title: 'Conta Criada',
            description: 'Verifique o seu email para confirmar a sua conta.',
          });
        }
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
