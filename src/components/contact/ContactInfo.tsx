
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageCircle, Heart } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gold">
            <MessageCircle className="h-5 w-5" />
            <span>Vamos Conversar!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Estamos sempre disponíveis para te ajudar a criar a entrega temporal perfeita. 
            Seja uma dúvida simples ou um projecto especial, a nossa equipa está aqui para ti.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gold">
            <Mail className="h-5 w-5" />
            <span>Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 font-medium text-lg mb-2">geral@rollbox.pt</p>
          <p className="text-gray-600 text-sm">
            Para questões gerais, suporte técnico ou parcerias. 
            Respondemos normalmente em menos de 2 horas durante o horário de funcionamento.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gold">
            <Phone className="h-5 w-5" />
            <span>Telefone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 font-medium text-lg mb-2">220 145 169</p>
          <p className="text-gray-600 text-sm">
            Preferes falar directamente? Liga-nos! A nossa equipa de apoio está pronta 
            para esclarecer todas as tuas dúvidas sobre entregas temporais.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gold">
            <MapPin className="h-5 w-5" />
            <span>Morada</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-800 font-medium mb-2">
            <p>Rua Brito Capelo</p>
            <p>Edifício Diplomata</p>
            <p>4450 Matosinhos</p>
            <p>Portugal</p>
          </div>
          <p className="text-gray-600 text-sm">
            A nossa sede fica no coração de Matosinhos, pertinho do Porto. 
            És bem-vindo a visitar-nos (com marcação prévia).
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gold">
            <Clock className="h-5 w-5" />
            <span>Horário de Funcionamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 font-medium text-lg mb-2">
            Quase sempre disponíveis! 🚀
          </p>
          <div className="text-gray-600 text-sm space-y-1">
            <p><strong>Segunda a Sexta:</strong> 9h00 - 18h00</p>
            <p><strong>Sábados:</strong> 10h00 - 14h00</p>
            <p><strong>Domingos:</strong> Só para emergências temporais urgentes!</p>
            <p className="mt-3 italic">
              Mas sejamos honestos... quem é que não verifica o email ao domingo? 
              Se enviares uma mensagem, provavelmente vamos responder mesmo fora do horário. 
              Somos assim um bocadinho viciados em ajudar! 😄
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-gold/10 to-amber-100 border border-gold">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gold">
            <Heart className="h-5 w-5" />
            <span>Algo Especial em Mente?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-sm leading-relaxed">
            Tens uma ideia única para uma entrega temporal? Um projecto especial? 
            Uma proposta de casamento que queres agendar? Ou simplesmente queres 
            conversar sobre como o tempo funciona? Estamos aqui para transformar 
            as tuas ideias mais malucas em realidade!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
