
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Star, Gift } from "lucide-react";

const PartnershipTypes = () => {
  const partnershipTypes = [
    {
      icon: Building,
      title: "Empresas",
      description: "Soluções corporativas para eventos especiais, recompensas de funcionários e campanhas de marketing temporal.",
      benefits: ["Descontos em volume", "API personalizada", "Suporte dedicado"]
    },
    {
      icon: Gift,
      title: "Retailers",
      description: "Integração com lojas físicas e online para expandir os serviços de entrega programada.",
      benefits: ["Comissões atrativas", "Formação incluída", "Material promocional"]
    },
    {
      icon: Users,
      title: "Influenciadores",
      description: "Programa de afiliados para criadores de conteúdo que querem partilhar a magia do tempo.",
      benefits: ["Códigos de desconto exclusivos", "Comissões por referência", "Acesso antecipado"]
    }
  ];

  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-black mb-8 text-center">Tipos de Parcerias</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {partnershipTypes.map((type, index) => (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
            <CardHeader className="text-center">
              <type.icon className="h-12 w-12 text-gold mx-auto mb-4" />
              <CardTitle className="text-xl text-black">{type.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <div className="space-y-2">
                <h4 className="font-semibold text-gold text-sm">Benefícios:</h4>
                <ul className="space-y-1">
                  {type.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <Star className="h-3 w-3 text-gold mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PartnershipTypes;
