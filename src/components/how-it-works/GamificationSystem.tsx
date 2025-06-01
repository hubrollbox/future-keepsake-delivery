
import { Trophy, Target, Gift, Calendar } from "lucide-react";

const GamificationSystem = () => {
  return (
    <div className="mb-12 md:mb-20 bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-xl border border-amber-200 transition-all hover:shadow-2xl">
      <div className="text-center mb-8 md:mb-12">
        <Trophy className="h-16 w-16 md:h-20 md:w-20 text-amber-700 mx-auto mb-6 animate-bounce" />
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Torna-te um Guardião do Tempo</h3>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Mais do que entregas, é uma jornada temporal com selos, níveis e conquistas únicas que tornam cada momento especial.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Target className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Selos Temporais</h4>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Conquista selos únicos baseados na distância das entregas</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Trophy className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Níveis de Guardião</h4>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Desbloqueia prestígio com entregas mais distantes</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Gift className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Árvore de Memórias</h4>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Timeline visual das tuas cápsulas temporais</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Calendar className="h-12 w-12 md:h-14 md:w-14 text-amber-700 mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-800">Missões Temporais</h4>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Desafios especiais para Guardiões dedicados</p>
        </div>
      </div>
    </div>
  );
};

export default GamificationSystem;
