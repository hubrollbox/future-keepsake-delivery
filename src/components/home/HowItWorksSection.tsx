import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Package, Heart, Mail } from "lucide-react";
import bicicletaImage from "@/assets/bicicleta-marginal.jpg";
import { motion, Variants } from "framer-motion";

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Heart,
      title: "Escolhe o Momento",
      description: "Define quando queres que a tua mensagem ou presente seja entregue. Pode ser daqui a dias, meses ou anos."
    },
    {
      icon: Mail,
      title: "Cria a Tua Mensagem",
      description: "Escreve cartas, grava vídeos, ou escolhe um presente físico para guardar até ao momento perfeito."
    },
    {
      icon: Package,
      title: "Guardamos com Segurança",
      description: "As tuas memórias ficam protegidas nos nossos sistemas seguros ou armazém climatizado."
    },
    {
      icon: Clock,
      title: "Entregamos na Hora Certa",
      description: "No momento exato que definiste, a tua mensagem ou presente será entregue como prometido."
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
    <section className="py-20 md:py-28 bg-white/80 backdrop-blur-sm relative overflow-hidden">
      {/* Imagem de fundo subtil - mobile fix */}
      <div className="absolute right-0 top-1/4 w-1/3 h-1/2 opacity-10 hidden lg:block overflow-hidden">
        <img 
          src={bicicletaImage} 
          alt="" 
          className="absolute top-0 left-0 w-full h-full object-cover grayscale rounded-l-3xl"
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
            <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
              Como <span className="text-primary">Funciona</span>
            </h2>
            <p className="hero-subtitle text-muted-foreground max-w-3xl mx-auto">
              Em apenas quatro passos simples, podes criar uma experiência inesquecível para o futuro.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => (
              <motion.div key={index} className="text-center group" variants={itemVariants}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-inter font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-georgia italic">{step.description}</p>
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
                Pronto para Começar?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed font-georgia italic">
                Cria a tua primeira entrega temporal em menos de 5 minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-secondary text-primary-foreground group"
                  onClick={() => navigate('/register')}
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary text-primary hover:bg-primary/10"
                  onClick={() => navigate('/how-it-works')}
                >
                  Saber Mais
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
