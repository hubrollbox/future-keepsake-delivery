
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Download, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-steel-blue text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/5ef3eeca-e044-49a2-bf54-55feda717582.png" 
                alt="Selo do Tempo - FuturoPresente"
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-bold font-fraunces">FuturoPresente</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              O que sentes hoje, no tempo de quem amas. Guardamos memórias e entregamos emoções no momento perfeito.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="text-white/70 hover:text-dusty-rose transition-colors p-2 rounded-lg" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-white/70 hover:text-dusty-rose transition-colors p-2 rounded-lg" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-white/70 hover:text-dusty-rose transition-colors p-2 rounded-lg" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-white/70 hover:text-dusty-rose transition-colors p-2 rounded-lg" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-dusty-rose font-fraunces">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNavigation('/products')} className="text-white/80 hover:text-dusty-rose transition-colors text-sm" aria-label="Navegar para Presentes com Alma">
                  Presentes com Alma
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/how-it-works')} className="text-white/80 hover:text-dusty-rose transition-colors text-sm" aria-label="Navegar para Como Funciona">
                  Como Funciona
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/pricing')} className="text-white/80 hover:text-dusty-rose transition-colors text-sm" aria-label="Navegar para Preços">
                  Preços
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/about')} className="text-white/80 hover:text-dusty-rose transition-colors text-sm" aria-label="Navegar para Manifesto">
                  Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/partnerships')} className="text-white/80 hover:text-dusty-rose transition-colors text-sm" aria-label="Navegar para Parcerias">
                  Parcerias
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-dusty-rose font-fraunces">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-dusty-rose flex-shrink-0" />
                <span className="text-white/80 text-sm">geral@rollbox.pt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-dusty-rose flex-shrink-0" />
                <span className="text-white/80 text-sm">220 145 169</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-dusty-rose flex-shrink-0 mt-0.5" />
                <div className="text-white/80 text-sm">
                  <p>Rua Brito Capelo</p>
                  <p>Edifício Diplomata</p>
                  <p>4450 Matosinhos, Portugal</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Download & Legal */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-dusty-rose font-fraunces">App & Legal</h3>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center space-x-2 bg-earthy-burgundy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-earthy-burgundy/90 transition-colors inline-flex w-fit"
                aria-label="Download da App"
              >
                <Download className="h-4 w-4" />
                <span>Download App</span>
              </a>
              <div className="space-y-2">
                <button onClick={() => handleNavigation('/terms-conditions')} className="block text-white/80 hover:text-dusty-rose transition-colors text-sm" aria-label="Navegar para Termos e Condições">
                  Termos e Condições
                </button>
                <button onClick={() => handleNavigation('/privacy-policy')} className="block text-white/80 hover:text-dusty-rose transition-colors text-sm" aria-label="Navegar para Política de Privacidade">
                  Política de Privacidade
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-white/60 text-sm">
            © 2025 rollbox. Todos os direitos reservados.
          </p>
          <p className="text-dusty-rose text-sm font-medium font-fraunces flex items-center space-x-1">
            <span>Desenvolvido com</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>em Portugal</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
