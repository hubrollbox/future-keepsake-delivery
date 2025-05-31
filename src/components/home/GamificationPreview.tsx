
import { Trophy, Target, Gift, Star } from "lucide-react";

const GamificationPreview = () => {
  return (
    <div className="mb-16 bg-light-gold rounded-2xl p-8 border border-gold">
      <div className="flex justify-center mb-6">
        <Trophy className="h-12 w-12 text-gold" />
      </div>
      <h3 className="text-2xl font-bold text-black mb-4">
        Torna-te um Verdadeiro Guardião do Tempo
      </h3>
      <p className="text-gray-700 mb-6 text-lg">
        Cada entrega que crias é uma missão temporal única. Conquista selos exclusivos, 
        desbloqueia níveis de prestígio e constrói a tua própria árvore de memórias através do tempo.
      </p>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="text-center">
          <Target className="h-8 w-8 text-gold mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">Selos Temporais Únicos</p>
          <p className="text-xs text-gray-600">Colecciona marcos especiais</p>
        </div>
        <div className="text-center">
          <Trophy className="h-8 w-8 text-gold mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">Níveis de Guardião</p>
          <p className="text-xs text-gray-600">Do Iniciante ao Mestre</p>
        </div>
        <div className="text-center">
          <Gift className="h-8 w-8 text-gold mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">Árvore de Memórias</p>
          <p className="text-xs text-gray-600">Visualiza a tua jornada</p>
        </div>
        <div className="text-center">
          <Star className="h-8 w-8 text-gold mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">Missões Temporais</p>
          <p className="text-xs text-gray-600">Desafios únicos</p>
        </div>
      </div>
    </div>
  );
};

export default GamificationPreview;
