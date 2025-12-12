import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-8 md:py-24 bg-muted relative" aria-label="Convite final para criar conta no keepla">
      {/* Detalhe decorativo suave com gradiente vermelho */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="w-3/4 h-24 md:h-52 bg-primary/10 blur-3xl rounded-full absolute left-1/2 top-0 -translate-x-1/2" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            className="flex justify-center mb-5 md:mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img 
              src="/keepla-logo-red.png" 
              alt="keepla Logo" 
              width={100} 
              height={100} 
              className="drop-shadow-lg" 
              aria-label="Logo" 
              loading="eager" 
              decoding="async" 
              onError={(e) => { e.currentTarget.src = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png'; }}
            />
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-inter font-bold mb-2 md:mb-4 leading-tight text-foreground"
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
            className="slogan mb-3 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Presente no futuro
          </motion.p>
          
          <motion.p 
            className="hero-subtitle text-muted-foreground mb-4 md:mb-8 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Junta-te aos nossos <span className="text-primary font-semibold">primeiros utilizadores</span> que já estão a criar memórias para o futuro. 
            Começa gratuitamente e descobre a magia de receber algo especial no momento perfeito.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center mb-7 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <Button 
              size="lg" 
              className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[56px] group bg-primary hover:bg-secondary text-primary-foreground font-inter font-semibold shadow-keepla hover:shadow-keepla-intense hover:scale-105 transition-all duration-200"
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
              className="px-8 py-5 text-base md:text-lg min-h-[48px] md:min-h-[56px] bg-background border-2 border-foreground text-foreground hover:bg-foreground/10 font-inter font-semibold transition-all duration-200"
              onClick={() => handleNavigation('/contact')}
              aria-label="Falar com o suporte da keepla"
            >
              Falar Connosco
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center text-muted-foreground"
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
