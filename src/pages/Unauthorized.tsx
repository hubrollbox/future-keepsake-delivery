import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <SEOHead
        title="Acesso não autorizado"
        description="Não tens permissão para aceder a esta página."
      />
      <div className="max-w-md text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Erro 403
        </p>
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display',Georgia,serif] text-foreground">
          Acesso não autorizado
        </h1>
        <p className="text-muted-foreground font-inter">
          Esta área é restrita. Se acreditas que se trata de um engano, contacta a equipa keepla.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="brand">
            <Link to="/">Voltar ao início</Link>
          </Button>
          <Button asChild variant="brand-outline">
            <Link to="/contact">Contactar suporte</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
