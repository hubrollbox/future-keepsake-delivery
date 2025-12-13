
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Página Não Encontrada | Keepla"
        description="A página que procura não existe. Volte à página inicial para continuar a preservar as suas memórias."
      />
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="text-center px-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Number */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="text-[12rem] md:text-[16rem] font-bold text-primary/10 leading-none select-none">
              404
            </span>
          </motion.div>

          {/* Emotional Message */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Memória não encontrada
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-georgia italic text-lg md:text-xl text-muted-foreground mb-8 max-w-md mx-auto"
          >
            Esta página perdeu-se no tempo. Mas as suas memórias estão seguras connosco.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Voltar
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="group"
            >
              <Home className="mr-2 h-4 w-4" />
              Página Inicial
            </Button>
          </motion.div>

          {/* Path info */}
          <motion.p
            variants={itemVariants}
            className="mt-12 text-sm text-muted-foreground/60"
          >
            Rota: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;

