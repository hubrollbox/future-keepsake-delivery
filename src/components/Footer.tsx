
import { Clock, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gentle-black text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-black" />
              </div>
              <span className="text-lg font-bold font-serif">FuturoPresente</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              O que sentes hoje, no tempo de quem amas. Guardamos memórias e entregamos emoções no momento perfeito.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2 rounded-lg" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2 rounded-lg" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2 rounded-lg" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold transition-colors p-2 rounded-lg" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gold font-serif">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNavigation('/products')} className="text-gray-300 hover:text-gold transition-colors text-sm" aria-label="Navegar para Presentes com Alma">
                  Presentes com Alma
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/how-it-works')} className="text-gray-300 hover:text-gold transition-colors text-sm" aria-label="Navegar para Como Funciona">
                  Como Funciona
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/pricing')} className="text-gray-300 hover:text-gold transition-colors text-sm" aria-label="Navegar para Preços">
                  Preços
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/about')} className="text-gray-300 hover:text-gold transition-colors text-sm" aria-label="Navegar para Manifesto">
                  Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/partnerships')} className="text-gray-300 hover:text-gold transition-colors text-sm" aria-label="Navegar para Parcerias">
                  Parcerias
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gold font-serif">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="text-gray-300 text-sm">geral@rollbox.pt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="text-gray-300 text-sm">220 145 169</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p>Rua Brito Capelo</p>
                  <p>Edifício Diplomata</p>
                  <p>4450 Matosinhos, Portugal</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Download & Legal */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gold font-serif">App & Legal</h3>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center space-x-2 bg-gold-gradient text-black px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity inline-flex w-fit"
                aria-label="Download da App"
              >
                <Download className="h-4 w-4" />
                <span>Download App</span>
              </a>
              <div className="space-y-2">
                <button onClick={() => handleNavigation('/terms-conditions')} className="block text-gray-300 hover:text-gold transition-colors text-sm" aria-label="Navegar para Termos e Condições">
                  Termos e Condições
                </button>
                <button onClick={() => handleNavigation('/privacy-policy')} className="block text-gray-300 hover:text-gold transition-colors text-sm" aria-label="Navegar para Política de Privacidade">
                  Política de Privacidade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} FuturoPresente. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-sm font-medium">
            Presente no futuro ✨
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
