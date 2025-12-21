import { Button } from "@/components/ui/button";
import { Heart, Star, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion, Variants } from "framer-motion";

const About = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const values = [
    {
      icon: Heart,
      title: "Poesia nas Memórias",
      description: "Cada mensagem é um verso guardado no tempo, esperando o momento perfeito para tocar o coração de quem a recebe."
    },
    {
      icon: BookOpen,
      title: "Afeto Atemporal",
      description: "O amor não conhece fronteiras temporais. Guardamos os gestos mais íntimos para que floresçam quando mais são precisos."
    },
    {
      icon: Star,
      title: "Contemplação do Futuro",
      description: "Cada entrega é uma promessa ao futuro, criada com a sensibilidade de quem compreende o valor do tempo."
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
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Sobre Nós"
        description="Conhece a Keepla: uma plataforma dedicada à preservação de memória, sensibilidade e presença. Descobre a nossa missão e valores."
        keywords="sobre keepla, missão keepla, valores, memórias, cápsula tempo portugal"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img 
              src="/keepla-logo-red.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="drop-shadow-sm" 
              loading="eager" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png'; }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-inter font-bold text-keepla-black mb-6 leading-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Somos a{" "}
            <span className="text-keepla-red block font-georgia italic">keepla</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Uma plataforma dedicada à preservação de{" "}
            <span className="text-keepla-red font-semibold">memória, sensibilidade e presença.</span>
          </motion.p>
        </motion.div>

        {/* Missão */}
        <motion.div 
          className="emotion-card max-w-4xl mx-auto mb-16 p-12 bg-card border border-border rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="section-tagline text-center">A nossa promessa</p>
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-6 text-center">
            A Nossa Missão
          </h2>
          <blockquote className="testimonial-quote text-center mb-6">
            "Acreditamos que há momentos que merecem ser guardados com o cuidado de quem sabe 
            que o tempo é o nosso bem mais precioso."
          </blockquote>
          <p className="slogan text-center">
            — Equipa keepla
          </p>
        </motion.div>

        {/* Valores */}
        <motion.div 
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.p className="section-tagline text-center" variants={itemVariants}>O que nos move</motion.p>
          <motion.h2 
            className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-8 text-center"
            variants={itemVariants}
          >
            A Nossa Essência
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="bg-card border border-border rounded-2xl text-center p-8 hover:shadow-keepla hover:scale-105 transition-all duration-300 group"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-keepla-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-keepla-red/20 transition-colors">
                  <value.icon className="h-8 w-8 text-keepla-red" />
                </div>
                <h3 className="text-xl font-inter font-semibold text-keepla-black mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-georgia italic">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Conceito Selo do Tempo */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="bg-card border border-border rounded-2xl p-12 max-w-5xl mx-auto text-center">
            <img 
              src="/keepla-logo-red.png" 
              alt="Logo" 
              style={{width: 80, height: 80, margin: '0 auto 2rem auto'}} 
              loading="eager" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png'; }}
            />
            <p className="section-tagline">A nossa identidade</p>
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-6">
              Conceito: Selo do Tempo
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              O conceito "Selo do Tempo" foi inspirado em carimbos postais e marcações temporais, 
              evocando a ideia de autenticidade e oficialidade de uma correspondência especial. 
              O selo circular com marcações de tempo simboliza a validação da mensagem para o futuro.
            </p>
            <div className="bg-muted rounded-2xl p-8">
              <blockquote className="testimonial-quote">
                "Cada entrega é uma promessa ao futuro, selada com o carinho do presente."
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* CTA - Consistente com FinalCTA */}
        <motion.section 
          className="py-12 md:py-16 bg-muted relative rounded-2xl max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-3/4 h-24 md:h-52 bg-keepla-red/10 blur-3xl rounded-full absolute left-1/2 top-0 -translate-x-1/2" />
          </div>
          <div className="relative z-10 text-center px-8">
            <motion.p 
              className="slogan mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A tua história começa aqui
            </motion.p>
            <motion.h2 
              className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Quer Fazer Parte da Nossa História?
            </motion.h2>
            <motion.p 
              className="hero-subtitle text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Junta-te à nossa comunidade e ajuda-nos a continuar a criar 
              momentos mágicos para milhares de pessoas.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                onClick={() => handleNavigation('/register')}
                className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[56px] group bg-keepla-red hover:bg-keepla-red/90 text-keepla-white font-inter font-semibold shadow-keepla hover:shadow-keepla-intense hover:scale-105 transition-all duration-200"
              >
                <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleNavigation('/contact')}
                className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[56px] bg-keepla-white border-2 border-keepla-black text-keepla-black hover:bg-keepla-black/10 font-inter font-semibold transition-all duration-200"
              >
                Falar Connosco
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
