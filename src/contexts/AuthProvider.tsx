import React, { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContext, UserProfile } from './useAuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { isProtectedRoute, isAdminRoute } from '@/middleware/security';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Route protection effect
  useEffect(() => {
    const pathname = location.pathname;
    
    // Check if the current route is protected and user is not authenticated
    if (isProtectedRoute(pathname) && !session) {
      // Redirect to login page if not loading (to prevent redirect during initial auth check)
      if (!loading) {
        console.info('Security: Redirecting unauthenticated user from protected route', pathname);
        navigate('/login', { state: { from: pathname } });
      }
    }
    
    // Check if the current route is an admin route and user is not an admin
    if (isAdminRoute(pathname) && !isAdmin) {
      // Redirect to unauthorized page if not loading
      if (!loading) {
        console.info('Security: Redirecting non-admin user from admin route', pathname);
        navigate('/unauthorized');
      }
    }
  }, [location.pathname, session, isAdmin, loading, navigate]);

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
    } catch (error: unknown) {
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
      (event, currentSession) => {
        console.log('🔐 [AuthContext] onAuthStateChange: Event:', event, 'User ID:', currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user && currentSession.user.id) {
          console.log('⏳ [AuthContext] Fetching profile for user:', currentSession.user.id);
          fetchProfile(currentSession.user.id);
        } else {
          console.log('👤 [AuthContext] onAuthStateChange: No user, clearing profile...');
          setProfile(null);
          setIsAdmin(false);
        }

        setLoading(false);
        console.log('✅ [AuthContext] onAuthStateChange: Loading set to false. User:', !!(currentSession?.user));
      }
    );

    // THEN check for existing session
    const checkSessionAndFetchProfile = async () => {
      console.log('🔍 [AuthContext] getSession: Checking existing session...');
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user && existingSession.user.id) {
        console.log('👤 [AuthContext] getSession: Existing user found, scheduling profile fetch...');
        setTimeout(() => {
          fetchProfile(existingSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      console.log('✅ [AuthContext] getSession: Initial check complete. User:', !!(existingSession?.user), 'Profile will be set by fetchProfile');
      setLoading(false); // Set loading to false after scheduling profile fetch
    };

    checkSessionAndFetchProfile();

    return () => {
      console.log('🧹 [AuthContext] Cleanup: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to avoid infinite loops

  const signIn = async (email: string, password: string): Promise<{ error: unknown }> => {
    try {
      setLoading(true);
      console.log('🔑 [AuthContext] signIn: Attempting sign-in for email:', email);
      
      // Validate input
      if (!email || !password) {
        const error = 'Por favor, insira seu e-mail e senha.';
        toast({
          title: 'Erro de Autenticação',
          description: error,
          variant: 'destructive',
        });
        setLoading(false);
        return { error };
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('❌ [AuthContext] signIn: Supabase sign-in error:', error.message);
        toast({
          title: 'Erro de Autenticação',
          description: error.message || 'Ocorreu um erro ao tentar fazer login.',
          variant: 'destructive',
        });
        setLoading(false);
        return { error };
      }

      console.log('✅ [AuthContext] signIn: Sign-in successful.');
      toast({
        title: 'Login bem-sucedido',
        description: 'Você foi logado com sucesso!',
      });
      return { error: null };
    } catch (error) {
      console.error('❌ [AuthContext] signIn: Unexpected error during sign-in:', error);
      toast({
        title: 'Erro Inesperado',
        description: 'Ocorreu um erro inesperado ao tentar fazer login.',
        variant: 'destructive',
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 [AuthContext] signOut: Attempting sign-out...');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ [AuthContext] signOut: Supabase sign-out error:', error.message);
        toast({
          title: 'Erro ao Sair',
          description: error.message || 'Ocorreu um erro ao tentar sair.',
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ [AuthContext] signOut: Sign-out successful.');
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      toast({
        title: 'Sessão Encerrada',
        description: 'Você foi desconectado com sucesso!',
      });
    } catch (error) {
      console.error('❌ [AuthContext] signOut: Unexpected error during sign-out:', error);
      toast({
        title: 'Erro Inesperado',
        description: 'Ocorreu um erro inesperado ao tentar sair.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error: unknown }> => {
    try {
      setLoading(true);
      console.log('📝 [AuthContext] signUp: Attempting sign-up for email:', email);
      
      // Validate input
      if (!email || !password) {
        const error = 'Por favor, insira um e-mail e senha válidos.';
        toast({
          title: 'Erro de Registro',
          description: error,
          variant: 'destructive',
        });
        setLoading(false);
        return { error };
      }

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('❌ [AuthContext] signUp: Supabase sign-up error:', error.message);
        toast({
          title: 'Erro de Registro',
          description: error.message || 'Ocorreu um erro ao tentar registrar.',
          variant: 'destructive',
        });
        setLoading(false);
        return { error };
      }

      console.log('✅ [AuthContext] signUp: Sign-up successful. User:', data.user?.id);
      toast({
        title: 'Registro bem-sucedido',
        description: 'Verifique seu e-mail para confirmar sua conta.',
      });
      return { error: null };
    } catch (error) {
      console.error('❌ [AuthContext] signUp: Unexpected error during sign-up:', error);
      toast({
        title: 'Erro Inesperado',
        description: 'Ocorreu um erro inesperado ao tentar registrar.',
        variant: 'destructive',
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      setLoading(true);
      console.log('📧 [AuthContext] sendPasswordResetEmail: Attempting to send reset email to:', email);
      
      if (!email) {
        toast({
          title: 'Erro',
          description: 'Por favor, insira seu e-mail.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        console.error('❌ [AuthContext] sendPasswordResetEmail: Supabase error:', error.message);
        toast({
          title: 'Erro ao Redefinir Senha',
          description: error.message || 'Ocorreu um erro ao tentar enviar o e-mail de redefinição.',
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ [AuthContext] sendPasswordResetEmail: Password reset email sent successfully.');
      toast({
        title: 'E-mail Enviado',
        description: 'Verifique seu e-mail para redefinir sua senha.',
      });
    } catch (error) {
      console.error('❌ [AuthContext] sendPasswordResetEmail: Unexpected error:', error);
      toast({
        title: 'Erro Inesperado',
        description: 'Ocorreu um erro inesperado ao tentar enviar o e-mail de redefinição.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      console.log('🔑 [AuthContext] updatePassword: Attempting to update password...');
      
      if (!password) {
        toast({
          title: 'Erro',
          description: 'Por favor, insira sua nova senha.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('❌ [AuthContext] updatePassword: Supabase error:', error.message);
        toast({
          title: 'Erro ao Atualizar Senha',
          description: error.message || 'Ocorreu um erro ao tentar atualizar sua senha.',
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ [AuthContext] updatePassword: Password updated successfully.');
      toast({
        title: 'Senha Atualizada',
        description: 'Sua senha foi atualizada com sucesso!',
      });
    } catch (error) {
      console.error('❌ [AuthContext] updatePassword: Unexpected error:', error);
      toast({
        title: 'Erro Inesperado',
        description: 'Ocorreu um erro inesperado ao tentar atualizar sua senha.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isAdmin,
    signIn,
    signOut,
    signUp,
    sendPasswordResetEmail,
    updatePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};