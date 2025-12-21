
const HowItWorksHero = () => {
  return (
    <div className="text-center max-w-6xl mx-auto mb-12 md:mb-20">
      <div className="flex justify-center mb-8">
<img 
  src="/keepla-logo-red.png" 
  alt="keepla Logo" 
  style={{width: 80, height: 80}} 
  loading="eager"
  decoding="async"
  onError={(e) => { e.currentTarget.src = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png'; }}
/>
      </div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-keepla-black mb-6 md:mb-8 leading-tight tracking-tight font-inter">
        Como funciona a{" "}
        <span className="text-keepla-red block md:inline"> keepla</span>
      </h1>

      <p className="text-xl md:text-2xl lg:text-3xl text-keepla-red mb-6 md:mb-8 max-w-4xl mx-auto font-bold leading-relaxed font-georgia italic">
        "Transformamos momentos em memórias eternas, 
        <br className="hidden md:block" />
        entregues no momento perfeito."
      </p>
      
      <p className="text-lg md:text-xl text-keepla-gray-700 max-w-3xl mx-auto leading-relaxed font-inter">
        Somos o teu <strong className="text-keepla-red"> Guardião do Tempo</strong>.
      </p>
    </div>
  );
};

export default HowItWorksHero;
