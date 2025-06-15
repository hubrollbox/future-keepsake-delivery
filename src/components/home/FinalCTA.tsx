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
    // Fundo bege areia com acento rosa antigo
    <section className="py-16 md:py-28 bg-sand-beige relative" aria-label="Convite final para criar conta no FuturoPresente">
      {/* Detalhe decorativo suave com gradiente rosa */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="w-3/4 h-40 md:h-56 bg-dusty-rose/20 blur-3xl rounded-full absolute left-1/2 top-0 -translate-x-1/2" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-8 md:mb-12">
            <SeloDoTempoIcon size={100} className="text-earthy-burgundy drop-shadow-lg" aria-label="Símbolo Selo do Tempo" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-fraunces font-bold mb-4 leading-tight text-steel-blue" style={{ textShadow: "0 1px 0 #ECE5DA" }}>
            Pronto para a Tua Primeira<br />
            <span className="text-earthy-burgundy font-fraunces">
              Viagem no Tempo?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-6 leading-relaxed max-w-3xl mx-auto font-fraunces italic text-dusty-rose">
            Presente no futuro
          </p>
          
          <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto text-steel-blue/90 font-medium">
            Junta-te aos nossos <span className="text-earthy-burgundy font-semibold underline underline-offset-2 decoration-dusty-rose">primeiros utilizadores</span> que já estão a criar memórias para o futuro. 
            Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12">
            <Button 
              size="lg" 
              variant="brand"
              className="px-10 py-6 text-lg min-h-[56px] group bg-earthy-burgundy text-white hover:bg-earthy-burgundy/90 hover:scale-105 border-2 border-dusty-rose shadow-soft transition-all duration-200 focus-visible:ring-2 focus-visible:ring-dusty-rose"
              onClick={() => handleNavigation('/register')}
              aria-label="Criar conta gratuitamente"
            >
              <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce-gentle" />
              Começar Grátis Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="brand-outline" 
              size="lg" 
              className="px-10 py-6 text-lg min-h-[56px] border-earthy-burgundy text-earthy-burgundy hover:bg-dusty-rose/10 hover:text-earthy-burgundy transition-all duration-200 focus-visible:ring-2 focus-visible:ring-dusty-rose"
              onClick={() => handleNavigation('/contact')}
              aria-label="Falar com o suporte da FuturoPresente"
            >
              Falar Connosco
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-misty-gray">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-dusty-rose" aria-label="Ícone garantia" />
              <span>Sem compromissos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-dusty-rose" aria-label="Ícone garantia" />
              <span>Cancelamento a qualquer momento</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-dusty-rose" aria-label="Ícone garantia" />
              <span>Suporte português</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
