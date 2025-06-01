
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light-gold border-2 border-gold rounded-2xl p-6 md:p-8 max-w-4xl mx-auto animate-scale-in hover:shadow-xl transition-all duration-300">
      <h2 className="text-section-title-sm md:text-section-title text-black mb-4 md:mb-6 text-center">
        Pronto para a Tua Primeira Viagem no Tempo?
      </h2>
      <p className="text-body md:text-body-large text-gray-700 mb-6 md:mb-8 text-center leading-relaxed max-w-3xl mx-auto">
        Junta-te a milhares de pessoas que já estão a criar memórias para o futuro. 
        Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
        <Button 
          size="lg" 
          className="text-body md:text-body-large px-8 md:px-12 py-6 md:py-8 bg-gold-gradient text-black hover:opacity-90 hover:scale-105 transition-all duration-300 font-semibold rounded-xl shadow-lg min-h-[60px] md:min-h-[70px]"
          onClick={() => navigate('/register')}
        >
          Começar Grátis Agora
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-body md:text-body-large px-8 md:px-12 py-6 md:py-8 border-2 border-gold text-gold hover:bg-gold/10 hover:scale-105 transition-all duration-300 font-semibold rounded-xl min-h-[60px] md:min-h-[70px]"
          onClick={() => navigate('/contact')}
        >
          Falar Connosco
        </Button>
      </div>
      <p className="text-sm md:text-base text-gray-600 mt-4 md:mt-6 text-center">Sem compromissos • Cancelamento a qualquer momento</p>
    </div>
  );
};

export default FinalCTA;
