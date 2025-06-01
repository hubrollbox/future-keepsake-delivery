
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Mail, Heart, FileText, Video, Upload, Users, Trophy } from "lucide-react";

const DeliveryTypesDetailed = () => {
  return (
    <div className="mb-12 md:mb-20">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center">Tipos de Entrega Detalhados</h3>
      
      {/* Presente Físico */}
      <Card className="mb-8 md:mb-12 p-6 md:p-10 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-3xl">
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Gift className="h-10 w-10 md:h-12 md:w-12 text-amber-700 mr-4" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Presente Físico</h3>
            </div>
            <span className="ml-auto text-sm md:text-base bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-semibold">Desde 1,90€/mês</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              {[
                "Envia o teu presente para o nosso armazém seguro em Lisboa",
                "Recebemos, fotografamos e guardamos com cuidado climatizado 24/7",
                "Entregamos no local e data exactos que escolheste",
                "Ganhas selos temporais e sobes de nível como Guardião"
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-lg">
                    <span className="text-white text-sm md:text-base font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/60 p-4 md:p-6 rounded-2xl shadow-inner">
              <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-amber-700">Opções Disponíveis:</h4>
              <ul className="space-y-2 text-sm md:text-base text-gray-600 leading-relaxed">
                <li>• Envio próprio para armazém (gratuito)</li>
                <li>• Recolha em casa (€5 em Lisboa/Porto)</li>
                <li>• Compra por ti via link (comissão 10%)</li>
                <li>• Embrulho especial (+€3)</li>
                <li>• Seguro total incluído</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensagem Digital */}
      <Card className="mb-8 md:mb-12 p-6 md:p-10 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-3xl">
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Mail className="h-10 w-10 md:h-12 md:w-12 text-amber-700 mr-4" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Mensagem Digital</h3>
            </div>
            <span className="ml-auto text-sm md:text-base bg-yellow-100 text-amber-700 px-4 py-2 rounded-full font-semibold">Grátis - 9,90€</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: FileText, title: "Carta Escrita", desc: "Mensagem emocional com verificação blockchain opcional" },
              { icon: Video, title: "Vídeo Mensagem", desc: "Com edição profissional incluída nos planos premium" },
              { icon: Upload, title: "Ficheiros Especiais", desc: "Fotos, documentos, áudio até 100MB" }
            ].map((item, index) => (
              <Card key={index} className="p-4 md:p-6 bg-white/60 hover:bg-white/80 transition-all hover:scale-105 rounded-2xl">
                <CardContent className="pt-4">
                  <item.icon className="h-10 w-10 md:h-12 md:w-12 text-amber-700 mb-3 md:mb-4" />
                  <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">{item.title}</h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cápsula do Tempo */}
      <Card className="mb-8 md:mb-12 p-6 md:p-10 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-3xl">
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6 md:mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="h-10 w-10 md:h-12 md:w-12 text-amber-800 mr-4" />
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Cápsula do Tempo</h3>
            </div>
            <span className="ml-auto text-sm md:text-base bg-amber-200 text-amber-800 px-4 py-2 rounded-full font-semibold">Desde 15€</span>
          </div>
          
          <div className="text-center">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 leading-relaxed font-medium">
              Combina presentes físicos e digitais numa experiência única, individual ou colectiva
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: Gift, title: "Individual", price: "Desde 15€" },
                { icon: Users, title: "Colectiva", price: "Desde 49€" },
                { icon: Trophy, title: "Premium", price: "Desde 25€" },
                { icon: Heart, title: "Luxo", price: "Desde 40€" }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-all hover:scale-105">
                  <item.icon className="h-10 w-10 md:h-12 md:w-12 text-amber-700" />
                  <span className="text-gray-700 text-sm md:text-base font-bold">{item.title}</span>
                  <span className="text-xs md:text-sm text-gray-600 font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryTypesDetailed;
