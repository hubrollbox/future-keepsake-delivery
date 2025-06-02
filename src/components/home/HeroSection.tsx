
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="text-center max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-3 text-gold">
          <Clock className="h-12 w-12 md:h-16 md:w-16" />
          <Sparkles className="h-8 w-8 md:h-12 md:w-12" />
        </div>
      </div>
      
      <h1 className="text-hero-sm md:text-hero text-black mb-6 md:mb-8 leading-tight tracking-tight font-extrabold">
        O teu tempo,
        <span className="text-gold block md:inline"> entregue no futuro.</span>
      </h1>
      
      <p className="text-subtitle md:text-body-large text-gray-700 mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
        A <strong className="text-gold">primeira plataforma portuguesa</strong> que te permite agendar entregas de presentes físicos 
        ou digitais para datas especiais no futuro. Cria memórias atemporais com armazenamento seguro e entrega garantida.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-16 md:mb-20 animate-slide-up">
        <Button 
          size="lg" 
          className="text-body md:text-body-large px-10 md:px-14 py-6 md:py-8 bg-gold-gradient text-black hover:opacity-90 hover:scale-105 transition-all duration-300 font-bold rounded-xl shadow-lg min-h-[64px] md:min-h-[72px]" 
          onClick={() => handleNavigation('/register')}
        >
          Criar a Minha Primeira Entrega
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-body md:text-body-large px-10 md:px-14 py-6 md:py-8 border-2 border-gold text-black hover-gold hover:scale-105 transition-all duration-300 font-semibold rounded-xl min-h-[64px] md:min-h-[72px]" 
          onClick={() => handleNavigation('/how-it-works')}
        >
          Descobrir Como Funciona
        </Button>
      </div>

      <div className="text-sm md:text-base text-gray-600 animate-fade-in">
        <p className="mb-2 font-medium">✓ Mais de 50.000 entregas realizadas com sucesso</p>
        <p className="font-medium">✓ Empresa portuguesa com apoio local dedicado</p>
      </div>
    </div>
  );
};

export default HeroSection;
