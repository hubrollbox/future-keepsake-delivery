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
              <div className="flex items-center justify-start mb-6">
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
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="24" height="24" fill="none" stroke="#F8E6ED" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="24" height="24" fill="none" stroke="#F8E6ED" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="16" y1="8" x2="16" y2="16"/><line x1="8" y1="8" x2="8" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </a>
                <a href="https://vimeo.com/" target="_blank" rel="noopener noreferrer" aria-label="Vimeo">
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 7s-1 5-5 9-7 4-9 2-2-7 2-9c2-1 4 0 4 2 0 2-2 4-4 4s-2-2-2-2"/></svg>
                </a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="Github">
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.41-.01 2.74 0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg>
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.05 16.54A9 9 0 1 0 12 21a8.94 8.94 0 0 0 4.54-1.26l3.32.87-.87-3.32z"/><path d="M16.24 7.76a5 5 0 0 1-7.07 7.07l-1.41-1.41a1 1 0 0 1 0-1.41l1.41-1.41a1 1 0 0 1 1.41 0l1.41 1.41a1 1 0 0 1 0 1.41l-1.41 1.41"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
