
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Clock, Sparkles } from "lucide-react";
import CartButton from "@/components/cart/CartButton";
import CartModal from "@/components/cart/CartModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-black">
              <Clock className="h-6 w-6 text-gold" />
              <span>Futuro Presente</span>
              <Sparkles className="h-4 w-4 text-gold" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/products" className="text-gray-700 hover:text-gold transition-colors" aria-label="Navegar para Produtos">
                Produtos
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-gold transition-colors" aria-label="Navegar para Como Funciona">
                Como Funciona
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-gold transition-colors" aria-label="Navegar para Preços">
                Preços
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-gold transition-colors" aria-label="Navegar para Sobre">
                Sobre
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-gold transition-colors" aria-label="Navegar para Contacto">
                Contacto
              </Link>

              {user && <CartButton onClick={() => setIsCartOpen(true)} />}

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" aria-label="Acessar Dashboard">
                    <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Sair da conta"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" aria-label="Entrar na conta">
                    <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register" aria-label="Registrar nova conta">
                    <Button size="sm" className="bg-gold-gradient text-black hover:opacity-90">
                      Registar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 px-2 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-gold transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Produtos"
                >
                  Produtos
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-gray-700 hover:text-gold transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Como Funciona"
                >
                  Como Funciona
                </Link>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-gold transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Preços"
                >
                  Preços
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-gold transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Sobre"
                >
                  Sobre
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-gold transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Contacto"
                >
                  Contacto
                </Link>

                {user && (
                  <div className="py-2">
                    <CartButton onClick={() => {setIsCartOpen(true); setIsOpen(false);}} />
                  </div>
                )}

                {user ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} aria-label="Acessar Dashboard">
                      <Button variant="outline" size="sm" className="w-full border-gold text-gold hover:bg-gold/10">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {handleSignOut(); setIsOpen(false);}}
                      variant="ghost" 
                      size="sm"
                      className="w-full text-gray-600 hover:text-gray-800"
                      aria-label="Sair da conta"
                    >
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                    <Link to="/login" onClick={() => setIsOpen(false)} aria-label="Entrar na conta">
                      <Button variant="outline" size="sm" className="w-full border-gold text-gold hover:bg-gold/10">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} aria-label="Registrar nova conta">
                      <Button size="sm" className="w-full bg-gold-gradient text-black hover:opacity-90">
                        Registar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navigation;
