
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Heart } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <Card className="emotion-card border-dusty-rose/20">
        <CardHeader>
          <CardTitle className="text-section-title-sm text-steel-blue font-fraunces flex items-center space-x-2">
            <Heart className="h-6 w-6 text-earthy-burgundy" />
            <span>Como Te Podemos Ajudar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-earthy-burgundy mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-steel-blue mb-1">Email</h3>
              <p className="text-misty-gray text-sm">geral@rollbox.pt</p>
              <p className="text-earthy-burgundy text-xs">Respondemos em 24h</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-earthy-burgundy mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-steel-blue mb-1">Telefone</h3>
              <p className="text-misty-gray text-sm">220 145 169</p>
              <p className="text-earthy-burgundy text-xs">Seg-Sex, 9h-18h</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-earthy-burgundy mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-steel-blue mb-1">Morada</h3>
              <div className="text-misty-gray text-sm">
                <p>Rua Brito Capelo</p>
                <p>Edifício Diplomata</p>
                <p>4450 Matosinhos, Portugal</p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-earthy-burgundy mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-steel-blue mb-1">Horário de Atendimento</h3>
              <div className="text-misty-gray text-sm space-y-1">
                <p>Segunda a Sexta: 9h - 18h</p>
                <p>Sábado: 10h - 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="emotion-card border-earthy-burgundy/20 bg-gradient-to-br from-earthy-burgundy/5 to-dusty-rose/10">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 text-earthy-burgundy mx-auto mb-4" />
          <h3 className="font-semibold text-steel-blue mb-2 font-fraunces">Apoio Dedicado</h3>
          <p className="text-misty-gray text-sm leading-relaxed">
            A nossa equipa está aqui para te ajudar a criar momentos especiais. 
            <span className="text-earthy-burgundy font-medium"> Cada contacto é tratado com carinho e atenção.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
