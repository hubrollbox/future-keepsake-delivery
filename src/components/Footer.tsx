
import { Clock } from "lucide-react";
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
            <p className="text-gray-700 text-sm">
              O teu tempo, entregue. Criando memórias para o futuro, uma entrega de cada vez.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3 text-black">Empresa</h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => navigate('/about')} 
                  className="hover:text-gold text-left"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="hover:text-gold text-left"
                >
                  Contactos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/partnerships')} 
                  className="hover:text-gold text-left"
                >
                  Parcerias
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3 text-black">Serviços</h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => navigate('/pricing')} 
                  className="hover:text-gold text-left"
                >
                  Preços & Planos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/how-it-works')} 
                  className="hover:text-gold text-left"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="hover:text-gold text-left"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3 text-black">Legal</h5>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button 
                  onClick={() => navigate('/terms-conditions')} 
                  className="hover:text-gold text-left"
                >
                  Termos e Condições
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy-policy')} 
                  className="hover:text-gold text-left"
                >
                  Política de Privacidade
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gold mt-8 pt-8 text-center text-gray-700">
          <p>&copy; 2024 FuturoPresente™. O teu tempo, entregue.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
