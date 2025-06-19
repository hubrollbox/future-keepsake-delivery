
import { Clock, Sparkles } from "lucide-react";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const HowItWorksHero = () => {
  return (
    <div className="text-center max-w-6xl mx-auto mb-12 md:mb-20">
      <div className="flex justify-center mb-8">
        <SeloDoTempoIcon size={80} className="drop-shadow-sm" />
      </div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-steel-blue mb-6 md:mb-8 leading-tight tracking-tight font-fraunces">
        Como Funciona o
        <span className="text-earthy-burgundy block md:inline"> keeplar</span>
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
