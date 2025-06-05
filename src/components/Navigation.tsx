
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import CartButton from "@/components/cart/CartButton";
import CartModal from "@/components/cart/CartModal";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

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
      <nav className="bg-white/95 backdrop-blur-md shadow-gentle border-b border-dusty-rose/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 font-bold text-xl text-steel-blue">
              <SeloDoTempoIcon size={40} />
              <span className="font-fraunces">FuturoPresente</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <Link to="/products" className="text-misty-gray hover:text-dusty-rose transition-colors font-medium" aria-label="Navegar para Presentes com Alma">
                Presentes com Alma
              </Link>
              <Link to="/how-it-works" className="text-misty-gray hover:text-dusty-rose transition-colors font-medium" aria-label="Navegar para Como Funciona">
                Como Funciona
              </Link>
              <Link to="/pricing" className="text-misty-gray hover:text-dusty-rose transition-colors font-medium" aria-label="Navegar para Preços">
                Preços
              </Link>
              <Link to="/about" className="text-misty-gray hover:text-dusty-rose transition-colors font-medium" aria-label="Navegar para Manifesto">
                Manifesto
              </Link>
              <Link to="/contact" className="text-misty-gray hover:text-dusty-rose transition-colors font-medium" aria-label="Navegar para Contacto">
                Contacto
              </Link>

              {user && <CartButton onClick={() => setIsCartOpen(true)} />}

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" aria-label="Acessar Dashboard">
                    <Button variant="outline" size="sm" className="border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10 rounded-xl">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    size="sm"
                    className="text-misty-gray hover:text-steel-blue rounded-xl"
                    aria-label="Sair da conta"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" aria-label="Entrar na conta">
                    <Button variant="outline" size="sm" className="border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10 rounded-xl">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register" aria-label="Registrar nova conta">
                    <Button size="sm" className="bg-brand-gradient text-steel-blue hover:opacity-90 rounded-xl font-medium">
                      Registar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-misty-gray hover:text-steel-blue hover:bg-sand-beige/50"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-6 px-2 border-t border-dusty-rose/20">
              <div className="flex flex-col space-y-6">
                <Link
                  to="/products"
                  className="text-misty-gray hover:text-dusty-rose transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Presentes com Alma"
                >
                  Presentes com Alma
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-misty-gray hover:text-dusty-rose transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Como Funciona"
                >
                  Como Funciona
                </Link>
                <Link
                  to="/pricing"
                  className="text-misty-gray hover:text-dusty-rose transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Preços"
                >
                  Preços
                </Link>
                <Link
                  to="/about"
                  className="text-misty-gray hover:text-dusty-rose transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                  aria-label="Navegar para Manifesto"
                >
                  Manifesto
                </Link>
                <Link
                  to="/contact"
                  className="text-misty-gray hover:text-dusty-rose transition-colors py-2 font-medium"
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
                  <div className="flex flex-col space-y-3 pt-4 border-t border-dusty-rose/20">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} aria-label="Acessar Dashboard">
                      <Button variant="outline" size="sm" className="w-full border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10 rounded-xl">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {handleSignOut(); setIsOpen(false);}}
                      variant="ghost" 
                      size="sm"
                      className="w-full text-misty-gray hover:text-steel-blue rounded-xl"
                      aria-label="Sair da conta"
                    >
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-dusty-rose/20">
                    <Link to="/login" onClick={() => setIsOpen(false)} aria-label="Entrar na conta">
                      <Button variant="outline" size="sm" className="w-full border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10 rounded-xl">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} aria-label="Registrar nova conta">
                      <Button size="sm" className="w-full bg-brand-gradient text-steel-blue hover:opacity-90 rounded-xl font-medium">
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
