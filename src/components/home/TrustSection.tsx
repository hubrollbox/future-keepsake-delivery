
const TrustSection = () => {
  return (
    <div className="mb-16 bg-gray-50 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-black mb-6 text-center">Porque Confiar em Nós?</h3>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-green-600 font-bold text-xl">🔒</span>
          </div>
          <h4 className="font-semibold mb-2">Segurança Máxima</h4>
          <p className="text-sm text-gray-600">Instalações monitorizadas 24/7, seguros contra todos os riscos</p>
        </div>
        <div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-600 font-bold text-xl">✓</span>
          </div>
          <h4 className="font-semibold mb-2">100% de Fiabilidade</h4>
          <p className="text-sm text-gray-600">Mais de 50.000 entregas realizadas com sucesso</p>
        </div>
        <div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-purple-600 font-bold text-xl">🇵🇹</span>
          </div>
          <h4 className="font-semibold mb-2">Empresa Portuguesa</h4>
          <p className="text-sm text-gray-600">Sediada no Porto, com apoio local dedicado</p>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
