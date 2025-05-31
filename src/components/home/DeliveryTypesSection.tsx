
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Mail, Heart } from "lucide-react";

const DeliveryTypesSection = () => {
  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-black mb-4">Três Formas de Viajar no Tempo</h3>
      <p className="text-lg text-gray-600 mb-8">Cada tipo de entrega é uma experiência única, adaptada às tuas necessidades e sonhos.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
          <CardContent className="pt-6">
            <Gift className="h-12 w-12 text-gold mx-auto mb-4" />
            <h4 className="font-semibold mb-2 text-black">Presente Físico</h4>
            <p className="text-gray-700 text-sm mb-3">
              Guardamos o teu presente numa instalação segura e climatizada. Desde jóias a livros, cartas a brinquedos.
            </p>
            <p className="text-gold font-semibold text-xs">A partir de 1,90€/mês</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
          <CardContent className="pt-6">
            <Mail className="h-12 w-12 text-gold mx-auto mb-4" />
            <h4 className="font-semibold mb-2 text-black">Mensagem Digital</h4>
            <p className="text-gray-700 text-sm mb-3">
              Cartas escritas do coração, vídeos pessoais, fotos especiais. Tudo protegido com tecnologia blockchain.
            </p>
            <p className="text-gold font-semibold text-xs">Verificação de autenticidade incluída</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-light-gold border-2 border-gold">
          <CardContent className="pt-6">
            <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
            <h4 className="font-semibold mb-2 text-black">Cápsula do Tempo</h4>
            <p className="text-gray-700 text-sm mb-3">
              Combina elementos físicos e digitais numa experiência única. Perfeito para marcos importantes da vida.
            </p>
            <p className="text-gold font-semibold text-xs">Experiências personalizadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTypesSection;
