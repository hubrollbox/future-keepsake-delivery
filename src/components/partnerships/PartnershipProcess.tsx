
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PartnershipProcess = () => {
  return (
    <div className="mb-16">
      <Card className="bg-white shadow-lg max-w-4xl mx-auto border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gold">Como Tornar-se Parceiro</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Contacta-nos</h4>
              <p className="text-gray-600 text-sm">
                Envia-nos uma proposta através do nosso formulário de contacto
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Avaliação</h4>
              <p className="text-gray-600 text-sm">
                Analisamos a compatibilidade e o potencial da parceria
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Integração</h4>
              <p className="text-gray-600 text-sm">
                Formação e integração com as nossas plataformas e processos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnershipProcess;
