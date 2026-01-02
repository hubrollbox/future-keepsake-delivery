import { Button } from "@/components/ui/button";
import { Heart, Star, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion, Variants } from "framer-motion";
import maoBebe from "@/assets/mao-bebe.jpg";
import ruaPalacioImage from "@/assets/rua-palacio.jpg";
import capsulaImage from "@/assets/capsula-escrita.jpg";

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
      transition: { staggerChildren: 0.15 }
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
        description="Conhece a Keepla: uma plataforma dedicada à preservação de memória, sensibilidade e presença."
        keywords="sobre keepla, missão keepla, valores, memórias, cápsula tempo portugal"
      />
      <Navigation />

      {/* Hero com fundo fotográfico */}
      <section className="relative min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src={ruaPalacioImage} 
            alt="Rua de Lisboa - herança e memória" 
            className="w-full h-full object-cover grayscale contrast-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img 
              src="/keepla-logo-white.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="drop-shadow-lg" 
              loading="eager" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/keepla-logo-red.png'; }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-inter font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Somos a{" "}
            <span className="text-primary block font-georgia italic">keepla</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Uma plataforma dedicada à preservação de{" "}
            <span className="text-primary font-semibold">memória, sensibilidade e presença.</span>
          </motion.p>
        </motion.div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Missão */}
        <motion.div 
          className="max-w-4xl mx-auto mb-20 p-12 bg-card border border-border rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-4 text-center">A nossa promessa</p>
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-6 text-center">
            A Nossa Missão
          </h2>
          <blockquote className="text-xl md:text-2xl text-muted-foreground font-georgia italic text-center mb-6 leading-relaxed">
            "Acreditamos que há momentos que merecem ser guardados com o cuidado de quem sabe 
            que o tempo é o nosso bem mais precioso."
          </blockquote>
          <p className="text-primary font-semibold text-center">
            — Equipa keepla
          </p>
        </motion.div>

        {/* Secção Emocional com Imagem */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Imagem */}
            <div className="order-2 md:order-1">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={maoBebe} 
                  alt="Mão de bebé sobre mão de adulto - símbolo de conexão entre gerações" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
            
            {/* Texto */}
            <div className="order-1 md:order-2">
              <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-4">O que nos inspira</p>
              <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-6">
                Ligações que Atravessam o Tempo
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-inter">
                Uma mão pequena que segura a nossa. Um gesto simples que contém todo o amor do mundo. 
                São estes momentos — frágeis, irrepetíveis — que merecem ser guardados para sempre.
              </p>
              <blockquote className="text-xl text-foreground font-georgia italic border-l-4 border-primary pl-6">
                "Guardamos hoje o que o coração quer dizer amanhã."
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* Segunda Secção com Foto */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Texto */}
            <div>
              <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-4">A magia do tempo</p>
              <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-6">
                Escrever é Preservar
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-inter">
                Num mundo onde tudo passa depressa demais, parar para escrever uma mensagem 
                é um ato revolucionário de amor. Cada palavra que guardas é uma semente 
                plantada no futuro.
              </p>
              <blockquote className="text-xl text-foreground font-georgia italic border-l-4 border-primary pl-6">
                "As palavras escritas com o coração têm o poder de atravessar o tempo."
              </blockquote>
            </div>
            
            {/* Imagem */}
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={capsulaImage} 
                  alt="Pessoa a escrever memórias" 
                  className="w-full h-full object-cover grayscale contrast-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Valores */}
        <motion.div 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.p className="text-sm uppercase tracking-wider text-primary font-semibold mb-4 text-center" variants={itemVariants}>O que nos move</motion.p>
          <motion.h2 
            className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-12 text-center"
            variants={itemVariants}
          >
            A Nossa Essência
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="bg-card border border-border rounded-2xl text-center p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-inter font-semibold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-georgia italic">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Final com fundo escuro */}
        <motion.section 
          className="py-16 bg-foreground text-background rounded-2xl max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center px-8">
            <p className="text-primary font-georgia italic mb-4">
              A tua história começa aqui
            </p>
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-background mb-6">
              Quer Fazer Parte da Nossa História?
            </h2>
            <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
              Junta-te à nossa comunidade e ajuda-nos a continuar a criar 
              momentos mágicos para milhares de pessoas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => handleNavigation('/register')}
                className="px-8 py-6 text-lg group bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleNavigation('/contact')}
                className="px-8 py-6 text-lg bg-transparent border-2 border-background text-background hover:bg-background/10 font-inter font-semibold transition-all duration-200"
              >
                Falar Connosco
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
