import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="main-content"
      className="relative min-h-screen flex items-center justify-center px-4 py-10 md:py-20 bg-gradient-to-br from-lavender-mist via-sand-beige/30 to-lavender-mist"
      aria-label="Introdução e chamada inicial - FuturoPresente"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-16 left-4 w-24 h-24 border-2 border-dusty-rose rounded-full md:top-20 md:left-10 md:w-32 md:h-32"></div>
        <div className="absolute bottom-16 right-4 w-16 h-16 border-2 border-earthy-burgundy rounded-full md:bottom-20 md:right-10 md:w-24 md:h-24"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-6 md:mb-12">
          {/* Logo */}
          <div className="flex justify-center mb-5 md:mb-8">
            <SeloDoTempoIcon
              size={120}
              className="drop-shadow-sm animate-fade-in"
              aria-label="Símbolo Selo do Tempo"
              loading="lazy"
            />
          </div>
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-fraunces font-bold text-steel-blue mb-3 md:mb-6 leading-tight" style={{ textShadow: "0 1px 0 #ECE5DA" }}>
            Futuro
            <span className="text-earthy-burgundy">Presente</span>
          </h1>
          <p className="text-xl md:text-3xl text-dusty-rose font-fraunces italic mb-4 md:mb-8">
            Presente no futuro
          </p>
          {/* Story Introduction */}
          <div className="max-w-4xl mx-auto mb-5 md:mb-12">
            <p className="text-base md:text-xl text-steel-blue mb-3 md:mb-6 leading-relaxed font-medium" style={{ textShadow: "0 1px 0 #ECE5DA" }}>
              Nascemos de um gesto íntimo: <span className="text-earthy-burgundy font-semibold">uma mensagem escrita por um pai para a filha, 
              para ser lida aos 18 anos.</span>
            </p>
            <p className="text-base md:text-xl text-misty-gray leading-relaxed">
              Mais do que uma aplicação tecnológica, somos um espaço de memória, sensibilidade e presença. 
              Guardamos emoções para o tempo certo.
            </p>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center mb-6 md:mb-12">
            <Button 
              size="lg" 
              variant="brand"
              className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[60px] group transition-all duration-200 border-2 border-dusty-rose focus-visible:ring-2 focus-visible:ring-dusty-rose focus:outline-none"
              onClick={() => navigate('/register')}
              aria-label="Registar e criar conta gratuitamente"
            >
              <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce-gentle" />
              Começar a Minha Jornada
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="brand-outline" 
              size="lg" 
              className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[60px] border-2 border-earthy-burgundy text-earthy-burgundy hover:bg-dusty-rose/20 hover:text-earthy-burgundy transition-all duration-200 focus-visible:ring-2 focus-visible:ring-dusty-rose underline underline-offset-2 decoration-dusty-rose"
              onClick={() => navigate('/about')}
              aria-label="Conheça a história do FuturoPresente"
            >
              <span className="text-earthy-burgundy font-semibold">Conhecer a Nossa História</span>
            </Button>
          </div>
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center text-misty-gray">
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
