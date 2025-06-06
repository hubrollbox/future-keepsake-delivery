
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const FinalCTA = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="emotion-card p-12 md:p-16 max-w-5xl mx-auto shadow-soft gentle-spacing">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-earthy-burgundy rounded-2xl flex items-center justify-center shadow-soft">
            <Star className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-steel-blue mb-6 leading-tight font-fraunces">
          Pronto para a Tua Primeira Viagem no Tempo?
        </h2>
        <p className="text-lg md:text-xl text-misty-gray mb-8 leading-relaxed max-w-4xl mx-auto">
          Junta-te aos nossos <strong className="text-earthy-burgundy font-semibold">primeiros utilizadores</strong> que já estão a criar memórias para o futuro. 
          Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
        <Button 
          size="lg" 
          variant="brand"
          className="px-12 py-6 text-lg min-h-[60px] group"
          onClick={() => handleNavigation('/register')}
        >
          Começar Grátis Agora
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          variant="brand-outline" 
          size="lg" 
          className="px-12 py-6 text-lg min-h-[60px]"
          onClick={() => handleNavigation('/contact')}
        >
          Falar Connosco
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-misty-gray font-medium leading-relaxed">
          ✓ Sem compromissos • ✓ Cancelamento a qualquer momento • ✓ Suporte português
        </p>
      </div>
    </div>
  );
};

export default FinalCTA;
