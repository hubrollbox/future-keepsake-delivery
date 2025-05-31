
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Mail className="h-6 w-6 text-gold" />
            <div>
              <h3 className="font-semibold text-black">Email</h3>
              <p className="text-gray-600">geral@rollbox.pt</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Phone className="h-6 w-6 text-gold" />
            <div>
              <h3 className="font-semibold text-black">Telefone</h3>
              <p className="text-gray-600">220 145 169</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <MapPin className="h-6 w-6 text-gold" />
            <div>
              <h3 className="font-semibold text-black">Morada</h3>
              <p className="text-gray-600">
                Rua Brito Capelo<br />
                Edifício Diplomata<br />
                4450 Matosinhos<br />
                Portugal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-light-gold border border-gold">
        <CardContent className="p-6">
          <h3 className="font-semibold text-black mb-3">Horário de Atendimento</h3>
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">24 horas por dia, 7 dias por semana!</p>
            <p className="text-sm italic">Porque o tempo não para... e nós também não! ⏰</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-light-gold border border-gold">
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 text-gold mx-auto mb-4" />
          <h3 className="font-semibold text-black mb-2">Resposta Rápida</h3>
          <p className="text-gray-700 text-sm">
            Respondemos a todas as mensagens em menos de 24 horas. 
            O teu tempo é precioso para nós!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
