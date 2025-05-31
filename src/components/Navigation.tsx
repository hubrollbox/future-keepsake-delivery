
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const navigate = useNavigate();

  return (
    <header className={`container mx-auto px-4 py-6 flex justify-between items-center bg-white ${className || ""}`}>
      <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
        <Clock className="h-8 w-8 text-gold" />
        <h1 className="text-2xl font-bold text-black">
          FuturoPresente
        </h1>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Button variant="ghost" onClick={() => navigate('/how-it-works')} className="text-black hover-gold">
          Como Funciona
        </Button>
        <Button variant="ghost" onClick={() => navigate('/pricing')} className="text-black hover-gold">
          Preços
        </Button>
        <Button variant="ghost" onClick={() => navigate('/about')} className="text-black hover-gold">
          Sobre Nós
        </Button>
        <Button variant="ghost" onClick={() => navigate('/contact')} className="text-black hover-gold">
          Contactos
        </Button>
        <Button variant="ghost" onClick={() => navigate('/partnerships')} className="text-black hover-gold">
          Parcerias
        </Button>
      </nav>
      <div className="space-x-4">
        <Button variant="ghost" onClick={() => navigate('/login')} className="text-black hover-gold">
          Entrar
        </Button>
        <Button 
          onClick={() => navigate('/register')}
          className="bg-gold-gradient text-black hover:opacity-90 font-semibold"
        >
          Começar Grátis
        </Button>
      </div>
    </header>
  );
};

export default Navigation;
