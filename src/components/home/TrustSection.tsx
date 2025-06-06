
import { Shield, CheckCircle, MapPin } from "lucide-react";

const TrustSection = () => {
  return (
    <section className="py-20 md:py-28 bg-lavender-mist">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fraunces font-bold text-steel-blue mb-6">
              Porque Confiar <span className="text-earthy-burgundy">em Nós?</span>
            </h2>
            <p className="text-xl text-misty-gray max-w-3xl mx-auto leading-relaxed">
              Somos uma empresa <span className="text-earthy-burgundy font-semibold">100% portuguesa</span> focada em preservar as tuas memórias com total segurança.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="emotion-card p-8 text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <Shield className="h-10 w-10 text-earthy-burgundy" />
              </div>
              <h3 className="text-xl font-fraunces font-bold text-steel-blue mb-4">Segurança Máxima</h3>
              <p className="text-misty-gray leading-relaxed">
                <span className="text-earthy-burgundy font-semibold">Instalações monitorizadas 24/7</span>, controlo climático e seguro total contra todos os riscos
              </p>
            </div>
            
            <div className="emotion-card p-8 text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <CheckCircle className="h-10 w-10 text-earthy-burgundy" />
              </div>
              <h3 className="text-xl font-fraunces font-bold text-steel-blue mb-4">Tecnologia Inovadora</h3>
              <p className="text-misty-gray leading-relaxed">
                Plataforma desenvolvida com as <span className="text-earthy-burgundy font-semibold">mais recentes tecnologias</span> para garantir precisão nas entregas
              </p>
            </div>
            
            <div className="emotion-card p-8 text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-earthy-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-earthy-burgundy/20 transition-colors">
                <MapPin className="h-10 w-10 text-earthy-burgundy" />
              </div>
              <h3 className="text-xl font-fraunces font-bold text-steel-blue mb-4">Empresa Portuguesa</h3>
              <p className="text-misty-gray leading-relaxed">
                Sediada em <span className="text-earthy-burgundy font-semibold">Matosinhos</span>, com apoio local dedicado e equipa que fala a tua língua
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
