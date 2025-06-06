
import { Heart, Clock, Star } from "lucide-react";

const StorySection = () => {
  return (
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fraunces font-bold text-steel-blue mb-6">
              Porque Há Coisas Que Só Fazem Sentido<br />
              <span className="text-earthy-burgundy">No Momento Certo</span>
            </h2>
            <p className="text-xl text-misty-gray max-w-3xl mx-auto leading-relaxed">
              Vivemos num mundo acelerado, onde tudo é imediato — mas há palavras que precisam de amadurecer, 
              de esperar pelo momento perfeito para florescer.
            </p>
          </div>

          {/* Story Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="emotion-card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <Heart className="h-8 w-8 text-earthy-burgundy" />
              </div>
              <h3 className="text-xl font-fraunces font-semibold text-steel-blue mb-4">Poesia nas Memórias</h3>
              <p className="text-misty-gray leading-relaxed">
                Cada mensagem é um verso guardado no tempo, esperando o momento perfeito para tocar o coração de quem a recebe.
              </p>
            </div>

            <div className="emotion-card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <Clock className="h-8 w-8 text-earthy-burgundy" />
              </div>
              <h3 className="text-xl font-fraunces font-semibold text-steel-blue mb-4">Afeto Atemporal</h3>
              <p className="text-misty-gray leading-relaxed">
                O amor não conhece fronteiras temporais. Guardamos os gestos mais íntimos para que floresçam quando mais são precisos.
              </p>
            </div>

            <div className="emotion-card p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <Star className="h-8 w-8 text-earthy-burgundy" />
              </div>
              <h3 className="text-xl font-fraunces font-semibold text-steel-blue mb-4">Contemplação do Futuro</h3>
              <p className="text-misty-gray leading-relaxed">
                Cada entrega é uma ponte entre o presente e o futuro, criada com a sensibilidade de quem compreende o valor do tempo.
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center">
            <div className="emotion-card p-12 max-w-4xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-fraunces italic text-steel-blue mb-6 leading-relaxed">
                "Guardamos aquilo que é importante. Protegemos aquilo que é íntimo. 
                Acreditamos que a entrega certa pode mudar o dia — ou até a vida — de quem a recebe."
              </blockquote>
              <p className="text-earthy-burgundy font-semibold text-lg font-fraunces">
                — Porque o amor, quando guardado com cuidado, chega sempre na hora certa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
