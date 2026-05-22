import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-foreground text-background py-10 sm:py-16">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="col-span-2">
              <div className="flex items-center justify-start mb-6">
                <img 
                   src="/keepla-logo-red.png?v=3" 
                   alt="Logo Monocromático" 
                   className="w-20 h-20 sm:w-[120px] sm:h-[120px]"
                   loading="eager" 
                  decoding="async"
                  onError={(e) => { e.currentTarget.src = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png'; }}
                />
              </div>
              <p className="text-background/60 leading-relaxed mb-4 sm:mb-6 max-w-md text-sm sm:text-base text-center md:text-left font-georgia italic">
                Guardamos emoções para o tempo certo. Cada entrega é uma ponte entre o presente e o futuro, 
                criada com sensibilidade e amor.
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4 text-background/70">
                <span className="text-sm">Desenvolvido com</span>
                <Heart className="h-4 w-4 fill-[hsl(var(--keepla-red))] text-[hsl(var(--keepla-red))]" />
                <span className="text-sm">em Portugal</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-background font-semibold mb-2">Navegação</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="/" className="text-background/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Início</a>
                </li>
                <li>
                  <a href="/products" className="text-background/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Produtos</a>
                </li>
                <li>
                  <a href="/pricing" className="text-background/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Preços</a>
                </li>
                <li>
                  <a href="/how-it-works" className="text-background/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Como Funciona</a>
                </li>
                <li>
                  <a href="/blog" className="text-background/70 hover:text-primary transition-colors underline-offset-4 hover:underline">Blog</a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-background font-semibold mb-2">Legal</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/terms')}}
                    className="text-background/70 hover:text-primary hover:underline underline-offset-4 transition-colors duration-200"
                  >
                    Termos e Condições
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/privacy')}}
                    className="text-background/70 hover:text-primary hover:underline underline-offset-4 transition-colors duration-200"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/partnerships')}}
                    className="text-background/70 hover:text-primary hover:underline underline-offset-4 transition-colors duration-200"
                  >
                    Parcerias
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {window.scrollTo(0,0); navigate('/faq')}}
                    className="text-background/70 hover:text-primary hover:underline underline-offset-4 transition-colors duration-200"
                  >
                    Suporte
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-background/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-background/60 text-sm">
                © {new Date().getFullYear()} keepla. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-2 text-background/60 text-sm">
                <span>Empresa 100% portuguesa</span>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Sediada em Matosinhos</span>
              </div>
              {/* Redes sociais — adicionar quando perfis oficiais estiverem criados */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
