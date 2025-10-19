import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { CartProvider } from "@/contexts/CartContextProvider";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { useEffect } from "react";
import { initializeSecurity } from "@/middleware/security";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";

import CreateKeepsake from "@/pages/CreateKeepsake";
import EditKeepsake from "@/pages/EditKeepsake";
import Profile from "@/pages/Profile";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";
import Products from "@/pages/Products";
import FAQ from "@/pages/FAQ";
import Partnerships from "@/pages/Partnerships";
import Checkout from "@/pages/Checkout";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import TermsConditions from "@/pages/TermsConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import LandingPage from "@/pages/LandingPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/admin/BlogAdmin";


const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initializeSecurity();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <GamificationProvider>
              <CartProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* Blog público */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-keepsake" element={<CreateKeepsake />} />
                  <Route path="/edit-keepsake/:id" element={<EditKeepsake />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="/admin/blog" element={<BlogAdmin />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </GamificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
