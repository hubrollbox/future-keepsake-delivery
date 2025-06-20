import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-steel-blue text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-center mb-6">
                <img src="/keepla%20logo%20monocromatico.png" alt="Logo Monocromático" style={{width: 120, height: 120}} />
              </div>
              <p className="text-misty-gray leading-relaxed mb-6 max-w-md text-center md:text-left">
                Guardamos emoções para o tempo certo. Cada entrega é uma ponte entre o presente e o futuro, 
                criada com sensibilidade e amor.
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-dusty-rose mb-4">
                <span className="text-sm">Desenvolvido com</span>
                <Heart className="h-4 w-4 text-red-400 fill-current" />
                <span className="text-sm">em Portugal</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="font-fraunces font-semibold text-lg mb-4 text-white">Navegação</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Início
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/about')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/products')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Produtos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/how-it-works')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Como Funciona
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/contact')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Contacto
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Voltar ao Topo
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-fraunces font-semibold text-lg mb-4 text-white">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/terms-conditions')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Termos e Condições
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/privacy-policy')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/partnerships')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Parcerias
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/faq')}}
                    className="text-misty-gray hover:text-dusty-rose transition-colors duration-200"
                  >
                    Suporte
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-misty-gray/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-misty-gray text-sm">
                © 2025 rollbox. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-2 text-misty-gray text-sm">
                <span>Empresa 100% portuguesa</span>
                <div className="w-2 h-2 bg-dusty-rose rounded-full"></div>
                <span>Sediada em Matosinhos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
