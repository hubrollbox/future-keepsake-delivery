
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-hero-sm md:text-hero text-black mb-6 md:mb-8 leading-tight tracking-tight">
        O teu tempo,
        <span className="text-gold block md:inline"> entregue no futuro.</span>
      </h1>
      
      <p className="text-subtitle md:text-body-large text-gray-700 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
        A primeira plataforma portuguesa que te permite agendar entregas de presentes físicos 
        ou digitais para datas especiais no futuro. Cria memórias atemporais com armazenamento seguro e entrega garantida.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-16 md:mb-20 animate-slide-up">
        <Button 
          size="lg" 
          className="text-body md:text-body-large px-8 md:px-12 py-6 md:py-8 bg-gold-gradient text-black hover:opacity-90 hover:scale-105 transition-all duration-300 font-semibold rounded-xl shadow-lg min-h-[60px] md:min-h-[70px]" 
          onClick={() => navigate('/register')}
        >
          Criar a Minha Primeira Entrega
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-body md:text-body-large px-8 md:px-12 py-6 md:py-8 border-2 border-gold text-black hover-gold hover:scale-105 transition-all duration-300 font-semibold rounded-xl min-h-[60px] md:min-h-[70px]" 
          onClick={() => navigate('/how-it-works')}
        >
          Descobrir Como Funciona
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
