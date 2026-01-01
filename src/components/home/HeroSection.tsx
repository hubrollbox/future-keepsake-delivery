import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/carta-escrita.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image visível com filtro ligeiro */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Mãos a segurar uma carta – memória Keepla" 
          className="w-full h-full object-cover opacity-90 contrast-110 brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/25"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo Keepla oficial */}
          <motion.div 
            className="mb-8 mt-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img 
               src="/keepla-logo-white.png?v=3" 
               alt="Keepla" 
               className="mx-auto w-28 h-28 object-contain"
               loading="eager"
               decoding="async"
               onError={(e) => { e.currentTarget.src = '/keepla-logo-white.png'; }}
            />
          </motion.div>

          {/* Main headline - Inter Bold */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight font-inter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Presente no
            <span className="block text-primary font-georgia italic">Futuro</span>
          </motion.h1>

          {/* Subtitle - Georgia Emotivo */}
          <motion.p 
            className="hero-subtitle text-white drop-shadow-md mb-8 mx-auto font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            Cria cápsulas do tempo que guardam as tuas palavras, emoções e memórias para serem entregues no momento perfeito.
          </motion.p>

          {/* Value proposition - Georgia Slogan */}
          <motion.div 
            className="mb-12 text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <p className="slogan text-white font-medium drop-shadow-md">
              "Uma carta para o futuro é uma ponte entre quem somos hoje e quem seremos amanhã."
            </p>
          </motion.div>

          {/* CTA Buttons - Identidade Keepla */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <Button 
              onClick={handleStartJourney}
              size="lg" 
              className="text-lg px-8 py-6 bg-keepla-red hover:bg-keepla-red/90 text-keepla-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg font-semibold"
            >
              {user ? "Ir para Dashboard" : "Começar a minha jornada"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-2 border-keepla-white text-keepla-white bg-transparent hover:bg-keepla-white/20 hover:text-keepla-white transition-all duration-300 rounded-lg font-semibold"
              onClick={() => navigate("/how-it-works")}
            >
              Como funciona
            </Button>
          </motion.div>

          {/* Social proof - Minimalista */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-keepla-red rounded-full"></span>
              <span>Entregas seguras</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-keepla-red rounded-full"></span>
              <span>Memórias preservadas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-keepla-red rounded-full"></span>
              <span>Momentos eternizados</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - Keepla Red */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
      >
        <div className="w-6 h-10 border-2 border-keepla-red rounded-full flex justify-center">
          <div className="w-1 h-3 bg-keepla-red rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
