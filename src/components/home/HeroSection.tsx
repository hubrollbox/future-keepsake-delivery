import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="main-content" className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-20 bg-gradient-to-br from-lavender-mist via-sand-beige/30 to-lavender-mist">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-dusty-rose rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-earthy-burgundy rounded-full"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 md:mb-16">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <SeloDoTempoIcon size={120} className="drop-shadow-sm animate-fade-in" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-fraunces font-bold text-steel-blue mb-6 leading-tight">
            Futuro<span className="text-earthy-burgundy">Presente</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-dusty-rose font-fraunces italic mb-8">
            Presente no futuro
          </p>

          {/* Story Introduction */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-xl md:text-2xl text-steel-blue mb-6 leading-relaxed font-medium">
              Nascemos de um gesto íntimo: <span className="text-earthy-burgundy font-semibold">uma mensagem escrita por um pai para a filha, 
              para ser lida aos 18 anos.</span>
            </p>
            <p className="text-lg md:text-xl text-misty-gray leading-relaxed">
              Mais do que uma aplicação tecnológica, somos um espaço de memória, sensibilidade e presença. 
              Guardamos emoções para o tempo certo.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-10 md:mb-16">
            <Button 
              size="lg" 
              variant="brand"
              className="px-8 py-6 text-lg min-h-[60px] group transition-all duration-200"
              onClick={() => navigate('/register')}
            >
              <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce-gentle" />
              Começar a Minha Jornada
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="brand-outline" 
              size="lg" 
              className="px-8 py-6 text-lg min-h-[60px] transition-all duration-200"
              onClick={() => navigate('/about')}
            >
              Conhecer a Nossa História
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-misty-gray">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-earthy-burgundy rounded-full"></div>
              <span className="text-sm font-medium">100% Português</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-earthy-burgundy rounded-full"></div>
              <span className="text-sm font-medium">Segurança Garantida</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-earthy-burgundy rounded-full"></div>
              <span className="text-sm font-medium">Entregas Precisas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
