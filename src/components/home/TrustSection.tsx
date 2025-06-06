
import { Shield, CheckCircle, MapPin } from "lucide-react";

const TrustSection = () => {
  return (
    <div className="mb-16 md:mb-20 emotion-card p-8 md:p-10 animate-scale-in hover:shadow-soft transition-all duration-300">
      <h2 className="text-section-title-sm md:text-section-title text-steel-blue mb-6 md:mb-8 text-center font-bold font-fraunces">
        Porque Confiar em Nós?
      </h2>
      <p className="text-body md:text-body-large text-misty-gray mb-8 md:mb-10 text-center max-w-3xl mx-auto leading-relaxed">
        Somos uma empresa <strong className="text-earthy-burgundy">100% portuguesa</strong> focada em preservar as tuas memórias com total segurança.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 md:gap-10 text-center">
        <div className="hover:scale-105 transition-transform duration-300 group">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-earthy-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
            <Shield className="h-10 w-10 md:h-12 md:w-12 text-earthy-burgundy" />
          </div>
          <h3 className="font-bold mb-3 md:mb-4 text-lg md:text-xl text-steel-blue font-fraunces">Segurança Máxima</h3>
          <p className="text-sm md:text-base text-misty-gray leading-relaxed">
            <strong>Instalações monitorizadas 24/7</strong>, controlo climático e seguro total contra todos os riscos
          </p>
        </div>
        
        <div className="hover:scale-105 transition-transform duration-300 group">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-earthy-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
            <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-earthy-burgundy" />
          </div>
          <h3 className="font-bold mb-3 md:mb-4 text-lg md:text-xl text-steel-blue font-fraunces">Tecnologia Inovadora</h3>
          <p className="text-sm md:text-base text-misty-gray leading-relaxed">
            Plataforma desenvolvida com as <strong>mais recentes tecnologias</strong> para garantir precisão nas entregas
          </p>
        </div>
        
        <div className="hover:scale-105 transition-transform duration-300 group">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-earthy-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
            <MapPin className="h-10 w-10 md:h-12 md:w-12 text-earthy-burgundy" />
          </div>
          <h3 className="font-bold mb-3 md:mb-4 text-lg md:text-xl text-steel-blue font-fraunces">Empresa Portuguesa</h3>
          <p className="text-sm md:text-base text-misty-gray leading-relaxed">
            Sediada em <strong>Matosinhos</strong>, com apoio local dedicado e equipa que fala a tua língua
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
