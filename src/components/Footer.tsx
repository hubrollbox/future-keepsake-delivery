
import { Clock, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-gold" />
              <span className="text-xl font-bold">FuturoPresente</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              O que sentes hoje, no tempo de quem amas. Guardamos memórias e entregamos emoções no momento perfeito.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNavigation('/products')} className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Produtos e Serviços
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/how-it-works')} className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Como Funciona
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/pricing')} className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Preços
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/about')} className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Sobre Nós
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/partnerships')} className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Parcerias
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNavigation('/terms-conditions')} className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Termos e Condições
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/privacy-policy')} className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Política de Privacidade
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold" />
                <span className="text-gray-300 text-sm">info@futuropresente.pt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold" />
                <span className="text-gray-300 text-sm">+351 123 456 789</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Lisboa, Portugal
                </span>
              </div>
            </div>
            <button 
              onClick={() => handleNavigation('/contact')}
              className="bg-gold-gradient text-black px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Falar Connosco
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} FuturoPresente. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-sm">
            Feito com ❤️ em Portugal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
