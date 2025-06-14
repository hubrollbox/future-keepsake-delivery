import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import StorySection from "@/components/home/StorySection";
import ProductsSection from "@/components/home/ProductsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustSection from "@/components/home/TrustSection";
import FinalCTA from "@/components/home/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-lavender-mist">
      <Navigation />

      <main>
        <HeroSection />
        <StorySection />
        <ProductsSection />
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
