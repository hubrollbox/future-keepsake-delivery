import { Heart, Clock, Star } from "lucide-react";
import capsulaImage from "@/assets/capsula-escrita.jpg";
import ruaPalacioImage from "@/assets/rua-palacio.jpg";

const StorySection = () => {
  return (
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <img src={ruaPalacioImage} alt="" className="w-full h-full object-cover grayscale" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="section-tagline">A nossa filosofia</p>
            <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
              Porque Há Coisas Que Só Fazem Sentido<br />
              <span className="text-primary">No Momento Certo</span>
            </h2>
            <p className="hero-subtitle text-muted-foreground max-w-3xl mx-auto">
              Vivemos num mundo acelerado, onde tudo é imediato — mas há palavras que precisam de amadurecer, 
              de esperar pelo momento perfeito para florescer.
            </p>
          </div>

          {/* Story Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card border border-border rounded-2xl p-8 text-center group hover:shadow-keepla hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-semibold text-foreground mb-4">Poesia nas Memórias</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                Cada mensagem é um verso guardado no tempo, esperando o momento perfeito para tocar o coração de quem a recebe.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center group hover:shadow-keepla hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-semibold text-foreground mb-4">Afeto Atemporal</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                O amor não conhece fronteiras temporais. Guardamos os gestos mais íntimos para que floresçam quando mais são precisos.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center group hover:shadow-keepla hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-semibold text-foreground mb-4">Contemplação do Futuro</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                Cada entrega é uma ponte entre o presente e o futuro, criada com a sensibilidade de quem compreende o valor do tempo.
              </p>
            </div>
          </div>

          {/* Quote com imagem */}
          <div className="text-center">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
              {/* Imagem */}
              <div className="order-2 md:order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-keepla-intense">
                  <img 
                    src={capsulaImage} 
                    alt="Pessoa a escrever memórias num parque" 
                    className="w-full h-full object-cover image-bw-dramatic"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              
              {/* Texto */}
              <div className="order-1 md:order-2 bg-card border border-border rounded-2xl p-8 md:p-12">
                <blockquote className="testimonial-quote mb-6">
                  "Guardamos aquilo que é importante. Protegemos aquilo que é íntimo. 
                  Acreditamos que a entrega certa pode mudar o dia — ou até a vida — de quem a recebe."
                </blockquote>
                <p className="slogan">
                  — Porque o amor, quando guardado com cuidado, chega sempre na hora certa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
