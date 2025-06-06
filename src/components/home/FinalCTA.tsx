
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Heart } from "lucide-react";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const FinalCTA = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-earthy-burgundy via-earthy-burgundy/90 to-steel-blue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <SeloDoTempoIcon size={100} className="text-white drop-shadow-lg" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-fraunces font-bold mb-6 leading-tight">
            Pronto para a Tua Primeira<br />
            <span className="text-dusty-rose">Viagem no Tempo?</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto opacity-90">
            Junta-te aos nossos <span className="text-dusty-rose font-semibold">primeiros utilizadores</span> que já estão a criar memórias para o futuro. 
            Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              size="lg" 
              variant="brand"
              className="px-12 py-6 text-lg min-h-[60px] group bg-white text-earthy-burgundy hover:bg-white/90 hover:scale-105"
              onClick={() => handleNavigation('/register')}
            >
              <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce-gentle" />
              Começar Grátis Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="brand-outline" 
              size="lg" 
              className="px-12 py-6 text-lg min-h-[60px] border-white text-white hover:bg-white/10"
              onClick={() => handleNavigation('/contact')}
            >
              Falar Connosco
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-white/80">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-dusty-rose" />
              <span>Sem compromissos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-dusty-rose" />
              <span>Cancelamento a qualquer momento</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-dusty-rose" />
              <span>Suporte português</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
