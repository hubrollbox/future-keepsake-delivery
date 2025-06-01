
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import GamificationPreview from "@/components/home/GamificationPreview";
import StorytellingSection from "@/components/home/StorytellingSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import DeliveryTypesSection from "@/components/home/DeliveryTypesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustSection from "@/components/home/TrustSection";
import FinalCTA from "@/components/home/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <HeroSection />
        <GamificationPreview />
        <StorytellingSection />
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
