
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light-gold border-2 border-gold rounded-2xl p-8 max-w-2xl mx-auto">
      <h3 className="text-3xl font-bold text-black mb-4">
        Pronto para a Tua Primeira Viagem no Tempo?
      </h3>
      <p className="text-xl text-gray-700 mb-6">
        Junta-te a milhares de pessoas que já estão a criar memórias para o futuro. 
        Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 bg-gold-gradient text-black hover:opacity-90 font-semibold"
          onClick={() => navigate('/register')}
        >
          Começar Grátis Agora
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg px-8 py-6 border-gold text-gold hover:bg-gold/10"
          onClick={() => navigate('/contact')}
        >
          Falar Connosco
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-4">Sem compromissos • Cancelamento a qualquer momento</p>
    </div>
  );
};

export default FinalCTA;
