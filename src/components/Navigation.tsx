
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import CartButton from "@/components/cart/CartButton";
import CartModal from "@/components/cart/CartModal";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";

const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsDrawerOpen(false);
  };

  // Links para usar no menu/mobile
  const navLinks = [
    { to: "/about", label: "Manifesto", aria: "Ir para Manifesto" },
    { to: "/contact", label: "Contacto", aria: "Ir para Contacto" },
    { to: "/how-it-works", label: "Como Funciona", aria: "Ir para Como Funciona" },
    { to: "/pricing", label: "Preços", aria: "Ir para Preços" },
    { to: "/products", label: "Presentes com Alma", aria: "Ir para Presentes com Alma" },
  ];

  return (
    <>
      {/* Link Skip to Content para acessibilidade */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-dusty-rose/90 text-steel-blue px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-earthy-burgundy font-semibold transition-all"
        aria-label="Pular para o conteúdo principal"
        tabIndex={0}
      >
        Pular para Conteúdo
      </a>
      <nav className="bg-white/95 backdrop-blur-md shadow-gentle border-b border-dusty-rose/20 sticky top-0 z-40" aria-label="Navegação principal">
        <div className="w-full max-w-full px-2 sm:px-4 md:px-8 mx-auto">
          <div className="flex justify-between items-center h-20 min-w-0 overflow-x-hidden max-w-full">
            <Link to="/" className="flex items-center space-x-3 font-bold text-xl text-steel-blue min-w-0 overflow-hidden" aria-label="Página inicial">
              <img src="/keepla%20logo.png" alt="Logo" style={{width: 56, height: 56}} />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link text-misty-gray hover:text-dusty-rose focus-visible:underline focus-visible:decoration-2 focus-visible:decoration-dusty-rose transition-colors font-medium ${isActive ? "active" : ""}`
                  }
                  aria-label={link.aria}
                >
                  {link.label}
                </NavLink>
              ))}
              {user && <CartButton onClick={() => setIsCartOpen(true)} />}
              {!user && (
                <div className="flex items-center space-x-4">
                  <Link to="/login" aria-label="Entrar na conta">
                    <Button variant="outline" size="sm" className="border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10 rounded-xl">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register" aria-label="Registar nova conta">
                    <Button
                      variant="brand"
                      className="px-6 py-2 rounded-lg font-semibold text-white shadow-soft bg-brand-gradient hover:opacity-90 focus-visible:ring-2 focus-visible:ring-dusty-rose/40 transition-all duration-200"
                    >
                      Registar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl text-misty-gray hover:text-steel-blue hover:bg-sand-beige/50 focus-visible:ring-2 focus-visible:ring-earthy-burgundy"
              aria-label="Abrir o menu de navegação"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer: Mobile Navigation */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} shouldScaleBackground>
        <DrawerContent className="pt-4 pb-8 px-4">
          <div className="flex flex-col gap-7 mt-3">
            <div className="flex justify-between items-center mb-4">
              <Link to="/" onClick={() => setIsDrawerOpen(false)} className="flex items-center space-x-2 font-bold text-xl text-steel-blue" aria-label="Página inicial">
                <img src="/keepla%20logo.png" alt="Logo" style={{width: 32, height: 32}} />
              </Link>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="p-2 rounded-xl text-misty-gray hover:text-steel-blue hover:bg-sand-beige/50 focus-visible:ring-2 focus-visible:ring-earthy-burgundy"
                  aria-label="Fechar o menu de navegação"
                >
                  <span aria-hidden="true" className="text-lg">&times;</span>
                </button>
              </DrawerClose>
            </div>
            <nav aria-label="Menu mobile principal" className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsDrawerOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 px-3 text-lg font-medium rounded-xl transition-colors nav-link text-misty-gray hover:text-dusty-rose focus-visible:underline focus-visible:decoration-2 focus-visible:decoration-dusty-rose ${isActive ? "active text-dusty-rose" : ""}`
                  }
                  aria-label={link.aria}
                  style={{ minHeight: 44 }}
                >
                  {link.label}
                </NavLink>
              ))}
              {user && (
                <div className="py-1">
                  <CartButton onClick={() => {setIsCartOpen(true); setIsDrawerOpen(false);}} />
                </div>
              )}
              {!user && (
                <>
                  <Link to="/login" onClick={() => setIsDrawerOpen(false)} aria-label="Ir para login">
                    <Button variant="outline" size="sm" className="w-full border-dusty-rose text-dusty-rose hover:bg-dusty-rose/10 rounded-xl" style={{ minHeight: 44 }}>
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsDrawerOpen(false)} aria-label="Ir para registo">
                    <Button size="sm" className="w-full bg-brand-gradient text-steel-blue hover:opacity-90 rounded-xl font-medium" style={{ minHeight: 44 }}>
                      Registar
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navigation;

<nav className="flex flex-wrap justify-center items-center gap-4 w-full">
  <a href="/contacto" className="nav-link">Contacto</a>
  <a href="/como-funciona" className="nav-link">Como Funciona</a>
  <a href="/manifesto" className="nav-link">Manifesto</a>
  <a href="/precos" className="nav-link">Preços</a>
  <a href="/" className="nav-link">Presentes com Alma</a>
</nav>
