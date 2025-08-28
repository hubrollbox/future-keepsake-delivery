
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import StorySection from "@/components/home/StorySection";
import ProductsSection from "@/components/home/ProductsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustSection from "@/components/home/TrustSection";
import FinalCTA from "@/components/home/FinalCTA";
import OnboardingModal from "@/components/OnboardingModal";
import React, { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Index = () => {
  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />
      <OnboardingModal />

      <main>
        <HeroSection />
        
        <Suspense fallback={<LoadingSpinner size="lg" text="A carregar secções..." className="py-20" />}>
          <StorySection />
          <ProductsSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <TrustSection />
          <FinalCTA />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
