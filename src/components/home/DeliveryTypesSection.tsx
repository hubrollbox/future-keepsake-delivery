
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Mail, Heart } from "lucide-react";

const DeliveryTypesSection = () => {
  return (
    <div className="mb-16 md:mb-20 animate-fade-in">
      <h2 className="text-section-title-sm md:text-section-title text-steel-blue mb-4 md:mb-6 text-center font-fraunces">Três Formas de Viajar no Tempo</h2>
      <p className="text-body md:text-body-large text-misty-gray mb-8 md:mb-12 text-center max-w-3xl mx-auto leading-relaxed">
        Cada tipo de entrega é uma experiência única, adaptada às tuas necessidades e sonhos.
      </p>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <Card className="text-center p-6 md:p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-sand-beige border-2 border-dusty-rose/20 rounded-2xl group">
          <CardContent className="pt-6">
            <Gift className="h-12 w-12 md:h-16 md:w-16 text-earthy-burgundy mx-auto mb-4 md:mb-6 group-hover:animate-bounce-gentle" />
            <h3 className="font-fraunces font-bold mb-2 md:mb-3 text-lg md:text-xl text-steel-blue">Presente Físico</h3>
            <p className="text-misty-gray text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
              Guardamos o teu presente numa instalação segura e climatizada. Desde jóias a livros, cartas a brinquedos.
            </p>
            <p className="text-earthy-burgundy font-semibold text-sm md:text-base">A partir de 1,90€/mês</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 md:p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-sand-beige border-2 border-dusty-rose/20 rounded-2xl group">
          <CardContent className="pt-6">
            <Mail className="h-12 w-12 md:h-16 md:w-16 text-earthy-burgundy mx-auto mb-4 md:mb-6 group-hover:animate-bounce-gentle" />
            <h3 className="font-fraunces font-bold mb-2 md:mb-3 text-lg md:text-xl text-steel-blue">Mensagem Digital</h3>
            <p className="text-misty-gray text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
              Cartas escritas do coração, vídeos pessoais, fotos especiais. Tudo protegido com tecnologia blockchain.
            </p>
            <p className="text-earthy-burgundy font-semibold text-sm md:text-base">Verificação de autenticidade incluída</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 md:p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-sand-beige border-2 border-dusty-rose/20 rounded-2xl group">
          <CardContent className="pt-6">
            <Heart className="h-12 w-12 md:h-16 md:w-16 text-earthy-burgundy mx-auto mb-4 md:mb-6 group-hover:animate-bounce-gentle" />
            <h3 className="font-fraunces font-bold mb-2 md:mb-3 text-lg md:text-xl text-steel-blue">Cápsula do Tempo</h3>
            <p className="text-misty-gray text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
              Combina elementos físicos e digitais numa experiência única. Perfeito para marcos importantes da vida.
            </p>
            <p className="text-earthy-burgundy font-semibold text-sm md:text-base">Experiências personalizadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTypesSection;
