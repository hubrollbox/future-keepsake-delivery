
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Mail, Heart, Clock, Shield, Sparkles } from "lucide-react";

const DeliveryTypesDetailed = () => {
  return (
    <div className="mb-12 md:mb-20">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-steel-blue mb-8 md:mb-12 text-center font-fraunces">
        Três Formas de <span className="text-earthy-burgundy">Viajar no Tempo</span>
      </h2>
      <p className="text-lg md:text-xl text-misty-gray mb-8 md:mb-10 text-center max-w-4xl mx-auto leading-relaxed">
        Cada tipo de entrega é uma experiência única, adaptada às tuas necessidades e sonhos.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <Card className="p-6 md:p-8 hover:shadow-soft transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm border border-dusty-rose/20 group">
          <CardContent className="pt-6 text-center">
            <Gift className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto mb-6 group-hover:animate-bounce-gentle" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-steel-blue font-fraunces">Presente Físico</h3>
            <p className="text-misty-gray mb-6 leading-relaxed">
              Guardamos o teu presente numa instalação segura e climatizada. Desde jóias a livros, cartas a brinquedos.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-earthy-burgundy" />
                <span className="text-sm text-misty-gray">Armazém ultra-seguro</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-earthy-burgundy" />
                <span className="text-sm text-misty-gray">Controlo climático</span>
              </div>
            </div>
            <p className="text-earthy-burgundy font-semibold">A partir de 1,90€/mês</p>
          </CardContent>
        </Card>

        <Card className="p-6 md:p-8 hover:shadow-soft transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm border border-dusty-rose/20 group">
          <CardContent className="pt-6 text-center">
            <Mail className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto mb-6 group-hover:animate-bounce-gentle" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-steel-blue font-fraunces">Mensagem Digital</h3>
            <p className="text-misty-gray mb-6 leading-relaxed">
              Cartas escritas do coração, vídeos pessoais, fotos especiais. Tudo protegido com tecnologia blockchain.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-earthy-burgundy" />
                <span className="text-sm text-misty-gray">Verificação blockchain</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4 text-earthy-burgundy" />
                <span className="text-sm text-misty-gray">Múltiplos formatos</span>
              </div>
            </div>
            <p className="text-earthy-burgundy font-semibold">Verificação de autenticidade incluída</p>
          </CardContent>
        </Card>

        <Card className="p-6 md:p-8 hover:shadow-soft transition-all duration-300 hover:scale-105 rounded-2xl bg-white/70 backdrop-blur-sm border border-dusty-rose/20 group">
          <CardContent className="pt-6 text-center">
            <Heart className="h-16 w-16 md:h-20 md:w-20 text-earthy-burgundy mx-auto mb-6 group-hover:animate-bounce-gentle" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-steel-blue font-fraunces">Cápsula do Tempo</h3>
            <p className="text-misty-gray mb-6 leading-relaxed">
              Combina elementos físicos e digitais numa experiência única. Perfeito para marcos importantes da vida.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Gift className="h-4 w-4 text-earthy-burgundy" />
                <span className="text-sm text-misty-gray">Híbrido físico+digital</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-4 w-4 text-earthy-burgundy" />
                <span className="text-sm text-misty-gray">Totalmente personalizado</span>
              </div>
            </div>
            <p className="text-earthy-burgundy font-semibold">Experiências personalizadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTypesDetailed;
