import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import noivosCasamentoImage from "@/assets/noivos-casamento.jpg";

const FinalCTA = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section className="relative py-14 sm:py-20 md:py-32 overflow-hidden" aria-label="Convite final para criar conta no keepla">
      {/* Background fotográfico - mobile fix com foco nos noivos */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={noivosCasamentoImage} 
          alt="Noivos num momento de felicidade" 
          className="absolute top-0 left-0 w-full h-full object-cover object-[center_30%] md:object-center grayscale contrast-110"
          style={{ minWidth: '100%', minHeight: '100%', width: '100%', height: '100%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img 
              src="/keepla-logo-white.png" 
              alt="keepla Logo" 
              width={100} 
              height={100} 
              className="drop-shadow-lg" 
              loading="lazy" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/keepla-logo-red.png'; }}
            />
          </motion.div>
          
          <motion.h2 
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            Pronto para a Tua Primeira<br />
            <span className="text-primary font-georgia italic">
              Viagem no Tempo?
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-xl md:text-2xl font-georgia italic text-white/80 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Presente no futuro
          </motion.p>
          
          <motion.p 
            className="text-sm sm:text-lg text-white/70 mb-8 sm:mb-10 mx-auto max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Junta-te aos nossos <span className="text-primary font-semibold">primeiros utilizadores</span> que já estão a criar memórias para o futuro. 
            Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <Button 
              size="lg" 
              className="cta w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg group bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              onClick={() => handleNavigation('/register')}
              aria-label="Criar conta gratuitamente"
            >
              <Heart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Começar Grátis Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-transparent border-2 border-white text-white hover:bg-white/10 font-inter font-semibold transition-all duration-200"
              onClick={() => handleNavigation('/contact')}
              aria-label="Falar com o suporte da keepla"
            >
              Falar Connosco
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center text-white/70 text-xs sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" aria-label="Ícone garantia" />
              <span className="font-inter">Sem compromissos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" aria-label="Ícone garantia" />
              <span className="font-inter">Cancelamento a qualquer momento</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" aria-label="Ícone garantia" />
              <span className="font-inter">Suporte português</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
