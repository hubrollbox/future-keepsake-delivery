
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PartnershipCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center bg-keepla-white border border-keepla-gray rounded-2xl p-8 max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold text-keepla-black mb-4 font-inter">
        Pronto para Ser Nosso Parceiro?
      </h3>
      <p className="text-lg text-keepla-gray-700 mb-6 font-inter">
        Vamos criar juntos o futuro das entregas temporais e experiências memoráveis.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 bg-keepla-red text-white hover:bg-keepla-red/90 font-semibold font-inter"
          onClick={() => navigate('/contact')}
        >
          Propor Parceria
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg px-8 py-6 border-keepla-red text-keepla-red hover:bg-keepla-red/10 font-inter"
          onClick={() => navigate('/contact')}
        >
          Saber Mais
        </Button>
      </div>
    </div>
  );
};

export default PartnershipCTA;
