
import { Shield, CheckCircle, MapPin } from "lucide-react";

const TrustSection = () => {
  return (
    <div className="mb-16 md:mb-20 bg-gray-50 rounded-2xl p-8 md:p-10 animate-scale-in hover:shadow-lg transition-all duration-300">
      <h2 className="text-section-title-sm md:text-section-title text-black mb-6 md:mb-8 text-center font-bold">
        Porque Confiar em Nós?
      </h2>
      <p className="text-body md:text-body-large text-gray-600 mb-8 md:mb-10 text-center max-w-3xl mx-auto leading-relaxed">
        Somos uma empresa <strong className="text-gold">100% portuguesa</strong> focada em preservar as tuas memórias com total segurança.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 md:gap-10 text-center">
        <div className="hover:scale-105 transition-transform duration-300 group">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-200 transition-colors">
            <Shield className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
          </div>
          <h3 className="font-bold mb-3 md:mb-4 text-lg md:text-xl text-black">Segurança Máxima</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            <strong>Instalações monitorizadas 24/7</strong>, controlo climático e seguro total contra todos os riscos
          </p>
        </div>
        
        <div className="hover:scale-105 transition-transform duration-300 group">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-blue-200 transition-colors">
            <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
          </div>
          <h3 className="font-bold mb-3 md:mb-4 text-lg md:text-xl text-black">Tecnologia Inovadora</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Plataforma desenvolvida com as <strong>mais recentes tecnologias</strong> para garantir precisão nas entregas
          </p>
        </div>
        
        <div className="hover:scale-105 transition-transform duration-300 group">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-purple-200 transition-colors">
            <MapPin className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
          </div>
          <h3 className="font-bold mb-3 md:mb-4 text-lg md:text-xl text-black">Empresa Portuguesa</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Sediada em <strong>Matosinhos</strong>, com apoio local dedicado e equipa que fala a tua língua
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
