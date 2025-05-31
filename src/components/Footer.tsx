
import { Clock, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-light-gold border-t-2 border-gold mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={() => navigate('/')}>
              <Clock className="h-6 w-6 text-gold" />
              <h4 className="font-bold text-black">FuturoPresente</h4>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              A primeira plataforma portuguesa para entregas temporais. 
              Criamos memórias para o futuro, uma entrega de cada vez.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>geral@rollbox.pt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>220 145 169</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3 text-black">A Nossa Empresa</h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => navigate('/about')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Contactos & Apoio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/partnerships')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Parcerias
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3 text-black">Os Nossos Serviços</h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => navigate('/how-it-works')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/pricing')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Preços & Planos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3 text-black">Informações Legais</h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => navigate('/terms-conditions')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Termos e Condições
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy-policy')} 
                  className="hover:text-gold text-left transition-colors"
                >
                  Política de Privacidade
                </button>
              </li>
            </ul>
            <div className="mt-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1 mb-1">
                <MapPin className="h-3 w-3" />
                <span>Matosinhos, Portugal</span>
              </div>
              <p>Empresa portuguesa 🇵🇹</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gold mt-8 pt-8 text-center text-gray-700">
          <p className="text-sm">
            &copy; 2024 FuturoPresente™. O teu tempo, entregue no momento perfeito.
          </p>
          <p className="text-xs mt-2 text-gray-600">
            Feito com ❤️ no Porto para preservar memórias em todo o mundo.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
