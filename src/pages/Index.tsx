
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProductHighlightSection from "@/components/home/ProductHighlightSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustSection from "@/components/home/TrustSection";
import FinalCTA from "@/components/home/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <ProductHighlightSection />
        <ManifestoSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <TrustSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
