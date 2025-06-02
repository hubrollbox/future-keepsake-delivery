
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
            <div className="space-y-2 text-sm text-gray-600 mb-4">
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
            
            {/* Redes Sociais */}
            <div className="flex space-x-3">
              <a 
                href="https://linkedin.com/company/futuropropresente" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:bg-gold/80 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/futuropropresente" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:bg-gold/80 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/futuropropresente" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:bg-gold/80 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/futuropropresente" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:bg-gold/80 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
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
            &copy; 2025 FuturoPresente™. O teu tempo, entregue no momento perfeito.
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
