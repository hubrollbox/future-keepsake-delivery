import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
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

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Contacto"
        description="Entra em contacto com a equipa Keepla. Estamos aqui para ajudar com as tuas questões sobre memórias, entregas e planos."
        keywords="contacto keepla, suporte, ajuda, falar connosco"
      />
      <Navigation />

      <motion.main 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <ContactHero />
        </motion.div>

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
