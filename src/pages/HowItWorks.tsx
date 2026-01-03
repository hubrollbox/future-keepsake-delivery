import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GamificationSystem from "@/components/how-it-works/GamificationSystem";
import DeliveryTypesDetailed from "@/components/how-it-works/DeliveryTypesDetailed";
import HowItWorksFAQ from "@/components/how-it-works/HowItWorksFAQ";
import SecurityGuarantees from "@/components/how-it-works/SecurityGuarantees";
import HowItWorksCTA from "@/components/how-it-works/HowItWorksCTA";
import SEOHead from "@/components/SEOHead";
import { motion, Variants } from "framer-motion";
import capsulaImage from "@/assets/capsula-escrita.jpg";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const HowItWorks = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Como Funciona"
        description="Descobre como a Keepla funciona: cria keepsakes, agenda entregas e surpreende quem amas no momento certo."
        keywords="como funciona keepla, criar keepsake, agendar entrega, cápsula tempo"
      />
      <Navigation />

      {/* Hero com fundo fotográfico - ajustado para cobrir o header */}
      <section className="relative min-h-[60vh] flex items-center justify-center -mt-20 pt-20">
        <div className="absolute inset-0">
          <img 
            src={capsulaImage} 
            alt="Pessoa a escrever memórias" 
            className="w-full h-full object-cover object-center grayscale contrast-110"
            style={{ minWidth: '100%', minHeight: '100%' }}
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
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img 
              src="/keepla-logo-white.png" 
              alt="keepla Logo" 
              style={{width: 80, height: 80}} 
              loading="eager"
              decoding="async"
              onError={(e) => { e.currentTarget.src = '/keepla-logo-red.png'; }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-inter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Como funciona a{" "}
            <span className="text-primary block md:inline font-georgia italic"> keepla</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-primary font-georgia italic mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            "Transformamos momentos em memórias eternas, 
            entregues no momento perfeito."
          </motion.p>
          
          <motion.p 
            className="text-lg text-white/80 font-inter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Somos o teu <strong className="text-primary">Guardião do Tempo</strong>.
          </motion.p>
        </motion.div>
      </section>

      <motion.main 
        className={`container mx-auto px-4 py-16 transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <GamificationSystem />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DeliveryTypesDetailed />
        </motion.div>
        <motion.div variants={itemVariants}>
          <HowItWorksFAQ />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SecurityGuarantees />
        </motion.div>
        <motion.div variants={itemVariants}>
          <HowItWorksCTA onNavigate={handleNavigation} />
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
