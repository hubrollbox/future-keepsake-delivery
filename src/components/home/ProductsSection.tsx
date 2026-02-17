import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Package, Clock, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

const ProductsSection = () => {
  const navigate = useNavigate();

  const products = [
    {
      icon: Mail,
      title: "Mensagens Digitais",
      subtitle: "Cartas do Coração",
      description: "Escreve cartas, grava vídeos ou envia ficheiros que só serão revelados no momento perfeito. Ideal para declarações de amor, conselhos para o futuro ou memórias especiais.",
      features: ["Vídeos e áudios", "Documentos e fotos", "Encriptação total", "Entrega garantida"],
      price: "Grátis",
      highlight: false
    },
    {
      icon: Package,
      title: "Presentes Físicos",
      subtitle: "Presentes com Alma",
      description: "Guarda presentes físicos no nosso armazém seguro até à data de entrega. Perfeito para aniversários especiais, formaturas ou marcos importantes da vida.",
      features: ["Armazenamento seguro", "Controlo climático", "Seguro incluído", "Entrega na data exata"],
      price: "Desde 1,90€/mês",
      highlight: true
    },
    {
      icon: Clock,
      title: "Cápsulas do Tempo",
      subtitle: "Experiências Completas",
      description: "Combina mensagens digitais e presentes físicos numa experiência única. Cria verdadeiras cápsulas do tempo para momentos extraordinários.",
      features: ["Digital + Físico", "Experiência personalizada", "Múltiplas entregas", "Apoio dedicado"],
      price: "Personalizado",
      highlight: false
    }
  ];

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
    <section className="py-12 sm:py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4 sm:mb-6">
              Os Nossos <span className="text-primary">Presentes com Alma</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Cada produto foi pensado para criar momentos únicos e inesquecíveis. 
              Escolhe a forma perfeita de enviar o teu amor através do tempo.
            </p>
          </motion.div>

          {/* Products Grid */}
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {products.map((product, index) => (
              <motion.div 
                key={index} 
                className={`bg-card border rounded-2xl p-5 sm:p-8 h-full flex flex-col relative ${
                  product.highlight 
                    ? 'border-2 border-primary shadow-keepla sm:scale-105' 
                    : 'border-border'
                } hover:shadow-keepla hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group`}
                variants={itemVariants}
              >
                {product.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <product.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-inter font-bold text-foreground mb-2">{product.title}</h3>
                  <p className="text-primary font-georgia italic">{product.subtitle}</p>
                </div>

                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-inter font-bold text-primary mb-6">{product.price}</p>
                  <Button 
                    className={`w-full group ${product.highlight ? 'bg-primary hover:bg-secondary text-primary-foreground' : 'bg-background border-2 border-primary text-primary hover:bg-primary/10'}`}
                    onClick={() => navigate('/register')}
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="bg-card border border-border rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-inter font-semibold text-foreground mb-4">
                Não Sabes Qual Escolher?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed font-georgia italic">
                A nossa equipa está aqui para te ajudar a criar a experiência perfeita para o teu momento especial.
              </p>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary/10"
                onClick={() => navigate('/contact')}
              >
                Falar com a Nossa Equipa
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
