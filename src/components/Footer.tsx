
import { Clock, Mail, Phone, MapPin, Heart, Linkedin, Instagram } from "lucide-react";
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
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Marca e Descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNavigation('/')}>
              <Clock className="h-6 w-6 text-gold" />
              <h4 className="font-bold text-black text-lg">FuturoPresente</h4>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              A primeira plataforma portuguesa para entregas no futuro. 
              Preservamos as tuas memórias e criamos momentos especiais para amanhã.
            </p>
            
            {/* Contactos */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="mailto:geral@rollbox.pt" className="hover:text-gold transition-colors">
                  geral@rollbox.pt
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="tel:220145169" className="hover:text-gold transition-colors">
                  220 145 169
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                <span>Matosinhos, Portugal 🇵🇹</span>
              </div>
            </div>
          </div>
          
          {/* Coluna 2: A Nossa Empresa */}
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
          
          {/* Coluna 3: Os Nossos Serviços */}
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
          
          {/* Coluna 4: Informações Legais */}
          <div>
            <h5 className="font-semibold mb-4 text-black text-base">Informações Legais</h5>
            <ul className="space-y-3 text-sm text-gray-700">
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
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="border-t border-gold pt-6 mb-6">
          <h5 className="font-semibold mb-4 text-black text-center">Segue-nos nas Redes Sociais</h5>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://linkedin.com/company/futuropropresente" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            <a 
              href="https://instagram.com/futuropropresente" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors group"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Instagram</span>
            </a>
            <a 
              href="https://x.com/futuropropresente" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors group"
              aria-label="X (Twitter)"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
              <span className="text-sm font-medium">X</span>
            </a>
            <a 
              href="https://github.com/futuropropresente" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors group"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gold pt-6 text-center text-gray-700">
          <p className="text-sm font-medium mb-2">
            &copy; 2025 FuturoPresente™. O teu tempo, entregue no momento perfeito.
          </p>
          <p className="text-xs text-gray-600 flex items-center justify-center space-x-1">
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
