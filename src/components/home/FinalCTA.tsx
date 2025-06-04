
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
    <div className="bg-white/60 backdrop-blur-sm border border-dusty-rose/30 rounded-3xl p-12 md:p-16 max-w-5xl mx-auto shadow-soft gentle-spacing">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-golden-honey rounded-2xl flex items-center justify-center shadow-soft">
            <Star className="h-8 w-8 text-gentle-black" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gentle-black mb-6 leading-tight">
          Pronto para a Tua Primeira Viagem no Tempo?
        </h2>
        <p className="text-lg md:text-xl text-soft-gray mb-8 leading-relaxed max-w-4xl mx-auto">
          Junta-te aos nossos <strong className="text-golden-honey font-semibold">primeiros utilizadores</strong> que já estão a criar memórias para o futuro. 
          Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
        <Button 
          size="lg" 
          className="px-12 py-6 bg-golden-honey text-gentle-black hover:bg-golden-honey/90 hover:scale-105 transition-all duration-300 font-semibold rounded-2xl shadow-soft text-lg min-h-[60px] group"
          onClick={() => handleNavigation('/register')}
        >
          Começar Grátis Agora
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="px-12 py-6 border-2 border-dusty-rose text-gentle-black hover:bg-dusty-rose/10 hover:scale-105 transition-all duration-300 font-semibold rounded-2xl text-lg min-h-[60px]"
          onClick={() => handleNavigation('/contact')}
        >
          Falar Connosco
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-soft-gray font-medium leading-relaxed">
          ✓ Sem compromissos • ✓ Cancelamento a qualquer momento • ✓ Suporte português
        </p>
      </div>
    </div>
  );
};

export default FinalCTA;
