
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowRight } from "lucide-react";

interface HowItWorksCTAProps {
  onNavigate: (path: string) => void;
}

const HowItWorksCTA = ({ onNavigate }: HowItWorksCTAProps) => {
  const handleNavigation = (path: string) => {
    onNavigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="text-center emotion-card p-8 md:p-12 max-w-5xl mx-auto">
      <Heart className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto mb-6" />
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-blue mb-6 md:mb-8 font-fraunces">
        Pronto para Te Tornares um Guardião do Tempo?
      </h2>
      <p className="text-xl md:text-2xl text-dusty-rose mb-6 md:mb-8 font-bold font-fraunces italic">
        Presente no futuro
      </p>
      <p className="text-lg md:text-xl text-misty-gray mb-8 md:mb-10 leading-relaxed max-w-4xl mx-auto">
        Começa a criar memórias para o futuro e desbloqueia os teus primeiros selos temporais. 
        <strong className="text-earthy-burgundy"> Junta-te a milhares de Guardiões do Tempo</strong>.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
        <Button 
          size="lg" 
          variant="brand"
          className="group"
          onClick={() => handleNavigation('/register')}
        >
          <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6" />
          Criar Primeira Entrega
          <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          variant="brand-outline" 
          size="lg" 
          onClick={() => handleNavigation('/products')}
        >
          Ver Produtos
        </Button>
      </div>
    </div>
  );
};

export default HowItWorksCTA;
