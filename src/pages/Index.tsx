
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import GamificationPreview from "@/components/home/GamificationPreview";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import DeliveryTypesSection from "@/components/home/DeliveryTypesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustSection from "@/components/home/TrustSection";
import FinalCTA from "@/components/home/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <ManifestoSection />
        <GamificationPreview />
        <HowItWorksSection />
        <DeliveryTypesSection />
        <TestimonialsSection />
        <TrustSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
