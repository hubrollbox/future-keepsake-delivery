
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, ArrowRight } from "lucide-react";

interface HowItWorksCTAProps {
  onNavigate: (path: string) => void;
}

const HowItWorksCTA = ({ onNavigate }: HowItWorksCTAProps) => {
  const handleNavigation = (path: string) => {
    onNavigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="text-center bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-5xl mx-auto shadow-2xl border border-amber-200">
      <Trophy className="h-16 w-16 md:h-20 md:w-20 text-amber-700 mx-auto mb-6 animate-bounce" />
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 md:mb-8">
        Pronto para Te Tornares um Guardião do Tempo?
      </h2>
      <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 md:mb-8 font-bold">
        O teu tempo, entregue no momento perfeito.
      </p>
      <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-4xl mx-auto">
        Começa a criar memórias para o futuro e desbloqueia os teus primeiros selos temporais. 
        <strong className="text-amber-700"> Junta-te a milhares de Guardiões do Tempo</strong>.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
        <Button 
          size="lg" 
          className="text-lg md:text-xl px-10 md:px-14 py-6 md:py-8 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition-all hover:scale-110 hover:shadow-2xl font-bold rounded-full min-h-[64px] md:min-h-[72px] group"
          onClick={() => handleNavigation('/register')}
        >
          <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6" />
          Criar Primeira Entrega
          <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg md:text-xl px-10 md:px-14 py-6 md:py-8 border-2 border-amber-600 text-amber-700 hover:bg-amber-50 transition-all hover:scale-105 hover:shadow-lg font-bold rounded-full min-h-[64px] md:min-h-[72px]" 
          onClick={() => handleNavigation('/pricing')}
        >
          Ver Preços
        </Button>
      </div>
    </div>
  );
};

export default HowItWorksCTA;
