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

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.warn("Sem sessão – redirecionando para login");
        // window.location.href = "/login";
        return;
      }
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Erro ao obter utilizador:", userError.message);
        return;
      }
      console.log("Utilizador:", user);
    };
    checkSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <GamificationProvider>
              {/* Logo no canto superior esquerdo */}
              <Toaster />
              <Sonner />
              <ErrorBoundaryComponent>
                <ErrorBoundary fallback={<div>Ocorreu um erro inesperado.</div>}>
                  <BrowserRouter>
                    <OnboardingModal />
                    <Suspense fallback={<div>Carregando...</div>}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/create-delivery" element={<ProtectedRoute><CreateDelivery /></ProtectedRoute>} />
                        <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/create-message" element={<ProtectedRoute><CreateMessage /></ProtectedRoute>} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/partnerships" element={<Partnerships />} />
                        <Route path="/terms-conditions" element={<TermsConditions />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="*" element={<NotFound />} />
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
