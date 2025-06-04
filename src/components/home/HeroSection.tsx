
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lavanda-palida relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-rosa-antigo/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-rosa-antigo/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-rosa-antigo/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="text-center max-w-4xl mx-auto px-4 relative z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/803a5ddd-22c9-4662-a2c1-fcc9a2dba233.png" 
            alt="Selo do Tempo FuturoPresente" 
            className="h-24 w-auto md:h-32 animate-float"
          />
        </div>
        
        <h1 className="text-title text-azul-petroleo mb-6 md:mb-8 leading-tight tracking-tight font-fraunces font-bold">
          O que sentes hoje,
          <span className="text-rosa-antigo block md:inline"> no tempo de quem amas.</span>
        </h1>
        
        <p className="text-subtitle md:text-body-text text-azul-petroleo/80 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-fraunces">
          A <strong className="text-rosa-antigo">primeira plataforma portuguesa</strong> que te permite agendar entregas de presentes físicos 
          ou digitais para datas especiais no futuro. Cria memórias atemporais com armazenamento seguro e entrega garantida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-16 md:mb-20 animate-slide-up">
          <Button 
            size="lg" 
            className="text-body-text md:text-body-text px-8 md:px-12 py-6 md:py-8 bg-azul-meia-noite text-lavanda-palida hover:bg-azul-meia-noite/90 hover:scale-105 transition-all duration-300 font-fraunces font-bold rounded-xl shadow-soft min-h-[64px] md:min-h-[72px]" 
            onClick={() => handleNavigation('/register')}
          >
            Criar a Minha Primeira Entrega
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-body-text md:text-body-text px-8 md:px-12 py-6 md:py-8 border-2 border-rosa-antigo text-azul-petroleo hover:bg-rosa-antigo/10 hover:scale-105 transition-all duration-300 font-fraunces font-semibold rounded-xl min-h-[64px] md:min-h-[72px]" 
            onClick={() => handleNavigation('/products')}
          >
            Ver Produtos e Serviços
          </Button>
        </div>

        <div className="text-center">
          <p className="text-small text-cinza-esfumado font-fraunces italic">
            "Presente no futuro"
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
