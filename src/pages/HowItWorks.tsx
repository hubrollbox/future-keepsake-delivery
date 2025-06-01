
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HowItWorksHero from "@/components/how-it-works/HowItWorksHero";
import GamificationSystem from "@/components/how-it-works/GamificationSystem";
import DeliveryTypesDetailed from "@/components/how-it-works/DeliveryTypesDetailed";
import HowItWorksFAQ from "@/components/how-it-works/HowItWorksFAQ";
import SecurityGuarantees from "@/components/how-it-works/SecurityGuarantees";
import HowItWorksCTA from "@/components/how-it-works/HowItWorksCTA";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105"
          onClick={() => handleNavigation('/')}
        >
          <Clock className="h-8 w-8 text-amber-700" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
            FuturoPresente
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/how-it-works')}
            className="transition-all hover:scale-105 hover:bg-amber-100"
          >
            Como Funciona
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/pricing')}
            className="transition-all hover:scale-105 hover:bg-amber-100"
          >
            Preços & Planos
          </Button>
        </nav>
        <div className="space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/login')}
            className="transition-all hover:scale-105"
          >
            Entrar
          </Button>
          <Button 
            onClick={() => handleNavigation('/register')}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all hover:scale-105 hover:shadow-lg transform"
          >
            Começar Grátis
          </Button>
        </div>
      </header>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-pulse">
        <Button
          size="lg"
          onClick={() => handleNavigation('/register')}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 text-base md:text-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Cria a Tua Cápsula do Tempo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-8 md:py-16 transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}>
        <HowItWorksHero />
        <GamificationSystem />
        <DeliveryTypesDetailed />
        <HowItWorksFAQ />
        <SecurityGuarantees />
        <HowItWorksCTA onNavigate={handleNavigation} />
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm mt-12 md:mt-20">
        <div className="container mx-auto px-4 py-8 md:py-12 text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4 md:mb-6">
            <Clock className="h-6 w-6 md:h-8 md:w-8 text-amber-700" />
            <h4 className="text-lg md:text-xl font-bold text-amber-700">FuturoPresente™</h4>
          </div>
          <p className="text-sm md:text-base">&copy; 2024 FuturoPresente™. O teu tempo, entregue no momento perfeito.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
