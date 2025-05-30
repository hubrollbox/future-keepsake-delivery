
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const navigate = useNavigate();

  return (
    <header className={`container mx-auto px-4 py-6 flex justify-between items-center ${className || ""}`}>
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <Clock className="h-8 w-8 text-amber-700" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
          FuturoPresente
        </h1>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Button variant="ghost" onClick={() => navigate('/how-it-works')}>
          Como Funciona
        </Button>
        <Button variant="ghost" onClick={() => navigate('/pricing')}>
          Preços
        </Button>
        <Button variant="ghost" onClick={() => navigate('/about')}>
          Sobre
        </Button>
        <Button variant="ghost" onClick={() => navigate('/contact')}>
          Contactos
        </Button>
        <Button variant="ghost" onClick={() => navigate('/partnerships')}>
          Parcerias
        </Button>
      </nav>
      <div className="space-x-4">
        <Button variant="ghost" onClick={() => navigate('/login')}>
          Entrar
        </Button>
        <Button 
          onClick={() => navigate('/register')}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
        >
          Registar
        </Button>
      </div>
    </header>
  );
};

export default Navigation;
