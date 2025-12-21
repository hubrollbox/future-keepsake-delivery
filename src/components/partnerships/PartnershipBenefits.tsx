
import { Card, CardContent } from "@/components/ui/card";
import { Target, Award } from "lucide-react";

const PartnershipBenefits = () => {
  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-black mb-8 text-center">Por que Ser Nosso Parceiro?</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardContent className="p-8">
            <Target className="h-12 w-12 text-keepla-gray-dark mb-4" />
            <h4 className="text-xl font-semibold mb-4 text-black">Mercado em Crescimento</h4>
            <p className="text-gray-600">
              O mercado de experiências personalizadas e entregas programadas está em rápida expansão. 
              Junta-te a nós enquanto pioneiro neste setor inovador.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardContent className="p-8">
            <Award className="h-12 w-12 text-keepla-gray-dark mb-4" />
            <h4 className="text-xl font-semibold mb-4 text-black">Tecnologia Avançada</h4>
            <p className="text-gray-600">
              Acesso a tecnologia de ponta, incluindo sistemas de armazenamento seguros 
              e plataformas de gestão temporal inovadoras.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnershipBenefits;
