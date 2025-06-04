
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
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 font-bold text-xl text-gentle-black">
              <div className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-black" />
              </div>
              <span className="font-serif">FuturoPresente</span>
              <Sparkles className="h-4 w-4 text-gold" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <Link to="/products" className="text-soft-gray hover:text-gold transition-colors font-medium" aria-label="Navegar para Presentes com Alma">
                Presentes com Alma
              </Link>
              <Link to="/how-it-works" className="text-soft-gray hover:text-gold transition-colors font-medium" aria-label="Navegar para Como Funciona">
                Como Funciona
              </Link>
              <Link to="/pricing" className="text-soft-gray hover:text-gold transition-colors font-medium" aria-label="Navegar para Preços">
                Preços
              </Link>
              <Link to="/about" className="text-soft-gray hover:text-gold transition-colors font-medium" aria-label="Navegar para Manifesto">
                Manifesto
              </Link>
              <Link to="/contact" className="text-soft-gray hover:text-gold transition-colors font-medium" aria-label="Navegar para Contacto">
                Contacto
              </Link>

              {user && <CartButton onClick={() => setIsCartOpen(true)} />}

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" aria-label="Acessar Dashboard">
                    <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10 rounded-xl">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    size="sm"
                    className="text-soft-gray hover:text-gentle-black rounded-xl"
                    aria-label="Sair da conta"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" aria-label="Entrar na conta">
                    <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10 rounded-xl">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register" aria-label="Registrar nova conta">
                    <Button size="sm" className="bg-gold-gradient text-black hover:opacity-90 rounded-xl">
                      Registar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-soft-gray hover:text-gentle-black hover:bg-gray-50"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-6 px-2 border-t border-gray-100">
              <div className="flex flex-col space-y-6">
                <Link
                  to="/products"
                  className="text-soft-gray hover:text-gold transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Presentes com Alma"
                >
                  Presentes com Alma
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-soft-gray hover:text-gold transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Como Funciona"
                >
                  Como Funciona
                </Link>
                <Link
                  to="/pricing"
                  className="text-soft-gray hover:text-gold transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Preços"
                >
                  Preços
                </Link>
                <Link
                  to="/about"
                  className="text-soft-gray hover:text-gold transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Manifesto"
                >
                  Manifesto
                </Link>
                <Link
                  to="/contact"
                  className="text-soft-gray hover:text-gold transition-colors py-2 font-medium"
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
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} aria-label="Acessar Dashboard">
                      <Button variant="outline" size="sm" className="w-full border-gold text-gold hover:bg-gold/10 rounded-xl">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {handleSignOut(); setIsOpen(false);}}
                      variant="ghost" 
                      size="sm"
                      className="w-full text-soft-gray hover:text-gentle-black rounded-xl"
                      aria-label="Sair da conta"
                    >
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                    <Link to="/login" onClick={() => setIsOpen(false)} aria-label="Entrar na conta">
                      <Button variant="outline" size="sm" className="w-full border-gold text-gold hover:bg-gold/10 rounded-xl">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} aria-label="Registrar nova conta">
                      <Button size="sm" className="w-full bg-gold-gradient text-black hover:opacity-90 rounded-xl">
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
