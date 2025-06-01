
import { Trophy, Target, Gift, Star } from "lucide-react";

const GamificationPreview = () => {
  return (
    <div className="mb-16 md:mb-20 bg-light-gold rounded-2xl p-6 md:p-8 border border-gold animate-scale-in transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-center mb-6">
        <Trophy className="h-12 w-12 md:h-16 md:w-16 text-gold animate-bounce-gentle" />
      </div>
      <h2 className="text-section-title-sm md:text-section-title text-black mb-4 md:mb-6">
        Torna-te um Verdadeiro Guardião do Tempo
      </h2>
      <p className="text-body md:text-body-large text-gray-700 mb-6 md:mb-8 leading-relaxed">
        Cada entrega que crias é uma missão temporal única. Conquista selos exclusivos, 
        desbloqueia níveis de prestígio e constrói a tua própria árvore de memórias através do tempo.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="text-center hover:scale-105 transition-transform duration-300">
          <Target className="h-8 w-8 md:h-10 md:w-10 text-gold mx-auto mb-2 md:mb-3" />
          <p className="text-sm md:text-base font-semibold text-black mb-1">Selos Temporais Únicos</p>
          <p className="text-xs md:text-sm text-gray-600">Colecciona marcos especiais</p>
        </div>
        <div className="text-center hover:scale-105 transition-transform duration-300">
          <Trophy className="h-8 w-8 md:h-10 md:w-10 text-gold mx-auto mb-2 md:mb-3" />
          <p className="text-sm md:text-base font-semibold text-black mb-1">Níveis de Guardião</p>
          <p className="text-xs md:text-sm text-gray-600">Do Iniciante ao Mestre</p>
        </div>
        <div className="text-center hover:scale-105 transition-transform duration-300">
          <Gift className="h-8 w-8 md:h-10 md:w-10 text-gold mx-auto mb-2 md:mb-3" />
          <p className="text-sm md:text-base font-semibold text-black mb-1">Árvore de Memórias</p>
          <p className="text-xs md:text-sm text-gray-600">Visualiza a tua jornada</p>
        </div>
        <div className="text-center hover:scale-105 transition-transform duration-300">
          <Star className="h-8 w-8 md:h-10 md:w-10 text-gold mx-auto mb-2 md:mb-3" />
          <p className="text-sm md:text-base font-semibold text-black mb-1">Missões Temporais</p>
          <p className="text-xs md:text-sm text-gray-600">Desafios únicos</p>
        </div>
      </div>
    </div>
  );
};

export default GamificationPreview;
