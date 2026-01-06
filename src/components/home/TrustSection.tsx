import { Shield, CheckCircle, MapPin } from "lucide-react";
import { motion, Variants } from "framer-motion";
import casalAntigoImage from "@/assets/casal-antigo.jpg";

const TrustSection = () => {
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
    <section className="py-20 md:py-28 bg-muted relative overflow-hidden">
      {/* Background sutil com foto do casal antigo */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={casalAntigoImage} 
          alt="" 
          className="w-full h-full object-cover grayscale"
          loading="lazy"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
              Porque Confiar <span className="text-primary">em Nós?</span>
            </h2>
            <p className="hero-subtitle text-muted-foreground max-w-3xl mx-auto">
              Somos uma empresa <span className="text-primary font-semibold">100% portuguesa</span> focada em preservar as tuas memórias com total segurança.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-keepla hover:scale-105 transition-all duration-300 group"
              variants={itemVariants}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-bold text-foreground mb-4">Segurança Máxima</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                <span className="text-primary font-semibold font-inter not-italic">Instalações monitorizadas 24/7</span>, controlo climático e seguro total contra todos os riscos
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-keepla hover:scale-105 transition-all duration-300 group"
              variants={itemVariants}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-bold text-foreground mb-4">Tecnologia Inovadora</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                Plataforma desenvolvida com as <span className="text-primary font-semibold font-inter not-italic">mais recentes tecnologias</span> para garantir precisão nas entregas
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-keepla hover:scale-105 transition-all duration-300 group"
              variants={itemVariants}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-inter font-bold text-foreground mb-4">Empresa Portuguesa</h3>
              <p className="text-muted-foreground leading-relaxed font-georgia italic">
                Sediada em <span className="text-primary font-semibold font-inter not-italic">Matosinhos</span>, com apoio local dedicado e equipa que fala a tua língua
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
