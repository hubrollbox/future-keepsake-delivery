
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
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
      <nav className="bg-lavanda-palida shadow-soft border-b border-rosa-antigo/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 font-fraunces text-xl font-semibold text-azul-petroleo">
              <img 
                src="/lovable-uploads/b98ddc12-519a-49de-9acc-4f2e5c35c662.png" 
                alt="Selo do Tempo FuturoPresente" 
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-lg leading-tight">FuturoPresente</span>
                <span className="text-xs text-cinza-esfumado leading-tight">Presente no futuro</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/products" className="text-azul-petroleo hover:text-rosa-antigo transition-colors font-fraunces" aria-label="Navegar para Presentes com Alma">
                Presentes com Alma
              </Link>
              <Link to="/how-it-works" className="text-azul-petroleo hover:text-rosa-antigo transition-colors font-fraunces" aria-label="Navegar para Como Funciona">
                Como Funciona
              </Link>
              <Link to="/pricing" className="text-azul-petroleo hover:text-rosa-antigo transition-colors font-fraunces" aria-label="Navegar para Preços">
                Preços
              </Link>
              <Link to="/about" className="text-azul-petroleo hover:text-rosa-antigo transition-colors font-fraunces" aria-label="Navegar para Manifesto">
                Manifesto
              </Link>
              <Link to="/contact" className="text-azul-petroleo hover:text-rosa-antigo transition-colors font-fraunces" aria-label="Navegar para Contacto">
                Contacto
              </Link>

              {user && <CartButton onClick={() => setIsCartOpen(true)} />}

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" aria-label="Acessar Dashboard">
                    <Button variant="outline" size="sm" className="border-rosa-antigo text-azul-petroleo hover:bg-rosa-antigo/10 font-fraunces">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    size="sm"
                    className="text-cinza-esfumado hover:text-azul-petroleo font-fraunces"
                    aria-label="Sair da conta"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" aria-label="Entrar na conta">
                    <Button variant="outline" size="sm" className="border-rosa-antigo text-azul-petroleo hover:bg-rosa-antigo/10 font-fraunces">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register" aria-label="Registrar nova conta">
                    <Button size="sm" className="bg-azul-meia-noite text-lavanda-palida hover:bg-azul-meia-noite/90 font-fraunces">
                      Registar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-azul-petroleo hover:text-rosa-antigo hover:bg-rosa-antigo/10"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 px-2 border-t border-rosa-antigo/20">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/products"
                  className="text-azul-petroleo hover:text-rosa-antigo transition-colors py-2 font-fraunces"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Presentes com Alma"
                >
                  Presentes com Alma
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-azul-petroleo hover:text-rosa-antigo transition-colors py-2 font-fraunces"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Como Funciona"
                >
                  Como Funciona
                </Link>
                <Link
                  to="/pricing"
                  className="text-azul-petroleo hover:text-rosa-antigo transition-colors py-2 font-fraunces"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Preços"
                >
                  Preços
                </Link>
                <Link
                  to="/about"
                  className="text-azul-petroleo hover:text-rosa-antigo transition-colors py-2 font-fraunces"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Manifesto"
                >
                  Manifesto
                </Link>
                <Link
                  to="/contact"
                  className="text-azul-petroleo hover:text-rosa-antigo transition-colors py-2 font-fraunces"
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
                  <div className="flex flex-col space-y-2 pt-4 border-t border-rosa-antigo/20">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} aria-label="Acessar Dashboard">
                      <Button variant="outline" size="sm" className="w-full border-rosa-antigo text-azul-petroleo hover:bg-rosa-antigo/10 font-fraunces">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {handleSignOut(); setIsOpen(false);}}
                      variant="ghost" 
                      size="sm"
                      className="w-full text-cinza-esfumado hover:text-azul-petroleo font-fraunces"
                      aria-label="Sair da conta"
                    >
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-rosa-antigo/20">
                    <Link to="/login" onClick={() => setIsOpen(false)} aria-label="Entrar na conta">
                      <Button variant="outline" size="sm" className="w-full border-rosa-antigo text-azul-petroleo hover:bg-rosa-antigo/10 font-fraunces">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} aria-label="Registrar nova conta">
                      <Button size="sm" className="w-full bg-azul-meia-noite text-lavanda-palida hover:bg-azul-meia-noite/90 font-fraunces">
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
