
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ErrorBoundary } from "@sentry/react";
import ErrorBoundaryComponent from "./components/ErrorBoundary";
import OnboardingModal from "@/components/OnboardingModal";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "@/components/ui/loading-spinner";
import React, { Suspense, lazy, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import CreateMessage from "./pages/CreateMessage";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateDelivery = lazy(() => import("./pages/CreateDelivery"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Products = lazy(() => import("./pages/Products"));
const Checkout = lazy(() => import("./pages/Checkout"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Profile = lazy(() => import("./pages/Profile"));

// Optimized query client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Enhanced loading component for better UX
const PageLoadingFallback = ({ pageName }: { pageName?: string }) => (
  <div className="min-h-screen bg-lavender-mist flex items-center justify-center">
    <LoadingSpinner 
      size="lg" 
      text={pageName ? `A carregar ${pageName}...` : "A carregar página..."} 
    />
  </div>
);

const App = () => {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn("Erro de sessão:", sessionError.message);
          return;
        }
        
        if (!session) {
          console.info("Nenhuma sessão ativa encontrada");
          return;
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Erro ao obter utilizador:", userError.message);
          return;
        }
        
        console.log("Utilizador autenticado:", user?.email);
      } catch (error) {
        console.error("Erro na verificação de sessão:", error);
      }
    };
    
    checkSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <GamificationProvider>
              <Toaster />
              <Sonner />
              <ErrorBoundaryComponent>
                <ErrorBoundary fallback={<div className="min-h-screen bg-lavender-mist flex items-center justify-center"><div className="text-center p-8 bg-white rounded-lg shadow-soft"><h2 className="text-xl font-semibold text-steel-blue mb-2">Ocorreu um erro inesperado</h2><p className="text-misty-gray">Por favor, recarregue a página.</p></div></div>}>
                  <BrowserRouter>
                    <OnboardingModal />
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Login" />}>
                            <Login />
                          </Suspense>
                        } />
                        <Route path="/register" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Registo" />}>
                            <Register />
                          </Suspense>
                        } />
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Suspense fallback={<PageLoadingFallback pageName="Dashboard" />}>
                              <Dashboard />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        <Route path="/create-delivery" element={
                          <ProtectedRoute>
                            <Suspense fallback={<PageLoadingFallback pageName="Criar Entrega" />}>
                              <CreateDelivery />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/*" element={
                          <ProtectedRoute>
                            <Suspense fallback={<PageLoadingFallback pageName="Admin" />}>
                              <AdminDashboard />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        <Route path="/products" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Produtos" />}>
                            <Products />
                          </Suspense>
                        } />
                        <Route path="/checkout" element={
                          <ProtectedRoute>
                            <Suspense fallback={<PageLoadingFallback pageName="Checkout" />}>
                              <Checkout />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        <Route path="/how-it-works" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Como Funciona" />}>
                            <HowItWorks />
                          </Suspense>
                        } />
                        <Route path="/pricing" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Preços" />}>
                            <Pricing />
                          </Suspense>
                        } />
                        <Route path="/create-message" element={
                          <ProtectedRoute>
                            <Suspense fallback={<PageLoadingFallback pageName="Criar Mensagem" />}>
                              <CreateMessage />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        <Route path="/about" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Sobre Nós" />}>
                            <About />
                          </Suspense>
                        } />
                        <Route path="/contact" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Contacto" />}>
                            <Contact />
                          </Suspense>
                        } />
                        <Route path="/partnerships" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Parcerias" />}>
                            <Partnerships />
                          </Suspense>
                        } />
                        <Route path="/terms-conditions" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Termos e Condições" />}>
                            <TermsConditions />
                          </Suspense>
                        } />
                        <Route path="/privacy-policy" element={
                          <Suspense fallback={<PageLoadingFallback pageName="Política de Privacidade" />}>
                            <PrivacyPolicy />
                          </Suspense>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Suspense fallback={<PageLoadingFallback pageName="Perfil" />}>
                              <Profile />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        <Route path="/faq" element={
                          <Suspense fallback={<PageLoadingFallback pageName="FAQ" />}>
                            <FAQ />
                          </Suspense>
                        } />
                        <Route path="*" element={
                          <Suspense fallback={<PageLoadingFallback />}>
                            <NotFound />
                          </Suspense>
                        } />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                </ErrorBoundary>
              </ErrorBoundaryComponent>
            </GamificationProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
