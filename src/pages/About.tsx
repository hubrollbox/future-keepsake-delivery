import { Button } from "@/components/ui/button";
import { Heart, Star, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PhotoBackground from "@/components/layout/PhotoBackground";
import SectionWithPhoto from "@/components/layout/SectionWithPhoto";
import { motion, Variants } from "framer-motion";
import maoBebe from "@/assets/mao-bebe.jpg";
import ruaPalacioImage from "@/assets/rua-palacio.jpg";
import capsulaImage from "@/assets/capsula-escrita.jpg";
import casalAntigoImage from "@/assets/casal-antigo.jpg";

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
    <div className="min-h-screen bg-keepla-black">
      <SEOHead 
        title="Sobre Nós"
        description="Conhece a Keepla: uma plataforma dedicada à preservação de memória, sensibilidade e presença."
        keywords="sobre keepla, missão keepla, valores, memórias, cápsula tempo portugal"
      />
      <Navigation />

      {/* Hero com fundo fotográfico */}
      <PhotoBackground 
        image={ruaPalacioImage} 
        alt="Rua de Lisboa - herança e memória"
        overlay="gradient"
        className="min-h-[60vh] flex items-center"
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
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
          
          <motion.p 
            className="text-keepla-white/70 font-georgia italic text-lg mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Uma plataforma dedicada à preservação de memória
          </motion.p>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-inter font-bold text-keepla-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Somos a{" "}
            <span className="text-keepla-red font-georgia italic">keepla</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-keepla-white/80 max-w-2xl mx-auto font-inter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Dedicados à preservação de{" "}
            <span className="text-keepla-red font-semibold">memória, sensibilidade e presença.</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="mt-8 text-keepla-white hover:text-keepla-red hover:bg-keepla-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Voltar ao Início</span>
            </Button>
          </motion.div>
        </div>
      </PhotoBackground>

      <main className="bg-keepla-white">
        <div className="container mx-auto px-4 py-16">
          {/* Missão */}
          <motion.div 
            className="max-w-4xl mx-auto mb-20 p-12 bg-card border border-border rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm uppercase tracking-wider text-keepla-red font-semibold mb-4 text-center">A nossa promessa</p>
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-6 text-center">
              A Nossa Missão
            </h2>
            <blockquote className="text-xl md:text-2xl text-muted-foreground font-georgia italic text-center mb-6 leading-relaxed">
              "Acreditamos que há momentos que merecem ser guardados com o cuidado de quem sabe 
              que o tempo é o nosso bem mais precioso."
            </blockquote>
            <p className="text-keepla-red font-semibold text-center">
              — Equipa keepla
            </p>
          </motion.div>

          {/* Secção com Foto - Conexões */}
          <motion.div 
            className="mb-20 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <SectionWithPhoto 
              image={maoBebe} 
              alt="Mão de bebé sobre mão de adulto"
              imagePosition="left"
              grayscale={false}
            >
              <p className="text-sm uppercase tracking-wider text-keepla-red font-semibold mb-4">O que nos inspira</p>
              <h2 className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-6">
                Ligações que Atravessam o Tempo
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-inter">
                Uma mão pequena que segura a nossa. Um gesto simples que contém todo o amor do mundo. 
                São estes momentos — frágeis, irrepetíveis — que merecem ser guardados para sempre.
              </p>
              <blockquote className="text-xl text-keepla-black font-georgia italic border-l-4 border-keepla-red pl-6">
                "Guardamos hoje o que o coração quer dizer amanhã."
              </blockquote>
            </SectionWithPhoto>
          </motion.div>

          {/* Secção com Foto - Casal Antigo */}
          <motion.div 
            className="mb-20 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <SectionWithPhoto 
              image={casalAntigoImage} 
              alt="Casal antigo - amor que atravessa o tempo"
              imagePosition="right"
              grayscale={true}
            >
              <p className="text-sm uppercase tracking-wider text-keepla-red font-semibold mb-4">Histórias que perduram</p>
              <h2 className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-6">
                O Amor Não Tem Prazo
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-inter">
                As fotografias amareladas dos nossos avós contam histórias que o tempo não apagou. 
                Queremos que as tuas memórias também atravessem gerações.
              </p>
              <blockquote className="text-xl text-keepla-black font-georgia italic border-l-4 border-keepla-red pl-6">
                "O que guardas com amor, vive para sempre."
              </blockquote>
            </SectionWithPhoto>
          </motion.div>

          {/* Segunda Secção com Foto */}
          <motion.div 
            className="mb-20 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <SectionWithPhoto 
              image={capsulaImage} 
              alt="Pessoa a escrever memórias"
              imagePosition="left"
            >
              <p className="text-sm uppercase tracking-wider text-keepla-red font-semibold mb-4">A magia do tempo</p>
              <h2 className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-6">
                Escrever é Preservar
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-inter">
                Num mundo onde tudo passa depressa demais, parar para escrever uma mensagem 
                é um ato revolucionário de amor. Cada palavra que guardas é uma semente 
                plantada no futuro.
              </p>
              <blockquote className="text-xl text-keepla-black font-georgia italic border-l-4 border-keepla-red pl-6">
                "As palavras escritas com o coração têm o poder de atravessar o tempo."
              </blockquote>
            </SectionWithPhoto>
          </motion.div>

          {/* Valores */}
          <motion.div 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.p className="text-sm uppercase tracking-wider text-keepla-red font-semibold mb-4 text-center" variants={itemVariants}>O que nos move</motion.p>
            <motion.h2 
              className="text-3xl md:text-4xl font-inter font-bold text-keepla-black mb-12 text-center"
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
                  <div className="w-16 h-16 bg-keepla-red/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-keepla-red/20 transition-colors">
                    <value.icon className="h-8 w-8 text-keepla-red" />
                  </div>
                  <h3 className="text-xl font-inter font-semibold text-keepla-black mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-georgia italic">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA Final */}
          <motion.section 
            className="py-16 bg-keepla-black rounded-2xl max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center px-8">
              <p className="text-keepla-red font-georgia italic mb-4">
                A tua história começa aqui
              </p>
              <h2 className="text-3xl md:text-4xl font-inter font-bold text-keepla-white mb-6">
                Quer Fazer Parte da Nossa História?
              </h2>
              <p className="text-xl text-keepla-white/80 mb-8 max-w-2xl mx-auto">
                Junta-te à nossa comunidade e ajuda-nos a continuar a criar 
                momentos mágicos para milhares de pessoas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleNavigation('/register')}
                  className="px-8 py-6 text-lg group bg-keepla-red hover:bg-keepla-red/90 text-keepla-white font-inter font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => handleNavigation('/contact')}
                  className="px-8 py-6 text-lg bg-transparent border-2 border-keepla-white text-keepla-white hover:bg-keepla-white/10 font-inter font-semibold transition-all duration-200"
                >
                  Falar Connosco
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
