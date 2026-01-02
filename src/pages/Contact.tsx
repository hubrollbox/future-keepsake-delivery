import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import SEOHead from "@/components/SEOHead";
import { motion, Variants } from "framer-motion";
import cartaImage from "@/assets/carta-escrita.jpg";

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

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Contacto"
        description="Entra em contacto com a equipa Keepla. Estamos aqui para ajudar com as tuas questões sobre memórias, entregas e planos."
        keywords="contacto keepla, suporte, ajuda, falar connosco"
      />
      <Navigation />

      {/* Hero com fundo fotográfico */}
      <section className="relative min-h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src={cartaImage} 
            alt="Mãos a segurar uma carta" 
            className="w-full h-full object-cover grayscale contrast-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60" />
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
              alt="Logo" 
              width={64} 
              height={64} 
              className="drop-shadow-lg" 
              loading="eager" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/keepla-logo-red.png'; }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-inter font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fala <span className="text-primary font-georgia italic">Connosco</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Estamos aqui para te ajudar a criar memórias eternas
          </motion.p>
        </motion.div>
      </section>

      <motion.main 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          variants={itemVariants}
        >
          <ContactForm />
          <ContactInfo />
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Contact;
