
import { Clock, Sparkles } from "lucide-react";

const HowItWorksHero = () => {
  return (
    <div className="text-center max-w-6xl mx-auto mb-12 md:mb-20">
      <div className="flex justify-center mb-8">
        <img src="/lovable-uploads/63935007-5aa4-4a0f-8ff5-f6bb5674cc7d.png" alt="keepla Logo" style={{width: 80, height: 80}} />
      </div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-steel-blue mb-6 md:mb-8 leading-tight tracking-tight font-fraunces">
        Como Funciona o
        <span className="text-earthy-burgundy block md:inline"> keepla</span>
      </h1>
      
      <p className="text-xl md:text-2xl lg:text-3xl text-dusty-rose mb-6 md:mb-8 max-w-4xl mx-auto font-bold leading-relaxed font-fraunces italic">
        Presente no futuro
      </p>
      
      <p className="text-lg md:text-xl text-misty-gray max-w-4xl mx-auto leading-relaxed">
        Descobre como podes enviar presentes para o futuro e tornares-te um verdadeiro 
        <strong className="text-earthy-burgundy"> Guardião do Tempo</strong>.
      </p>
    </div>
  );
};

export default HowItWorksHero;
