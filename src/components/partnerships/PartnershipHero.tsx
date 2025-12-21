
import { Handshake } from "lucide-react";

const PartnershipHero = () => {
  return (
    <div className="text-center max-w-4xl mx-auto mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-keepla-black mb-6 font-inter">
        <span className="text-keepla-red">Parcerias</span>
        {" "}Estratégicas
      </h2>
      <p className="text-lg md:text-xl text-keepla-gray-700 mb-8 leading-relaxed font-inter">
        Junta-te à nossa rede de parceiros e ajuda-nos a transformar a forma como as pessoas experienciam o tempo e as memórias.
      </p>
      <div className="flex justify-center mb-8">
        <Handshake className="h-16 w-16 text-keepla-red" />
      </div>
    </div>
  );
};

export default PartnershipHero;
