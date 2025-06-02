
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
    <div className="bg-light-gold border-2 border-gold rounded-2xl p-8 md:p-10 max-w-5xl mx-auto animate-scale-in hover:shadow-xl transition-all duration-300">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <Star className="h-8 w-8 md:h-10 md:w-10 text-gold animate-bounce" />
        </div>
        <h2 className="text-section-title-sm md:text-section-title text-black mb-4 md:mb-6 font-bold">
          Pronto para a Tua Primeira Viagem no Tempo?
        </h2>
        <p className="text-body md:text-body-large text-gray-700 mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto font-medium">
          Junta-te aos nossos <strong className="text-gold">primeiros utilizadores</strong> que já estão a criar memórias para o futuro. 
          Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-6">
        <Button 
          size="lg" 
          className="text-body md:text-body-large px-10 md:px-14 py-6 md:py-8 bg-gold-gradient text-black hover:opacity-90 hover:scale-105 transition-all duration-300 font-bold rounded-xl shadow-lg min-h-[64px] md:min-h-[72px] group"
          onClick={() => handleNavigation('/register')}
        >
          Começar Grátis Agora
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-body md:text-body-large px-10 md:px-14 py-6 md:py-8 border-2 border-gold text-gold hover:bg-gold/10 hover:scale-105 transition-all duration-300 font-semibold rounded-xl min-h-[64px] md:min-h-[72px]"
          onClick={() => handleNavigation('/contact')}
        >
          Falar Connosco
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm md:text-base text-gray-600 font-medium">
          ✓ Sem compromissos • ✓ Cancelamento a qualquer momento • ✓ Suporte português
        </p>
      </div>
    </div>
  );
};

export default FinalCTA;
