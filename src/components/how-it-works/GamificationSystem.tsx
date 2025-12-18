
import { Trophy, Target, Gift, Calendar } from "lucide-react";

const GamificationSystem = () => {
  return (
    <div className="mb-12 md:mb-20 bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-md border border-keepla-red/20 transition-all hover:shadow-md">
      <div className="text-center mb-8 md:mb-12">
        <Trophy className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto mb-6 animate-bounce-gentle" />
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-blue mb-6 font-fraunces">Torna-te um Guardião do Tempo</h3>
        <p className="text-lg md:text-xl text-misty-gray max-w-3xl mx-auto leading-relaxed">
          Mais do que entregas, é uma jornada temporal com selos, níveis e conquistas únicas que tornam cada momento especial.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Target className="h-12 w-12 md:h-14 md:w-14 text-earthy-burgundy mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-steel-blue font-fraunces">Selos Temporais</h4>
          <p className="text-sm md:text-base text-misty-gray leading-relaxed">Conquista selos únicos baseados na distância das entregas</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Trophy className="h-12 w-12 md:h-14 md:w-14 text-earthy-burgundy mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-steel-blue font-fraunces">Níveis de Guardião</h4>
          <p className="text-sm md:text-base text-misty-gray leading-relaxed">Desbloqueia prestígio com entregas mais distantes</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Gift className="h-12 w-12 md:h-14 md:w-14 text-earthy-burgundy mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-steel-blue font-fraunces">Árvore de Memórias</h4>
          <p className="text-sm md:text-base text-misty-gray leading-relaxed">Timeline visual das tuas cápsulas temporais</p>
        </div>
        <div className="text-center p-4 md:p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
          <Calendar className="h-12 w-12 md:h-14 md:w-14 text-earthy-burgundy mx-auto mb-4" />
          <h4 className="text-lg md:text-xl font-bold mb-3 text-steel-blue font-fraunces">Missões Temporais</h4>
          <p className="text-sm md:text-base text-misty-gray leading-relaxed">Desafios especiais para Guardiões dedicados</p>
        </div>
      </div>
    </div>
  );
};

export default GamificationSystem;
