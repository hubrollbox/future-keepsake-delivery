
const TrustSection = () => {
  return (
    <div className="mb-16 md:mb-20 bg-gray-50 rounded-2xl p-6 md:p-8 animate-scale-in hover:shadow-lg transition-all duration-300">
      <h2 className="text-section-title-sm md:text-section-title text-black mb-6 md:mb-8 text-center">Porque Confiar em Nós?</h2>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
        <div className="hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <span className="text-green-600 font-bold text-2xl md:text-3xl">🔒</span>
          </div>
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl text-black">Segurança Máxima</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Instalações monitorizadas 24/7, seguros contra todos os riscos</p>
        </div>
        <div className="hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <span className="text-blue-600 font-bold text-2xl md:text-3xl">✓</span>
          </div>
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl text-black">100% de Fiabilidade</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Mais de 50.000 entregas realizadas com sucesso</p>
        </div>
        <div className="hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <span className="text-purple-600 font-bold text-2xl md:text-3xl">🇵🇹</span>
          </div>
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl text-black">Empresa Portuguesa</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">Sediada no Porto, com apoio local dedicado</p>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
