
import { Clock, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-light-gold border-t-2 border-gold mt-16 md:mt-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNavigation('/')}>
              <Clock className="h-6 w-6 text-gold" />
              <h4 className="font-bold text-black text-lg">FuturoPresente</h4>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              A primeira plataforma portuguesa para entregas no futuro. 
              Preservamos as tuas memórias e criamos momentos especiais para amanhã.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold" />
                <a href="mailto:geral@rollbox.pt" className="hover:text-gold transition-colors">
                  geral@rollbox.pt
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold" />
                <a href="tel:220145169" className="hover:text-gold transition-colors">
                  220 145 169
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4 text-black text-base">A Nossa Empresa</h5>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Contacto & Apoio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/partnerships')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Parcerias
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4 text-black text-base">Os Nossos Serviços</h5>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => handleNavigation('/how-it-works')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/pricing')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Preços & Planos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/dashboard')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Área de Cliente
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4 text-black text-base">Informações Legais</h5>
            <ul className="space-y-3 text-sm text-gray-700 mb-4">
              <li>
                <button 
                  onClick={() => handleNavigation('/terms-conditions')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Termos e Condições
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy-policy')} 
                  className="hover:text-gold text-left transition-colors font-medium"
                >
                  Política de Privacidade
                </button>
              </li>
            </ul>
            <div className="text-xs text-gray-600">
              <div className="flex items-center space-x-1 mb-2">
                <MapPin className="h-3 w-3 text-gold" />
                <span>Matosinhos, Portugal</span>
              </div>
              <p className="flex items-center space-x-1">
                <span>Empresa portuguesa</span>
                <span className="text-gold">🇵🇹</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gold mt-8 pt-6 text-center text-gray-700">
          <p className="text-sm font-medium">
            &copy; 2024 FuturoPresente™. O teu tempo, entregue no momento perfeito.
          </p>
          <p className="text-xs mt-2 text-gray-600 flex items-center justify-center space-x-1">
            <span>Feito com</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>no Porto para preservar memórias em todo o mundo.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
