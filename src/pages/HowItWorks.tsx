import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HowItWorksHero from "@/components/how-it-works/HowItWorksHero";
import GamificationSystem from "@/components/how-it-works/GamificationSystem";
import DeliveryTypesDetailed from "@/components/how-it-works/DeliveryTypesDetailed";
import HowItWorksFAQ from "@/components/how-it-works/HowItWorksFAQ";
import SecurityGuarantees from "@/components/how-it-works/SecurityGuarantees";
import HowItWorksCTA from "@/components/how-it-works/HowItWorksCTA";
import SEOHead from "@/components/SEOHead";

const HowItWorks = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-keepla-white">
      <SEOHead 
        title="Como Funciona"
        description="Descobre como a Keepla funciona: cria keepsakes, agenda entregas e surpreende quem amas no momento certo."
        keywords="como funciona keepla, criar keepsake, agendar entrega, cápsula tempo"
      />
      <Navigation />
      <main className={`container mx-auto px-4 py-8 md:py-16 transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}>
        <HowItWorksHero />
        <GamificationSystem />
        <DeliveryTypesDetailed />
        <HowItWorksFAQ />
        <SecurityGuarantees />
        <HowItWorksCTA onNavigate={handleNavigation} />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
