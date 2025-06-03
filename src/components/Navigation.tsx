
import { Button } from "@/components/ui/button";
import { Clock, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  return (
    <header className={`container mx-auto px-4 py-4 md:py-6 flex justify-between items-center bg-white ${className || ""}`}>
      <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNavigation('/')}>
        <Clock className="h-6 w-6 md:h-8 md:w-8 text-gold" />
        <h1 className="text-xl md:text-2xl font-bold text-black">
          FuturoPresente
        </h1>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-6">
        <Button variant="ghost" onClick={() => handleNavigation('/products')} className="text-black hover-gold font-medium">
          Produtos
        </Button>
        <Button variant="ghost" onClick={() => handleNavigation('/how-it-works')} className="text-black hover-gold font-medium">
          Como Funciona
        </Button>
        <Button variant="ghost" onClick={() => handleNavigation('/pricing')} className="text-black hover-gold font-medium">
          Preços
        </Button>
        <Button variant="ghost" onClick={() => handleNavigation('/about')} className="text-black hover-gold font-medium">
          Sobre Nós
        </Button>
        <Button variant="ghost" onClick={() => handleNavigation('/contact')} className="text-black hover-gold font-medium">
          Contacto
        </Button>
        <Button variant="ghost" onClick={() => handleNavigation('/partnerships')} className="text-black hover-gold font-medium">
          Parcerias
        </Button>
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="hidden lg:flex space-x-3">
        <Button variant="ghost" onClick={() => handleNavigation('/login')} className="text-black hover-gold font-medium">
          Entrar
        </Button>
        <Button 
          onClick={() => handleNavigation('/register')}
          className="bg-gold-gradient text-black hover:opacity-90 font-semibold px-6 py-2"
        >
          Começar Grátis
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden p-2 text-black hover:text-gold transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gold shadow-lg z-50 lg:hidden">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            <Button variant="ghost" onClick={() => handleNavigation('/products')} className="w-full justify-start text-black hover-gold font-medium">
              Produtos
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/how-it-works')} className="w-full justify-start text-black hover-gold font-medium">
              Como Funciona
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/pricing')} className="w-full justify-start text-black hover-gold font-medium">
              Preços
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/about')} className="w-full justify-start text-black hover-gold font-medium">
              Sobre Nós
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/contact')} className="w-full justify-start text-black hover-gold font-medium">
              Contacto
            </Button>
            <Button variant="ghost" onClick={() => handleNavigation('/partnerships')} className="w-full justify-start text-black hover-gold font-medium">
              Parcerias
            </Button>
            <hr className="border-gold" />
            <Button variant="ghost" onClick={() => handleNavigation('/login')} className="w-full justify-start text-black hover-gold font-medium">
              Entrar
            </Button>
            <Button 
              onClick={() => handleNavigation('/register')}
              className="w-full bg-gold-gradient text-black hover:opacity-90 font-semibold"
            >
              Começar Grátis
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
