
import { Clock, Sparkles } from "lucide-react";

const HowItWorksHero = () => {
  return (
    <div className="text-center max-w-6xl mx-auto mb-12 md:mb-20">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-3 text-gold">
          <Clock className="h-12 w-12 md:h-16 md:w-16 text-gold" />
          <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-gold" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 mb-6 md:mb-8 leading-tight tracking-tight">
        Como Funciona o
        <span className="bg-gradient-to-r from-gold to-amber-700 bg-clip-text text-transparent block md:inline"> FuturoPresente</span>
      </h1>
      
      <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 md:mb-8 max-w-4xl mx-auto font-bold leading-relaxed">
        <span className="text-gold">O teu tempo, entregue no momento perfeito.</span>
      </p>
      
      <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
        Descobre como podes enviar presentes para o futuro e tornares-te um verdadeiro 
        <strong className="text-gold"> Guardião do Tempo</strong>.
      </p>
    </div>
  );
};

export default HowItWorksHero;
