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
import PhotoBackground from "@/components/layout/PhotoBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-keepla-black">
      <SEOHead 
        title="Como Funciona"
        description="Descobre como a Keepla funciona: cria keepsakes, agenda entregas e surpreende quem amas no momento certo."
        keywords="como funciona keepla, criar keepsake, agendar entrega, cápsula tempo"
      />
      <Navigation />

      {/* Hero com fundo fotográfico */}
      <PhotoBackground 
        image={capsulaImage} 
        alt="Pessoa a escrever memórias"
        overlay="gradient"
        className="min-h-[60vh] flex items-center"
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
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
          
          <motion.p 
            className="text-keepla-white/70 font-georgia italic text-lg mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            "Transformamos momentos em memórias eternas"
          </motion.p>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-inter font-bold text-keepla-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Como funciona a{" "}
            <span className="text-keepla-red font-georgia italic">keepla</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-keepla-white/80 max-w-2xl mx-auto font-inter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Somos o teu <strong className="text-keepla-red">Guardião do Tempo</strong>.
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

      <motion.main 
        className={`bg-keepla-white transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 py-16">
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
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
