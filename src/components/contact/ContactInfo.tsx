import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Clock, MessageCircle, Heart } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-keepla-black font-inter font-bold">
            <MessageCircle className="h-5 w-5 text-keepla-red" />
            <span>Vamos Conversar!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed font-inter">
            Estamos sempre disponíveis para te ajudar a criar a entrega temporal perfeita. 
            Seja uma dúvida simples ou um projecto especial, a nossa equipa está aqui para ti.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-keepla-black font-inter font-bold">
            <Mail className="h-5 w-5 text-keepla-red" />
            <span>Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-keepla-black font-inter font-medium text-lg mb-2">info@keepla.pt</p>
          <p className="text-muted-foreground text-sm font-inter">
            Para questões gerais, suporte técnico ou parcerias. 
            Respondemos normalmente em menos de 2 horas durante o horário de funcionamento.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-keepla-black font-inter font-bold">
            <MapPin className="h-5 w-5 text-keepla-red" />
            <span>Morada</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-keepla-black font-inter font-medium mb-2">
            <p>Rua Brito Capelo</p>
            <p>Edifício Diplomata</p>
            <p>4450 Matosinhos</p>
            <p>Portugal</p>
          </div>
          <p className="text-muted-foreground text-sm font-inter">
            A nossa sede fica no coração de Matosinhos, pertinho do Porto. 
            És bem-vindo a visitar-nos (com marcação prévia).
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-keepla-black font-inter font-bold">
            <Clock className="h-5 w-5 text-keepla-red" />
            <span>Horário de Funcionamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-keepla-red font-inter font-medium text-lg mb-2">
            Quase sempre disponíveis! 🚀
          </p>
          <div className="text-muted-foreground text-sm font-inter space-y-1">
            <p><strong className="text-keepla-black">Segunda a Sexta:</strong> 9h00 - 18h00</p>
            <p><strong className="text-keepla-black">Sábados:</strong> 10h00 - 14h00</p>
            <p><strong className="text-keepla-black">Domingos:</strong> Só para emergências temporais urgentes!</p>
            <p className="mt-3 italic">
              Mas sejamos honestos... quem é que não verifica o email ao domingo? 
              Se enviares uma mensagem, provavelmente vamos responder mesmo fora do horário. 
              Somos assim um bocadinho viciados em ajudar! 😄
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-keepla-black text-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white font-inter font-bold">
            <Heart className="h-5 w-5 text-keepla-red" />
            <span>Algo Especial em Mente?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 text-sm leading-relaxed font-inter">
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
