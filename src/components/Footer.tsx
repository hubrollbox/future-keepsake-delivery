
import { Clock, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-bege-areia text-azul-petroleo py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand/Story Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b98ddc12-519a-49de-9acc-4f2e5c35c662.png" 
                alt="Selo do Tempo FuturoPresente" 
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-lg font-fraunces font-semibold">FuturoPresente</span>
                <span className="text-xs text-cinza-esfumado">Presente no futuro</span>
              </div>
            </div>
            <p className="text-azul-petroleo text-sm leading-relaxed font-fraunces">
              O que sentes hoje, no tempo de quem amas. Guardamos memórias e entregamos emoções no momento perfeito.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-cinza-esfumado hover:text-rosa-antigo transition-colors p-2" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cinza-esfumado hover:text-rosa-antigo transition-colors p-2" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-cinza-esfumado hover:text-rosa-antigo transition-colors p-2" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-cinza-esfumado hover:text-rosa-antigo transition-colors p-2" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-fraunces font-semibold text-azul-petroleo">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNavigation('/products')} className="text-cinza-esfumado hover:text-rosa-antigo transition-colors text-sm font-fraunces" aria-label="Navegar para Presentes com Alma">
                  Presentes com Alma
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/how-it-works')} className="text-cinza-esfumado hover:text-rosa-antigo transition-colors text-sm font-fraunces" aria-label="Navegar para Como Funciona">
                  Como Funciona
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/pricing')} className="text-cinza-esfumado hover:text-rosa-antigo transition-colors text-sm font-fraunces" aria-label="Navegar para Preços">
                  Preços
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/about')} className="text-cinza-esfumado hover:text-rosa-antigo transition-colors text-sm font-fraunces" aria-label="Navegar para Manifesto">
                  Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/partnerships')} className="text-cinza-esfumado hover:text-rosa-antigo transition-colors text-sm font-fraunces" aria-label="Navegar para Parcerias">
                  Parcerias
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & App Download */}
          <div className="space-y-6">
            <h3 className="text-lg font-fraunces font-semibold text-azul-petroleo">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-rosa-antigo" />
                <span className="text-cinza-esfumado text-sm">info@futuropresente.pt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rosa-antigo" />
                <span className="text-cinza-esfumado text-sm">+351 123 456 789</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-rosa-antigo mt-0.5" />
                <span className="text-cinza-esfumado text-sm">
                  Lisboa, Portugal
                </span>
              </div>
            </div>
            <button 
              onClick={() => handleNavigation('/contact')}
              className="bg-azul-meia-noite text-lavanda-palida px-4 py-2 rounded-lg text-sm font-fraunces font-semibold hover:bg-azul-meia-noite/90 transition-all shadow-soft"
              aria-label="Navegar para a página de Contacto"
            >
              Falar Connosco
            </button>
          </div>

          {/* App Download */}
          <div className="space-y-6">
            <h3 className="text-lg font-fraunces font-semibold text-azul-petroleo">Baixe Nosso App</h3>
            <p className="text-cinza-esfumado text-sm font-fraunces">
              Leve o FuturoPresente sempre consigo e nunca perca uma memória especial.
            </p>
            <a 
              href="https://futuro-presente.app/download" 
              className="flex items-center justify-center space-x-2 bg-rosa-antigo text-azul-petroleo px-4 py-3 rounded-lg text-sm font-fraunces font-semibold hover:bg-rosa-antigo/90 transition-all shadow-soft" 
              aria-label="Download App"
            >
              <Smartphone className="h-5 w-5" />
              <span>Download App</span>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-rosa-antigo/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cinza-esfumado text-sm mb-4 md:mb-0 font-fraunces">
            © {new Date().getFullYear()} FuturoPresente. Todos os direitos reservados.
          </p>
          <p className="text-cinza-esfumado text-sm font-fraunces">
            Feito com ❤️ em Portugal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
