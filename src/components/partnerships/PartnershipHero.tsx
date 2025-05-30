
import { Handshake } from "lucide-react";

const PartnershipHero = () => {
  return (
    <div className="text-center max-w-4xl mx-auto mb-16">
      <h2 className="text-5xl font-bold text-black mb-6">
        <span className="text-gold">Parcerias</span>
        {" "}Estratégicas
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Junta-te à nossa rede de parceiros e ajuda-nos a transformar a forma como as pessoas experienciam o tempo e as memórias.
      </p>
      <div className="flex justify-center mb-8">
        <Handshake className="h-16 w-16 text-gold" />
      </div>
    </div>
  );
};

export default PartnershipHero;
