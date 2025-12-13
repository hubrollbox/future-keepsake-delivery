import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HowItWorksHero from "@/components/how-it-works/HowItWorksHero";
import GamificationSystem from "@/components/how-it-works/GamificationSystem";
import DeliveryTypesDetailed from "@/components/how-it-works/DeliveryTypesDetailed";
import HowItWorksFAQ from "@/components/how-it-works/HowItWorksFAQ";
import SecurityGuarantees from "@/components/how-it-works/SecurityGuarantees";
import HowItWorksCTA from "@/components/how-it-works/HowItWorksCTA";
import SEOHead from "@/components/SEOHead";
import { motion, Variants } from "framer-motion";

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
      <motion.main 
        className={`container mx-auto px-4 py-8 md:py-16 transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <HowItWorksHero />
        </motion.div>
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
