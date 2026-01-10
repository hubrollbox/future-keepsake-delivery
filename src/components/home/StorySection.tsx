import { Heart, Clock, Star } from "lucide-react";
import capsulaImage from "@/assets/capsula-escrita.jpg";
import ruaPalacioImage from "@/assets/rua-palacio.jpg";
import fachadaAzulejosImage from "@/assets/fachada-azulejos.jpg";
import { motion, Variants } from "framer-motion";

const StorySection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm relative overflow-hidden">
      {/* Background decorativo - mobile fix */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <img 
          src={ruaPalacioImage} 
          alt="" 
          className="absolute top-0 left-0 w-full h-full object-cover grayscale"
          style={{ minWidth: '100%', minHeight: '100%', width: '100%', height: '100%' }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="section-tagline">A nossa filosofia</p>
            <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
              Porque Há Coisas Que Só Fazem Sentido<br />
              <span className="text-primary">No Momento Certo</span>
            </h2>
            <p className="hero-subtitle text-muted-foreground max-w-3xl mx-auto">
              Vivemos num mundo acelerado, onde tudo é imediato — mas há palavras que precisam de amadurecer, 
              de esperar pelo momento perfeito para florescer.
            </p>
          </motion.div>

          {/* Story Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="bg-card border border-border rounded-2xl p-8 text-center group hover:shadow-keepla hover:scale-105 transition-all duration-300"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-semibold text-foreground mb-4">Poesia nas Memórias</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                Cada mensagem é um verso guardado no tempo, esperando o momento perfeito para tocar o coração de quem a recebe.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card border border-border rounded-2xl p-8 text-center group hover:shadow-keepla hover:scale-105 transition-all duration-300"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-semibold text-foreground mb-4">Afeto Atemporal</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                O amor não conhece fronteiras temporais. Guardamos os gestos mais íntimos para que floresçam quando mais são precisos.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card border border-border rounded-2xl p-8 text-center group hover:shadow-keepla hover:scale-105 transition-all duration-300"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-semibold text-foreground mb-4">Contemplação do Futuro</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                Cada entrega é uma ponte entre o presente e o futuro, criada com a sensibilidade de quem compreende o valor do tempo.
              </p>
            </motion.div>
          </motion.div>

          {/* Quote com imagem */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* Imagem 1 - Cápsula */}
              <motion.div 
                className="hidden md:block"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-keepla-intense">
                  <img 
                    src={fachadaAzulejosImage} 
                    alt="Fachada portuguesa com azulejos tradicionais" 
                    className="absolute top-0 left-0 w-full h-full object-cover image-bw-dramatic"
                    style={{ minWidth: '100%', minHeight: '100%', width: '100%', height: '100%' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </motion.div>
              
              {/* Texto central */}
              <motion.div 
                className="md:col-span-1 bg-card border border-border rounded-2xl p-8 md:p-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              >
                <blockquote className="testimonial-quote mb-6">
                  "Guardamos aquilo que é importante. Protegemos aquilo que é íntimo. 
                  Acreditamos que a entrega certa pode mudar o dia — ou até a vida — de quem a recebe."
                </blockquote>
                <p className="slogan">
                  — Porque o amor, quando guardado com cuidado, chega sempre na hora certa.
                </p>
              </motion.div>

              {/* Imagem 2 - Cápsula escrita */}
              <motion.div 
                className="hidden md:block"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-keepla-intense">
                  <img 
                    src={capsulaImage} 
                    alt="Pessoa a escrever memórias num parque" 
                    className="absolute top-0 left-0 w-full h-full object-cover image-bw-dramatic"
                    style={{ minWidth: '100%', minHeight: '100%', width: '100%', height: '100%' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;